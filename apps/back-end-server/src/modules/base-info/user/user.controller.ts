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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateDto, EditDto, FindListDto, FindManyDto } from './dto';
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
  @Get('baseinfo/user')
  async findList(
    @Pagination() pagination: PaginationParams<FindListDto>,
  ): Promise<PaginationResult<User>> {
    return await this.service.findList(pagination);
  }

  @ApiOperation({ summary: '查询用户' })
  @Get('baseinfo/user/find')
  async findMany(@Query() dto: FindManyDto) {
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
  async create(@Body() dto: CreateDto, @CurrentUser() user: AuthUser) {
    return await this.service.create(dto, user.id);
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '用户Id' })
  @Put('baseinfo/user/:id')
  async update(
    @Param('id', ParseIntPipe) id: bigint,
    @Body() dto: EditDto,
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
}
