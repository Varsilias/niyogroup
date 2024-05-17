import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationException extends CustomException {
  constructor(
    message = 'Validation Exception',
    data: Record<string, any> | Array<string> | Array<Record<string, any>>,
    err?: any,
    code?: number,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(err, code, status, message, data);
  }
}
