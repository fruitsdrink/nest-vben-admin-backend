import { NestFactory } from '@nestjs/core';
import { AppServerModule } from './app-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AppServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
