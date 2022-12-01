import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  await app.listen(port);
  console.info(`SERVER IS RUNNING ON PORT: ${port}`);
})();
