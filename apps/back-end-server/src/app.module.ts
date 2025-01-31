import configuration from '@/config/configuration';
import { HttpLogMiddleware, JwtAuthGuard, SystemModule } from '@lib/system';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import dayjs from 'dayjs';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { join } from 'path';
import winston from 'winston';
import { AuthModule } from './modules';

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('back-end-server', {
      colors: true,
      prettyPrint: true,
      processId: true,
      appName: true,
    }),
  ),
});

const fileTransport = new winston.transports.File({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('back-end-server', {
      colors: false,
      prettyPrint: true,
      processId: true,
      appName: true,
    }),
  ),
  filename: join(
    process.cwd(),
    'logs',
    'back-end-server',
    `${dayjs().format('YYYY-MM-DD')}.log`,
  ),
});

const transports = [fileTransport] as any[];

if (process.env.NODE_ENV === 'development') {
  transports.push(consoleTransport);
}
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    WinstonModule.forRoot({
      transports,
    }),
    SystemModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLogMiddleware).forRoutes('*');
  }
}
