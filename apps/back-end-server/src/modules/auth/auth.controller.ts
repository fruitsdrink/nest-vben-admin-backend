import { AuthUser } from '@/types/prisma';
import { User } from '@lib/system';
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
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @RealIP() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.login(dto, ip, res);
  }

  @Get('test')
  testAuth(@User() user: AuthUser) {
    console.log(user);
    return {
      isok: true,
    };
  }
}
