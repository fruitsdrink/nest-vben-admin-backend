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
import { Department } from '@prisma/client';
import { DepartmentService } from './department.service';
import { CreateDto, EditDto, FindListDto, FindManyDto } from './dto';

@ApiTags('部门管理')
@Controller('baseinfo/department')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @ApiOperation({ summary: '获取部门列表' })
  @Get()
  async findList(
    @Pagination() pagination: PaginationParams<FindListDto>,
  ): Promise<PaginationResult<Department>> {
    return await this.service.findList(pagination);
  }

  @ApiOperation({ summary: '查询部门' })
  @Get('find')
  async findMany(@Query() dto: FindManyDto) {
    return await this.service.findMany(dto);
  }

  @ApiOperation({ summary: '获取部门详情' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '部门Id' })
  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ summary: '创建部门' })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateDto, @CurrentUser() user: AuthUser) {
    return await this.service.create(dto, user.id);
  }

  @ApiOperation({ summary: '更新部门' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '部门Id' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditDto,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.service.update(id, dto, user.id);
  }

  @ApiOperation({ summary: '删除部门' })
  @ApiParam({ name: 'id', type: Number, required: true, description: '部门Id' })
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.service.delete(id, user.id);
  }
}
