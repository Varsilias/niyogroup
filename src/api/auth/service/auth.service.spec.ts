/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/service/user.service';
import { ConflictException } from '../../../common/exceptions/conflict.exception';
import { SignInDto, SignUpDto } from '../dtos';
import { ServerErrorException } from '../../../common/exceptions/server-error.exception';
import { BadRequestException } from '../../../common/exceptions/bad-request.exception';
import { UserEntity } from '../user/entities/user.entity';
import { NotFoundException } from '../../../common/exceptions/notfound.exception';
import * as utils from '../../../common/utils';
import { TokenService } from './token.service';

const mocks = {
  user: {
    id: 1,
    firstname: 'Daniel',
    lastname: 'Okoronkwo',
    email: 'daniel1@gmail.com',
    publicId: '8baf639c-0e78-4767-a634-c07efd779164',
    createdAt: '2024-05-17T17:06:17.045Z',
    updatedAt: '2024-05-17T17:06:17.045Z',
    deletedAt: null,
    emailConfirmed: false,
    isBlocked: false,
    blockedAt: null,
  },
  token: {
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YmFmNjM5Yy0wZTc4LTQ3NjctYTYzNC1jMDdlZmQ3NzkxNjQiLCJlbWFpbCI6ImRhbmllbDFAZ21haWwuY29tIiwiaWF0IjoxNzE2MDA3NjA1LCJleHAiOjE3MTYwMTEyMDV9.-bYQziECxVOKW6iMTXX-iRXqf3ciychxwAxubJERDk4',
    refresh: {
      secret: '123-secret',
      expiry: '14',
    },
  },
};

jest.mock('../../../common/utils');

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserBy: jest.fn().mockResolvedValue(mocks.user),
            createUser: jest.fn().mockResolvedValue(mocks.user),
          },
        },
        {
          provide: TokenService,
          useValue: {
            signAccessToken: jest.fn().mockResolvedValue(mocks.token.jwt),
            signRefreshToken: jest.fn().mockResolvedValue(mocks.token.jwt),
            verifyAccessToken: jest.fn().mockResolvedValue({
              email: mocks.user.email,
              sub: mocks.user.publicId,
            }),
            verifyRefreshToken: jest.fn().mockResolvedValue({
              email: mocks.user.email,
              sub: mocks.user.publicId,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Sign Up', () => {
    it('should throw a conflict exception error when duplicate email is found during sign up', async () => {
      const { firstname, lastname, email } = mocks.user;
      try {
        await service.signUp({
          firstname,
          lastname,
          email,
          password: 'P@ssword1234',
        });
      } catch (error: any) {
        expect(error.response).toBe('Email already taken');
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw a server exception error when empty data is passed in during sign up', async () => {
      jest.spyOn(userService, 'findUserBy').mockResolvedValue(null);

      try {
        await service.signUp({} as SignUpDto);
      } catch (error: any) {
        expect(error.response).toBe('Something went wrong, we are fixing it');
        expect(error).toBeInstanceOf(ServerErrorException);
      }
    });

    it('should sign up a new user and return successfully', async () => {
      jest.spyOn(userService, 'findUserBy').mockResolvedValue(null);
      const result = await service.signUp({
        email: 'test@gmail.com',
        password: 'P@assword1234',
      } as SignUpDto);
      expect(result).toBe(mocks.user);
    });
  });

  describe('Sign In', () => {
    it('should throw bad request exception error when user is not found', async () => {
      const { email } = mocks.user;
      jest.spyOn(userService, 'findUserBy').mockResolvedValue(null);

      try {
        await service.signIn({
          email,
          password: 'P@ssword1234',
        });
      } catch (error: any) {
        expect(error.response).toBe('Invalid Credentials');
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw not found exception error when user.deletedAt is not null', async () => {
      const { email } = mocks.user;
      const deletedAt = new Date(mocks.user.updatedAt);

      jest.spyOn(userService, 'findUserBy').mockResolvedValue({
        ...mocks.user,
        deletedAt: deletedAt,
      } as unknown as UserEntity);

      try {
        await service.signIn({
          email,
          password: 'P@ssword1234',
        });
      } catch (error: any) {
        expect(error.response).toBe('User not found');
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw bad request exception error when user is blocked', async () => {
      const { email } = mocks.user;
      const isBlocked = true;

      jest.spyOn(userService, 'findUserBy').mockResolvedValue({
        ...mocks.user,
        isBlocked: isBlocked,
      } as unknown as UserEntity);

      try {
        await service.signIn({
          email,
          password: 'P@ssword1234',
        });
      } catch (error: any) {
        expect(error.response).toBe(
          'Your account has been blocked, please contact support',
        );
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should sign in user and return response with access and refresh token', async () => {
      const { email } = mocks.user;
      (utils.comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn({
        email,
        password: 'P@assword1234',
      } as SignInDto);

      expect(result).toStrictEqual({
        access_token: mocks.token.jwt,
        refresh_token: mocks.token.jwt,
        user: mocks.user,
      });
    });
  });

  describe('Generate New Access Token', () => {
    it('should throw not found exception error when user.deletedAt is not null', async () => {
      const { jwt } = mocks.token;

      jest.spyOn(userService, 'findUserBy').mockResolvedValue({
        ...mocks.user,
        deletedAt: null,
      } as unknown as UserEntity);

      try {
        await service.generateNewAccessToken({
          refresh_token: jwt,
        });
      } catch (error: any) {
        expect(error.response).toBe('User not found');
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw bad request exception error when user is blocked', async () => {
      const { jwt } = mocks.token;
      const isBlocked = true;

      jest.spyOn(userService, 'findUserBy').mockResolvedValue({
        ...mocks.user,
        isBlocked: isBlocked,
      } as unknown as UserEntity);

      try {
        await service.generateNewAccessToken({
          refresh_token: jwt,
        });
      } catch (error: any) {
        expect(error.response).toBe(
          'Your account has been blocked, please contact support',
        );
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should verify and generate new access and refresh token for user', async () => {
      const { jwt } = mocks.token;
      (utils.comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await service.generateNewAccessToken({
        refresh_token: jwt,
      });

      expect(result).toStrictEqual({
        access_token: mocks.token.jwt,
        refresh_token: mocks.token.jwt,
        user: mocks.user,
      });
    });
  });
});
