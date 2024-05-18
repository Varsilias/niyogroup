import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: '"title" must be a string' })
  @IsNotEmpty({ message: '"title" is required' })
  title: string;

  @IsString({ message: '"description" must be a string' })
  @IsNotEmpty({ message: '"description" is required' })
  description: string;

  @IsString({ message: '"body" must be a string' })
  @IsNotEmpty({ message: '"body" is required' })
  body: string;

  @IsDateString({}, { message: '"dueDate" must match the format: ' })
  @IsNotEmpty({ message: '"dueDate" is required' })
  dueDate: Date;
}
