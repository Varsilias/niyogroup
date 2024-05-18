import { IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from 'src/common/helpers/enum';
import { CreateTaskDto } from './create-task.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNotEmpty({ message: 'status must not be empty' })
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;
}
