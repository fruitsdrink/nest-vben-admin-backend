import { Controller, Get } from '@nestjs/common';
import { AppServerService } from './app-server.service';

@Controller()
export class AppServerController {
  constructor(private readonly appServerService: AppServerService) {}

  @Get()
  getHello(): string {
    return this.appServerService.getHello();
  }
}
