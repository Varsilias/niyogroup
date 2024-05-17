import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CustomException } from '../exceptions/custom-exception';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  public catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.getStatus()).send({
      status: false,
      message: exception.getMessage(),
      data: exception.getData(),
    });
  }
}
