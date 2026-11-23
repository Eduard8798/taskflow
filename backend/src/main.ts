
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  app.setGlobalPrefix('api');

  const port = Number(configService.get('PORT', 3033));

  await app.listen(port);

  console.log(`Server running on http://localhost:${port}/api`);

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
  );
}

void bootstrap();
