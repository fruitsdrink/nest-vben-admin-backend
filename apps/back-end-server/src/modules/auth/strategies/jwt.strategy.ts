import { Configuration, JwtPayload } from '@/types';
import { PrismaService } from '@lib/system/modules';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService<Configuration>,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        if (!token) {
          // 从header中获取
          token = req.headers.authorization?.split(' ')[1];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: config.get('jwt.secret', { infer: true }),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: 0,
        status: 1,
      },
    });
    if (!user) {
      throw new ForbiddenException('用户不存在或已被禁用');
    }
    return user;
  }
}
