import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    super(
      process.env.NODE_ENV === 'development'
        ? {
            log: ['query', 'info', 'warn', 'error'],
            errorFormat: 'colorless',
          }
        : {},
    );

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
      .catch(() => {
        this.logger.error('数据库连接失败:');
        // this.logger.error(error);
        process.exit(1);
        // process.kill(process.pid, 'SIGTERM');
      });
  }
}
