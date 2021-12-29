import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  const baseAddress = configService.get<string>('BASE_ADDRESS');

  await app.listen(port, baseAddress);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
