import { Module } from '@nestjs/common';
import { UserRepository } from './user/repositories/user.repository';
import { UserService } from './user/service/user.service';

@Module({
  providers: [UserRepository, UserService],
})
export class AuthModule {}
