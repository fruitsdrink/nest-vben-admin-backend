import { Configuration, JwtPayload } from '@/types';
import { PrismaService } from '@lib/system/modules';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService<Configuration>,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: (req) => {
        return this.getAccessToken(req);
      },
      ignoreExpiration: false,
      secretOrKey: config.get('jwt.secret', { infer: true }),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { id } = payload;
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: 0,
        status: 1,
      },
    });
    if (!user) {
      throw new ForbiddenException('用户不存在或已被禁用');
    }

    const accessToken = this.getAccessToken(req);
    if (!accessToken) {
      throw new ForbiddenException('未登录');
    }

    if (user.accessToken !== accessToken) {
      throw new ForbiddenException('登录状态已失效');
    }

    return user;
  }

  private getAccessToken(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['access_token'];
    }
    if (!token) {
      // 从header中获取
      token = req.headers.authorization?.split(' ')[1];
    }

    if (token) {
      // 判断token是否过期
      const decoded = this.jwtService.verify(token, {
        secret: this.config.get('jwt.secret', { infer: true }),
      }) as JwtPayload & { exp: number };
      if (!decoded) {
        return '';
      }
      if (decoded.exp < Date.now() / 1000) {
        return '';
      }
    }
    return token;
  }
}
