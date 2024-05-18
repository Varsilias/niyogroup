import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends CustomException {
  constructor(
    message = 'Bad Request Exception',
    data:
      | Record<string, any>
      | Array<string>
      | Array<Record<string, any>> = null,
    err?: any,
    code?: number,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(err, code, status, message, data);
  }
}
