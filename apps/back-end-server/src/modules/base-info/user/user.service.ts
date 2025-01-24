import { Configuration } from '@/types';
import { AuthUser } from '@/types/prisma';
import { PrismaService } from '@lib/system/modules';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Configuration>,
  ) {}

  /**
   *
   * @param user 获取用户信息
   */
  info(user: AuthUser) {
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    const host = this.config.get('http.host', { infer: true });
    const avatar = user.avatar
      ? `${host}/${user.avatar}`
      : `${host}/public/images/avatar.webp`;

    return {
      id: Number(user.id),
      username: user.username,
      realName: user.realName || user.nickname,
      email: user.email,
      avatar,
      isAdmin: user.isAdmin ? 1 : 0,
      roles: [],
    };
  }
}
