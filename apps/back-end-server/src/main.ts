import { HttpResponseInterceptor } from '@app/utils';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import chalk from 'chalk'; // 引入chalk模块
import { join } from 'path';
import { AppModule } from './app.module';
import { Configuration } from './types';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService) as ConfigService<Configuration>;

  app.setGlobalPrefix('/api');

  // 全局拦截器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // 全局拦截器
  app.useGlobalInterceptors(new HttpResponseInterceptor());

  // 静态资源
  app.useStaticAssets(join(process.cwd(), 'public', 'back-end-server'), {
    prefix: '/public',
  });

  // swagger
  const enableSwagger = configService.get('http.enableSwagger', {
    infer: true,
  });
  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Nest-Vben-Admin-Backend')
      .setDescription('Nest Vben Admin 管理端接口文档')
      .setVersion('1.0.0')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('doc', app, documentFactory);
  }

  const port = configService.get('http.port', { infer: true }); // 获取配置文件中的端口号

  await app.listen(port, () => {
    console.log(
      chalk.green(`Nest-Vben-Admin-Backend is running on: ${port} ^_^`),
    );
  });
}
bootstrap();
