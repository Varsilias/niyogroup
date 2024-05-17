import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Generated,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export class BaseEntity<T = any> {
  // This is what we use internally as a foreign key, but never expose to the public because leaking user counts is
  // a company trade secrets issue
  // (Running counter keys make data more local and faster to access)
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Entity Blocked Status',
  })
  @Exclude()
  isBlocked!: boolean;

  // Nice columns for internal statistics and diagnostics
  @Column({ type: 'timestamptz', nullable: true })
  @Exclude()
  blockedAt: Date;

  // Already refer users by this id when in the APIs .
  // (Randomized public ids make data exposure safer)
  @Column({ unique: true })
  @Generated('uuid')
  publicId: string;

  // Nice columns for internal statistics and diagnostics
  // We assume all servers tick UTC, but we always preserve timezone for
  // our sanity when something gets messy
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'LOCALTIMESTAMP',
    nullable: false,
    comment: 'Entity Created At',
  })
  createdAt!: Date;

  // Nice columns for internal statistics and diagnostics
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'LOCALTIMESTAMP',
    nullable: false,
    comment: 'Entity Updated At',
  })
  updatedAt!: Date;

  // Nice columns for internal statistics and diagnostics
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    comment: 'Entity Deleted At',
  })
  deletedAt!: Date;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
