import { AuthUser } from '@/types/prisma';
import { User } from '@lib/system';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: '获取用户信息' })
  @Get('info')
  async info(@User() user: AuthUser) {
    return await this.service.info(user);
  }
}
