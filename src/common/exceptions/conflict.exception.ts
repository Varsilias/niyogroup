import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

export class ConflictException extends CustomException {
  constructor(
    message = 'Conflict Exception',
    data: Record<string, any> | Array<string> | Array<Record<string, any>>,
    err?: any,
    code?: number,
    status: number = HttpStatus.CONFLICT,
  ) {
    super(err, code, status, message, data);
  }
}
