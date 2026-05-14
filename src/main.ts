import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: () => new BadRequestException({ message: 'Dados inválidos' }),
    }),
  );
  await app.listen(process.env.PORT ?? 3006);
}
bootstrap();
