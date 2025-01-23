import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { SysCacheService } from './sys-cache.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [SysCacheService],
  exports: [SysCacheService],
})
export class SysCacheModule {}
