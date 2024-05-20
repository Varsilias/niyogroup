import { Injectable, Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TaskEntity } from '../entities/task.entity';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';
import { AuthService } from '../../auth/service/auth.service';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
@UseGuards(WsJwtGuard)
export class TaskGateway implements OnModuleInit, OnGatewayInit {
  private readonly logger = new Logger(TaskGateway.name);

  @WebSocketServer()
  private server: Server;

  constructor(private readonly authService: AuthService) {}

  onModuleInit() {
    this.server.on('connection', (socketInstance) => {
      this.logger.debug(socketInstance.id);
      this.logger.log('Socket Connection established!');
    });
  }

  afterInit(server: Socket) {
    server.use((client: any, next) => {
      this.validateConnection(client, next);
    });
  }
  /* handle realtime streaming of created task */
  @SubscribeMessage('task/create')
  handleCreateTask(@MessageBody() data: TaskEntity) {
    delete data.user;
    this.server.emit('task/new', data);
  }

  /* handle realtime streaming of the update made to a task */
  //   @SubscribeMessage('task/update')
  handleUpdateTask(@MessageBody() data: TaskEntity) {
    delete data.user;
    this.server.emit(`task/update/${data.publicId}`, data);
  }

  /* handle realtime streaming of a deleted task */
  //   @SubscribeMessage('task/delete')
  handleDeleteTask(
    @MessageBody()
    data: {
      deleted: boolean;
      message: string;
      data: TaskEntity;
    },
  ) {
    this.server.emit(`task/delete/${data.data.publicId}`, data);
  }

  // handle authentication to the websocket gateway
  // we include this because we want only authenticated
  // users to access the websocket connection
  validateConnection(client: any, next: (error?: Error) => void) {
    try {
      const { authorization } = client.handshake.headers;

      const [type, token] = authorization?.split(' ') ?? [];

      const access_token = type === 'Bearer' ? token : null;

      this.authService
        .validateUser(access_token)
        .then((user) => {
          client.data.user = user;
          next();
        })
        .catch((error) => {
          this.logger.error(`Line 82 - ${JSON.stringify(error)}`);
          next(error);
          client.emit('error', error);
          client.disconnect(true);
        });
    } catch (error) {
      this.logger.error(`Line 89 - ${JSON.stringify(error)}`);
      next(error);
      client.emit('error', error);
      client.disconnect(true);
    }
  }
}
