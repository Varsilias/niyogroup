import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../../api/auth/user/entities/user.entity';

export type IDecoratorUser = UserEntity;
export const extractUser = (request): IDecoratorUser => request['user'];

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? extractUser(request)[data] : extractUser(request);
  },
);
