import { AuthUser } from '@/types/prisma';
import {
  CurrentUser,
  Pagination,
  PaginationParams,
  PaginationResult,
} from '@lib/system';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import {
  CreateUserDto,
  EditPasswordDto,
  EditUserDto,
  FindUserListDto,
  FindUserManyDto,
  ResetPasswordDto,
  ValidatePasswordDto,
} from './dto';
import { UserService } from './user.service';

@ApiTags('用户管理')
@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: '获取用户信息' })
  @Get('user/info')
  async info(@CurrentUser() user: AuthUser) {
    return await this.service.info(user);
  }

  @ApiOperation({ summary: '获取用户列表' })
  @ApiQuery({ type: FindUserListDto })
  @Get('baseinfo/user')
  async findList(
    @Pagination() pagination: PaginationParams<FindUserListDto>,
  ): Promise<PaginationResult<User>> {
    return await this.service.findList(pagination);
  }

  @ApiOperation({ summary: '查询用户' })
  @Get('baseinfo/user/find')
  async findMany(@Query() dto: FindUserManyDto) {
    return await this.service.findMany(dto);
  }

  @ApiOperation({ summary: '获取用户详情' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '用户Id' })
  @Get('baseinfo/user/find/:id')
  async findById(@Param('id', ParseIntPipe) id: bigint) {
    return await this.service.findById(id);
  }

  @ApiOperation({ summary: '创建用户' })
  @Post('baseinfo/user')
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateUserDto, @CurrentUser() user: AuthUser) {
    return await this.service.create(dto, user.id);
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '用户Id' })
  @Put('baseinfo/user/:id')
  async update(
    @Param('id', ParseIntPipe) id: bigint,
    @Body() dto: EditUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.service.update(id, dto, user.id);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '用户Id' })
  @Delete('baseinfo/user/:id')
  async delete(
    @Param('id', ParseIntPipe) id: bigint,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.service.delete(id, user.id);
  }

  @ApiOperation({ summary: '重置密码' })
  @HttpCode(HttpStatus.OK)
  @Post('baseinfo/user/reset-password')
  async resetPassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ResetPasswordDto,
  ) {
    return await this.service.resetPassword(user.id, dto);
  }

  @ApiOperation({ summary: '验证密码' })
  @Post('baseinfo/user/validate-password')
  @HttpCode(HttpStatus.OK)
  async validatePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ValidatePasswordDto,
  ) {
    return await this.service.validatePassword(user.id, dto);
  }

  @ApiOperation({ summary: '修改密码' })
  @Post('baseinfo/user/edit-password')
  @HttpCode(HttpStatus.OK)
  async editPassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: EditPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.service.editPassword(user.id, dto, response);
  }
}
