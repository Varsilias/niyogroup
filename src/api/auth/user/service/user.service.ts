import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { SignUpDto } from '../../dtos';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserBy(criteria: Partial<UserEntity>) {
    const user = await this.userRepository.findOneBy({ ...criteria });
    return user;
  }

  async createUser(payload: SignUpDto & { salt: string }) {
    const entity = this.userRepository.create(payload);
    const user = this.userRepository.save(entity);
    return user;
  }
}
