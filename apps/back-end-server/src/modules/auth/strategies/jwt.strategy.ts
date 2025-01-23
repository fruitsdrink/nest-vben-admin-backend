import { Configuration, JwtPayload } from '@/types';
import { PrismaService } from '@lib/system/modules';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { COOKIE_REFRESH_TOKEN } from '../auth.service';

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
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    const accessToken = this.getAccessToken(req);
    if (!accessToken) {
      throw new UnauthorizedException('未登录');
    }

    if (user.accessToken !== accessToken && user.refreshToken !== accessToken) {
      throw new UnauthorizedException('登录状态已失效');
    }
    if (!this.validateToken(accessToken)) {
      throw new UnauthorizedException('登录状态已失效');
    }

    return user;
  }

  private getAccessToken(req: Request): string {
    try {
      let token = '';

      if (!token && req.headers.authorization) {
        // 从header中获取
        token = req.headers.authorization?.split(' ')[1];
      }

      if (token) {
        const isValid = this.validateToken(token);
        if (!isValid) {
          token = this.getTokenFromCookie(req);
        }
        return token;
      } else {
        return this.getTokenFromCookie(req);
      }
    } catch {
      throw new UnauthorizedException();
    }
  }

  private getTokenFromCookie(req: Request) {
    console.log('cookie:', req.cookies[COOKIE_REFRESH_TOKEN]);
    return req.cookies[COOKIE_REFRESH_TOKEN];
  }

  private validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return false;
    }
  }
}
