import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskRepository } from '../repository/task.repository';
import { IDecoratorUser } from '../../../common/decorators/current-user.decorator';
import { paginateResponse } from '../../..//common/helpers/paginate';
import { NotFoundException } from '../../../common/exceptions/notfound.exception';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ServerErrorException } from '../../../common/exceptions/server-error.exception';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(createTaskDto: CreateTaskDto, user: IDecoratorUser) {
    const entity = this.taskRepository.create({
      ...createTaskDto,
      dueDate: new Date(createTaskDto.dueDate).toISOString(),
      user,
    });
    const task = await this.taskRepository.save(entity);
    return task;
  }

  async findAll(
    user: IDecoratorUser,
    page: string | number,
    perPage: string | number,
  ) {
    const data = await this.taskRepository.getTasksForUser(user);
    return paginateResponse(data, page, perPage);
  }

  async findOne(publicId: string, user: IDecoratorUser) {
    const task = await this.taskRepository.findOne({
      where: { publicId, user, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundException('Task not found', null);
    }

    return task;
  }

  async update(
    publicId: string,
    updateTaskDto: UpdateTaskDto,
    user: IDecoratorUser,
  ) {
    const task = await this.findOne(publicId, user);

    // We return early if there is nothing to update
    // save database resources
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
    return updateTask;
  }

  async remove(publicId: string, user: IDecoratorUser) {
    const task = await this.findOne(publicId, user);
    const payload = await this.taskRepository.softDelete({ id: task.id });

    if (!payload.affected || payload.affected <= 0) {
      throw new ServerErrorException('Unable to delete task');
    }
    return { message: 'Task deleted successfully' };
  }
}
