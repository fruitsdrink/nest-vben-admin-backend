import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('system/permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
