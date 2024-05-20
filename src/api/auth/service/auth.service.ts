import { Injectable, Logger } from '@nestjs/common';
import { SignUpDto } from '../dtos';
import { UserService } from '../user/service/user.service';
import { ConflictException } from '../../../common/exceptions/conflict.exception';
import * as crypto from 'crypto';
import { comparePassword, hashPassword } from '../../../common/utils';
import { ServerErrorException } from '../../../common/exceptions/server-error.exception';
import { SignInDto } from '../dtos/sign-in.dto';
import { BadRequestException } from '../../../common/exceptions/bad-request.exception';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { NotFoundException } from '../../../common/exceptions/notfound.exception';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { TokenService } from './token.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    const userExists = await this.userService.findUserBy({ email });

    if (userExists) {
      throw new ConflictException('Email already taken', null);
    }

    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashPassword(password, salt);

      const user = await this.userService.createUser({
        ...signUpDto,
        password: hash,
        salt: salt,
      });

      return user;
    } catch (error: any) {
      this.logger.error(error);
      throw new ServerErrorException(
        'Something went wrong, we are fixing it',
        null,
      );
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password: userPassword } = signInDto;
    const user = await this.userService.findUserBy({ email });

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (user.deletedAt !== null) {
      throw new NotFoundException(`User not found`, null);
    }

    if (user.isBlocked || user.blockedAt !== null) {
      throw new BadRequestException(
        'Your account has been blocked, please contact support',
      );
    }

    const isPasswordMatch = comparePassword(
      userPassword,
      user.salt,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload = {
      sub: user.publicId,
      email: user.email,
    };

    const accessToken = await this.tokenService.signAccessToken(payload);
    const refreshToken = await this.tokenService.signRefreshToken(payload);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
    };
  }

  async generateNewAccessToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;

    try {
      const { sub, email } =
        await this.tokenService.verifyRefreshToken(refresh_token);

      const user = await this.userService.findUserBy({ email, publicId: sub });

      if (user.deletedAt !== null) {
        throw new NotFoundException(`User not found`, null);
      }

      if (user.isBlocked || user.blockedAt !== null) {
        throw new BadRequestException(
          'Your account has been blocked, please contact support',
        );
      }

      const payload = {
        sub: user.publicId,
        email: user.email,
      };

      const accessToken = await this.tokenService.signAccessToken(payload);
      const refreshToken = await this.tokenService.signRefreshToken(payload);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user,
      };
    } catch (error: any) {
      this.logger.error(error);

      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException(error?.message ?? 'Invalid Token', null);
      }

      if (error instanceof TokenExpiredError) {
        throw new BadRequestException(error?.message ?? 'Token Expired', null);
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new ServerErrorException(
        error?.message ?? 'Something went wrong, we are fixing it',
        null,
      );
    }
  }

  async validateUser(access_token: string) {
    try {
      const { sub, email } =
        await this.tokenService.verifyAccessToken(access_token);

      const user = await this.userService.findUserBy({ email, publicId: sub });

      if (user.deletedAt !== null) {
        throw new NotFoundException(`User not found`, null);
      }

      if (user.isBlocked || user.blockedAt !== null) {
        throw new BadRequestException(
          'Your account has been blocked, please contact support',
        );
      }

      return user;
    } catch (error: any) {
      this.logger.error(error);

      if (error instanceof JsonWebTokenError) {
        throw new WsException(error?.message ?? 'Invalid Token');
      }

      if (error instanceof TokenExpiredError) {
        throw new WsException(error?.message ?? 'Token Expired');
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new WsException(
        error?.message ?? 'Something went wrong, we are fixing it',
      );
    }
  }
}
