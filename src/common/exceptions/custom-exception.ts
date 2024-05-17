import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  private error;
  private code;
  private customMsg;
  private data;

  constructor(
    err: any,
    code: number,
    status: number,
    message: string,
    data: any = [],
  ) {
    const customMsg = typeof err === 'string' ? err : message;
    super(customMsg, status);

    this.customMsg = customMsg;
    this.code = code;
    this.data = data;
    this.setError(err);
  }

  public setError(err) {
    if (typeof err !== 'string') {
      this.error = err;
    }
    return this;
  }

  public getCode(): any {
    return this.code;
  }

  public getError(): any {
    return this.error;
  }

  public getMessage(): string {
    return this.customMsg;
  }

  public getData(): string {
    return this.data;
  }

  public setMessage(str) {
    this.customMsg = str;
    return this;
  }
}
