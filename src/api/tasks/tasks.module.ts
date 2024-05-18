import { Module } from '@nestjs/common';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';
import { TaskRepository } from './repository/task.repository';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TasksModule {}
