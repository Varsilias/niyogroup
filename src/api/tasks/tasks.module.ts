import { Module } from '@nestjs/common';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';
import { TaskRepository } from './repository/task.repository';
import { TaskGateway } from './gateway/task.gateway';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, TaskGateway],
})
export class TasksModule {}
