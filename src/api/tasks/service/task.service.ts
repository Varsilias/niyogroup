import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskRepository } from '../repository/task.repository';
import { IDecoratorUser } from '../../../common/decorators/current-user.decorator';
import { paginateResponse } from '../../..//common/helpers/paginate';
import { NotFoundException } from '../../../common/exceptions/notfound.exception';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ServerErrorException } from '../../../common/exceptions/server-error.exception';
import { TaskGateway } from '../gateway/task.gateway';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskGateway: TaskGateway,
  ) {}

  /* Add new task to the database and broadcast the newly created task to socket listeners */
  async createTask(createTaskDto: CreateTaskDto, user: IDecoratorUser) {
    const entity = this.taskRepository.create({
      ...createTaskDto,
      dueDate: new Date(createTaskDto.dueDate).toISOString(),
      user,
    });
    const task = await this.taskRepository.save(entity);
    this.taskGateway.handleCreateTask(task);
    return task;
  }

  /* Fetch All Tasks that belong to currently logged in user */
  async findAll(
    user: IDecoratorUser,
    page: string | number,
    perPage: string | number,
  ) {
    const data = await this.taskRepository.getTasksForUser(user);
    return paginateResponse(data, page, perPage);
  }

  /* Find specific task that belong to currently logged in user using the "publicId"
    return "Task not found" if no criteria matches
  */
  async findOne(publicId: string, user: IDecoratorUser) {
    const task = await this.taskRepository.findOne({
      where: { publicId, user, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundException('Task not found', null);
    }

    return task;
  }

  /* Update task that belong to currently logged in user */
  async update(
    publicId: string,
    updateTaskDto: UpdateTaskDto,
    user: IDecoratorUser,
  ) {
    const task = await this.findOne(publicId, user);

    // We save database resources by return early if there is nothing to update
    if (
      !updateTaskDto ||
      !Object.values(updateTaskDto).every((item) => {
        return !!item;
      })
    ) {
      return task;
    }
    const payload = await this.taskRepository.update(
      { id: task.id },
      { ...updateTaskDto },
    );

    if (!payload.affected || payload.affected <= 0) {
      throw new ServerErrorException('Unable to update task');
    }

    const updateTask = await this.findOne(publicId, user);
    this.taskGateway.handleUpdateTask(updateTask);
    return updateTask;
  }

  /* Soft Delete a task provided it belongs to the currently logged in user
     We use soft delete for several reasons such as accidental deletion by user,
     for easy restoration of data in the future but most importantly "analytics",
     We can further save database resources by archiving soft deleted resources after
     a certain period of time
  */
  async remove(publicId: string, user: IDecoratorUser) {
    const task = await this.findOne(publicId, user);
    const payload = await this.taskRepository.softDelete({ id: task.id });

    if (!payload.affected || payload.affected <= 0) {
      throw new ServerErrorException('Unable to delete task');
    }
    const message = { message: 'Task deleted successfully' };
    this.taskGateway.handleDeleteTask({
      deleted: true,
      ...message,
      data: {
        ...task,
      },
    });
    return message;
  }
}
