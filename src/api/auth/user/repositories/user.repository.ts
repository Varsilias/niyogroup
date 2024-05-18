import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

/* 
  This class uses the "USERENTITY" class to handle interaction with the "USERS" table
*/
@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private datasource: DataSource) {
    super(UserEntity, datasource.createEntityManager());
  }
}
