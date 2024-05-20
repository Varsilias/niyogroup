import { Module } from '@nestjs/common';
import { UserRepository } from './user/repositories/user.repository';
import { UserService } from './user/service/user.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { TokenService } from './service/token.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.JWT_ACCESS_TOKEN_SECRET,
        signOptions: {
          expiresIn: `${config.JWT_ACCESS_TOKEN_EXPIRY}m`,
        },
      }),
    }),
  ],
  providers: [UserRepository, UserService, AuthService, TokenService],
  controllers: [AuthController],
  exports: [UserService, AuthService],
})
export class AuthModule {}
