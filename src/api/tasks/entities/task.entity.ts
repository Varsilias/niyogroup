import { TaskStatus } from '../../../common/helpers/enum';
import { BaseEntity } from '../../../common/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../auth/user/entities/user.entity';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity<TaskEntity> {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Task Due Date',
  })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    enumName: 'TaskStatusEnum',
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user: UserEntity;
}
