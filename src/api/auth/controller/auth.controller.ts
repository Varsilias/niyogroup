import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dtos';
import { SignInDto } from '../dtos/sign-in.dto';
import { Public } from '../../../common/decorators/public-request.decorator';
import {
  CurrentUser,
  IDecoratorUser,
} from 'src/common/decorators/current-user.decorator';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Public()
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh-token')
  @Public()
  getNewRefreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.generateNewAccessToken(refreshTokenDto);
  }
  @Get('me')
  me(
    @CurrentUser()
    {
      firstname,
      lastname,
      email,
      emailConfirmed,
      publicId,
      createdAt,
      updatedAt,
      deletedAt,
    }: IDecoratorUser,
  ) {
    // Sending only essential and non-sensitive information
    return {
      firstname,
      lastname,
      email,
      emailConfirmed,
      publicId,
      createdAt,
      updatedAt,
      deletedAt,
    };
  }
}
