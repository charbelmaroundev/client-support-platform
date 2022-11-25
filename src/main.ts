import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT);
  console.info(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
})();
