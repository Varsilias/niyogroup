import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [ApiModule, DatabaseModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
