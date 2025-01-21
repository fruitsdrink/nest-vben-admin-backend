import { Module } from '@nestjs/common';
import { PrismaModule } from './modules';
import { UtilsService } from './utils.service';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
  imports: [PrismaModule],
})
export class UtilsModule {}
