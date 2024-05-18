import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import {
  CurrentUser,
  IDecoratorUser,
} from '../../../common/decorators/current-user.decorator';
import { TaskService } from '../service/task.service';
import { UpdateTaskDto } from '../dtos/update-task.dto';
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get()
  async getTasks(
    @CurrentUser() user: IDecoratorUser,
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    return this.taskService.findAll(user, page, perPage);
  }

  @Get(':publicId')
  getTask(@Param('publicId') publicId: string, user: IDecoratorUser) {
    return this.taskService.findOne(publicId, user);
  }

  @Patch(':publicId')
  updateTask(
    @Param('publicId') publicId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    user: IDecoratorUser,
  ) {
    return this.taskService.update(publicId, updateTaskDto, user);
  }

  @Delete(':publicId')
  deleteTask(@Param('publicId') publicId: string, user: IDecoratorUser) {
    return this.taskService.remove(publicId, user);
  }
}
