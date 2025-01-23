import { AuthUser } from '@/types/prisma';
import { Public, User } from '@lib/system';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Login', description: '登录接口' })
  @SerializeOptions({
    excludePrefixes: ['password'],
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @RealIP() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.login(dto, ip, res);
  }

  @ApiOperation({ summary: 'Logout', description: '登出接口' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @User() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.logout(res, user);
  }

  // todo 实现权限码
  @Get('codes')
  codes() {
    return ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'];
  }
}
