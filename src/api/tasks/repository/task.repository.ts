import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { IDecoratorUser } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(private datasource: DataSource) {
    super(TaskEntity, datasource.createEntityManager());
  }

  async getTasksForUser(user: IDecoratorUser): Promise<[TaskEntity[], number]> {
    const entities = await this.createQueryBuilder()
      .select('tasks')
      .from(TaskEntity, 'tasks')
      .where('tasks.user = :id', { id: user.id })
      .where('tasks.deletedAt IS NULL')
      .orderBy('tasks.createdAt', 'DESC')
      .getMany();

    // due the know bug with the "getManyAndCount" method in typorm, we use the length of the
    // returned array to represent the number of rows that match the criteria
    return [entities, entities.length];
  }
}
