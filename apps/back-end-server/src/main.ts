import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService) as ConfigService<Configuration>;
  const port = configService.get('http.port', { infer: true }); // 获取配置文件中的端口号

  console.log(port);
  await app.listen(port, () => {
    console.log(`Nest-Vben-Admin-Backend is running on: ${port}`);
  });
}
bootstrap();
