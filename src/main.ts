import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { ParamValidationPipe } from './common/pipes/param-validation.pipe';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.useGlobalPipes(new ParamValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, stopAtFirstError: true }),
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  await app.listen(config.PORT);
}
bootstrap();
