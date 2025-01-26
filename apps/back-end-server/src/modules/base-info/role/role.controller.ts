import { AuthUser } from '@/types/prisma';
import {
  Pagination,
  PaginationParams,
  PaginationResult,
  User,
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
import { Role } from '@prisma/client';
import { CreateDto, EditDto, FindListDto, FindManyDto } from './dto';
import { RoleService } from './role.service';

@ApiTags('角色管理')
@Controller('baseinfo/role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @ApiOperation({ summary: '获取角色列表' })
  @Get()
  async findList(
    @Pagination() pagination: PaginationParams<FindListDto>,
  ): Promise<PaginationResult<Role>> {
    return await this.service.findList(pagination);
  }

  @ApiOperation({ summary: '查询角色' })
  @Get('find')
  async findMany(@Query() dto: FindManyDto) {
    return await this.service.findMany(dto);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '角色Id' })
  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ summary: '创建角色' })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateDto, @User() user: AuthUser) {
    return await this.service.create(dto, user.id);
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '角色Id' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditDto,
    @User() user: AuthUser,
  ) {
    return await this.service.update(id, dto, user.id);
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '角色Id' })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @User() user: AuthUser) {
    return await this.service.delete(id, user.id);
  }
}
