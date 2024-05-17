import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom-exception';

export class AppException extends CustomException {
  constructor(
    err: any,
    code: number,
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    message = 'App Exception',
    data?: Record<string, any>,
  ) {
    super(err, code, status, message, data);
  }
}
