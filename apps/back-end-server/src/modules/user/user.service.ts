import { AuthUser } from '@/types/prisma';
import { PrismaService } from '@lib/system/modules';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param user 获取用户信息
   */
  info(user: AuthUser) {
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    return {
      id: Number(user.id),
      username: user.username,
      roles: [],
    };
  }
}
