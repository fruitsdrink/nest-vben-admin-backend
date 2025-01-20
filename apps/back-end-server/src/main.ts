import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import chalk from 'chalk'; // 引入chalk模块
import { AppModule } from './app.module';
import { Configuration } from './types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  // 全局拦截器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService) as ConfigService<Configuration>;
  const port = configService.get('http.port', { infer: true }); // 获取配置文件中的端口号

  await app.listen(port, () => {
    console.log(
      chalk.green(`Nest-Vben-Admin-Backend is running on: ${port} ^_^`),
    );
  });
}
bootstrap();
