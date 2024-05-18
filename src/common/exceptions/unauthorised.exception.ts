import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

export class UnauthorisedException extends CustomException {
  constructor(
    message = 'Unauthorised Exception',
    data:
      | Record<string, any>
      | Array<string>
      | Array<Record<string, any>> = null,
    err?: any,
    code?: number,
    status: number = HttpStatus.UNAUTHORIZED,
  ) {
    super(err, code, status, message, data);
  }
}
