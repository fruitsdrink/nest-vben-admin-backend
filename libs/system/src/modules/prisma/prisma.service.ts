import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: Logger) {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'colorless',
    });

    /** 解决 Do not know how to serialize a BigInt 错误 */
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  }

  onModuleDestroy() {
    this.$disconnect();
  }

  async onModuleInit() {
    this.$connect()
      .then(() => {
        this.logger.log('数据库连接成功');
      })
      .catch((error) => {
        this.logger.error('数据库连接失败:');
        this.logger.error(error);
      });
  }
}
