import { Configuration } from '@/types';
import { AuthUser } from '@/types/prisma';
import { comparePassword } from '@lib/system';
import { PrismaService } from '@lib/system/modules';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import ms from 'ms';
import { LoginDto } from './dto';

export const COOKIE_REFRESH_TOKEN = 'refresh_token';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Configuration>,
  ) {}

  async login(dto: LoginDto, ip: string, res: Response) {
    const user = await this.validateUser(dto);
    const { accessToken, refreshToken } = await this.getToken(user.id);
    await this.updateUserLoginInfo(user.id, ip, accessToken, refreshToken);
    this.writeCookie(res, refreshToken);

    return {
      id: Number(user.id),
      username: user.username,
      roles: [],
      accessToken,
    };
  }

  /**
   * 验证用户
   * @param loginDto 登录信息
   * @returns
   */
  private async validateUser(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.prisma.user.findFirst({
      where: {
        username,
        deletedAt: 0,
      },
    });
    if (!user) {
      throw new ForbiddenException('登录用户或密码错误!');
    }
    if (!comparePassword(password, user.password)) {
      throw new ForbiddenException('登录用户或密码错误!');
    }
    if (user.status === 0) {
      throw new ForbiddenException('该用户已被禁用!');
    }
    return user;
  }

  /**
   * 获取访问令牌
   * @param id 用户id
   * @returns
   */
  private async getToken(id: bigint) {
    const payload = { sub: id };
    const accessToken = await this.jwtService.signAsync(payload);
    const jwtExpireIn = this.config.get('jwt.expiresIn', {
      infer: true,
    }) as ms.StringValue;
    const jwtSecret = this.config.get('jwt.secret', { infer: true });
    const jwtExpireInMs = ms(jwtExpireIn);
    const refreshExpireInMs = (jwtExpireInMs + ms('1d')) / 1000;
    const refreshToken = jsonwebtoken.sign(payload, jwtSecret, {
      expiresIn: refreshExpireInMs,
    });
    return { accessToken, refreshToken };
  }

  /**
   *
   * @param userId 用户id
   * @param ip ip地址
   * @param accessToken 访问令牌
   */
  private async updateUserLoginInfo(
    userId: bigint,
    ip: string,
    accessToken: string,
    refreshToken: string,
  ) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip,
        accessToken,
        refreshToken,
      },
    });
  }

  /**
   * 写入cookie
   * @param res 响应
   * @param accessToken 访问令牌
   */
  private writeCookie(res: Response, refreshToken: string) {
    const isEnableCookie = this.config.get('jwt.enableCookie', { infer: true });
    if (isEnableCookie) {
      res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    } else {
      res.clearCookie(COOKIE_REFRESH_TOKEN);
    }
  }

  /***
   * 退出登录
   * @param res 响应
   * @param user 用户
   */
  async logout(res: Response, user: AuthUser) {
    res.clearCookie(COOKIE_REFRESH_TOKEN);

    if (user) {
      const { id } = user;
      await this.prisma.user.update({
        where: { id },
        data: {
          accessToken: null,
          refreshToken: null,
        },
      });
    }
  }

  async refresh(user: AuthUser) {
    const { id } = user;
    const currentUser = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: 0,
        status: 1,
      },
    });
    if (!currentUser) {
      return '';
    }
    const { accessToken } = await this.getToken(currentUser.id);
    return {
      data: accessToken,
    };
  }
}
