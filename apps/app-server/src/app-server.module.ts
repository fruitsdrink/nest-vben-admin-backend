import { Module } from '@nestjs/common';
import { AppServerController } from './app-server.controller';
import { AppServerService } from './app-server.service';

@Module({
  imports: [],
  controllers: [AppServerController],
  providers: [AppServerService],
})
export class AppServerModule {}
