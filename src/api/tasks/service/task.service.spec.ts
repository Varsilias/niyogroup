/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from '../repository/task.repository';
import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../../auth/user/entities/user.entity';
import * as paginate from '../../../common/helpers/paginate';
import { NotFoundException } from '../../../common/exceptions/notfound.exception';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ServerErrorException } from '../../../common/exceptions/server-error.exception';
import { TaskStatus } from '../../../common/helpers/enum';
import { TaskGateway } from '../gateway/task.gateway';

const mocks = {
  task: {
    id: 3,
    title: 'Task 3',
    description: 'Description 3',
    body: 'Body 3',
    dueDate: '2034-03-10T14:30:00.000Z',
    user: {
      id: 1,
      publicId: '8baf639c-0e78-4767-a634-c07efd779164',
      createdAt: '2024-05-17T17:06:17.045Z',
      updatedAt: '2024-05-17T17:06:17.045Z',
      deletedAt: null,
      firstname: 'Daniel',
      lastname: 'Okoronkwo',
      email: 'daniel1@gmail.com',
      emailConfirmed: false,
    },
    publicId: 'b6d13ace-b6a4-40be-b8fb-6b1030aade1d',
    createdAt: '2024-05-18T18:59:11.091Z',
    updatedAt: '2024-05-18T18:59:11.091Z',
    deletedAt: null,
    status: 'PENDING',
  },
  updateResult: {
    raw: 'raw-test',
    records: [1],
    affected: 1,
  },
  createtasks: (mockTask: any) => [[mockTask], 1] as [TaskEntity[], number],
  findAllResponse: {
    data: [
      {
        publicId: 'b6d13ace-b6a4-40be-b8fb-6b1030aade1d',
        createdAt: '2024-05-18T18:59:11.091Z',
        updatedAt: '2024-05-18T18:59:11.091Z',
        deletedAt: null,
        title: 'Task 3',
        description: 'Description 3',
        body: 'Body 3',
        dueDate: '2034-03-10T14:30:00.000Z',
        status: 'PENDING',
        user: {
          id: 1,
          publicId: '8baf639c-0e78-4767-a634-c07efd779164',
          createdAt: '2024-05-17T17:06:17.045Z',
          updatedAt: '2024-05-17T17:06:17.045Z',
          deletedAt: null,
          firstname: 'Daniel',
          lastname: 'Okoronkwo',
          email: 'daniel1@gmail.com',
          emailConfirmed: false,
        },
      },
    ],
    count: 1,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    lastPage: 1,
  },
};

jest.mock('../../../common/helpers/paginate');

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mocks.task),
            save: jest.fn().mockResolvedValue(mocks.task),
            getTasksForUser: jest
              .fn()
              .mockResolvedValue(mocks.createtasks(mocks.task)),
            findOne: jest.fn().mockResolvedValue(mocks.task),
            update: jest.fn().mockResolvedValue(mocks.updateResult),
            softDelete: jest.fn().mockResolvedValue(mocks.updateResult),
          },
        },
        {
          provide: TaskGateway,
          useValue: {
            handleCreateTask: jest.fn(),
            handleUpdateTask: jest.fn(),
            handleDeleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateTask', () => {
    it('should create new task', async () => {
      const { body, dueDate, description, title } = mocks.task;
      const result = await service.createTask(
        { body, dueDate: new Date(dueDate), description, title },
        mocks.task.user as unknown as UserEntity,
      );
      expect(result).toStrictEqual(mocks.task);
    });
  });

  describe('FindAll', () => {
    it('should return a paginated response of task list', async () => {
      (paginate.paginateResponse as jest.Mock).mockResolvedValue(
        mocks.findAllResponse,
      );

      const result = await service.findAll(
        // making typescript happy since it is not our major priority here
        mocks.task.user as unknown as UserEntity,
        1,
        10,
      );
      expect(result).toStrictEqual(mocks.findAllResponse);
    });
  });

  describe('FindOne', () => {
    it('should throw a not found exception if task is not found', async () => {
      const { publicId, user } = mocks.task;
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
      try {
        await service.findOne(publicId, user as unknown as UserEntity);
      } catch (error) {
        expect(error.response).toBe('Task not found');
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return a task', async () => {
      const { publicId, user } = mocks.task;
      const result = await service.findOne(
        publicId,
        user as unknown as UserEntity,
      );
      expect(result).toStrictEqual(mocks.task);
    });
  });
  describe('Update', () => {
    it('should throw a server error exception if unable to update found', async () => {
      const { publicId, user } = mocks.task;
      jest.spyOn(taskRepository, 'update').mockResolvedValue({
        ...mocks.updateResult,
        affected: 0,
        generatedMaps: [],
      });
      try {
        await service.update(
          publicId,
          {} as UpdateTaskDto,
          user as unknown as UserEntity,
        );
      } catch (error) {
        expect(error.response).toBe('Unable to update task');
        expect(error).toBeInstanceOf(ServerErrorException);
      }
    });

    it('should return an updated task', async () => {
      const { publicId, user } = mocks.task;
      const status = 'DONE';
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mocks.task,
        status: TaskStatus.DONE,
      } as unknown as TaskEntity);
      const result = await service.update(
        publicId,
        { status } as UpdateTaskDto,
        user as unknown as UserEntity,
      );
      expect(result).toStrictEqual({
        ...mocks.task,
        status,
      });
    });
  });

  describe('Delete', () => {
    it('should throw a server error exception if unable to delete found', async () => {
      const { publicId, user } = mocks.task;
      jest.spyOn(taskRepository, 'softDelete').mockResolvedValue({
        ...mocks.updateResult,
        affected: 0,
        generatedMaps: [],
      });
      try {
        await service.remove(publicId, user as unknown as UserEntity);
      } catch (error) {
        expect(error.response).toBe('Unable to delete task');
        expect(error).toBeInstanceOf(ServerErrorException);
      }
    });

    it('should return an updated task', async () => {
      const { publicId, user } = mocks.task;
      const result = await service.remove(
        publicId,
        user as unknown as UserEntity,
      );
      expect(result).toStrictEqual({ message: 'Task deleted successfully' });
    });
  });
});
