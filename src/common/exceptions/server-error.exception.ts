import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

export class ServerErrorException extends CustomException {
  constructor(
    message = 'Server Error Exception',
    data:
      | Record<string, any>
      | Array<string>
      | Array<Record<string, any>> = null,
    err?: any,
    code?: number,
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(err, code, status, message, data);
  }
}
