import { Module } from '@nestjs/common';
import { PrismaModule } from './modules';

@Module({
  imports: [PrismaModule],
})
export class SystemModule {}
