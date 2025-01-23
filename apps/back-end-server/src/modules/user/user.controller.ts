import { AuthUser } from '@/types/prisma';
import { User } from '@lib/system';
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('info')
  async info(@User() user: AuthUser) {
    return await this.service.info(user);
  }
}
