import { BaseEntity } from '../../../../common/entities/base-entity';
import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ type: 'varchar' })
  firstname: string;

  @Column({ type: 'varchar' })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar' })
  @Exclude()
  salt: string;

  @Column({ default: false })
  emailConfirmed?: boolean;

  @Column({ length: 16, nullable: true })
  @Exclude()
  securityToken?: string;

  // When the user registered / requested email change
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  @Exclude()
  securityTokenRequestedAt?: Date;
}
