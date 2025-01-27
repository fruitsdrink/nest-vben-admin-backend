import { AuthUser } from '@/types/prisma';
import { CurrentUser } from '@lib/system';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';

@ApiTags('菜单')
@Controller('menu')
export class MenuController {
  constructor(private readonly service: MenuService) {}

  @ApiOperation({ summary: '获取菜单列表' })
  @Get('all')
  all(@CurrentUser() user: AuthUser) {
    return this.service.all(user.id);
  }
}
