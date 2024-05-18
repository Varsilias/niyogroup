import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { BadRequestException } from '../../common/exceptions/bad-request.exception';
import { UnauthorisedException } from '../../common/exceptions/unauthorised.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!!isPublic) {
        return true;
      }
      const authorizationRes = await super.canActivate(context);
      return !!authorizationRes;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorisedException('Unauthorised');
      }

      throw new BadRequestException('Invalid token user or token mismatch');
    }
  }
}
