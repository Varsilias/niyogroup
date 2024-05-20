import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../service/auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client = context.switchToWs().getClient<Socket>();
    return this.validateUser(client);
  }

  async validateUser(client: Socket) {
    const { authorization } = client.handshake.headers;

    const [type, token] = authorization?.split(' ') ?? [];

    const access_token = type === 'Bearer' ? token : null;

    if (!access_token) {
      return false;
    }

    const user = await this.authService.validateUser(access_token);

    client.data.user = user;

    return !!user;
  }
}
