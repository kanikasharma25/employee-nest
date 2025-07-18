import { ValidationPipe, BadRequestException } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

   // 🔐 Enable global validation
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map(err => Object.values(err.constraints || {}))
          .flat();
  
        return new BadRequestException({
          success: false, // 👈 custom key
          statusCode: 400,
          error: 'Bad Request',
          message: messages,
        });
      },
    }),
  );
  

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);

}
bootstrap();
