import { Configuration } from '@/types';
import { comparePassword } from '@lib/system';
import { PrismaService } from '@lib/system/modules';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Configuration>,
  ) {}

  async login(dto: LoginDto, ip: string, res: Response) {
    const user = await this.validateUser(dto);
    const accessToken = await this.getAccessToken(user.id);
    await this.updateUserLoginInfo(user.id, ip, accessToken);
    this.writeCookie(res, accessToken);
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
  private async getAccessToken(id: bigint) {
    const payload = { sub: id };
    const token = await this.jwtService.signAsync(payload);
    return token;
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
  ) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip,
        accessToken,
      },
    });
  }

  /**
   * 写入cookie
   * @param res 响应
   * @param accessToken 访问令牌
   */
  private writeCookie(res: Response, accessToken: string) {
    const isEnableCookie = this.config.get('jwt.enableCookie', { infer: true });
    if (isEnableCookie) {
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    } else {
      res.clearCookie('access_token');
    }
  }
}
