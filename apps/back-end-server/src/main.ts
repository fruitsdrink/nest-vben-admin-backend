import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('http.port');
  console.log(port);
  await app.listen(port, () => {
    console.log(`Nest-Vben-Admin-Backend is running on: ${port}`);
  });
}
bootstrap();
