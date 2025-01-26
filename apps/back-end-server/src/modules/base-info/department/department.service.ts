import {
  formatDto,
  PaginationParams,
  PaginationResult,
  PrismaService,
} from '@lib/system';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateDepartmentDto,
  EditDepartmentDto,
  FindDepartmentListDto,
  FindDepartmentManyDto,
} from './dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * 创建部门
   * @param dto 创建部门参数
   * @param userId 操作人id
   */
  async create(dto: CreateDepartmentDto, userId: bigint) {
    await this.validateOnCreate(dto);
    return await this.prisma.department.create({
      data: {
        ...dto,
        status: dto.status ?? 1,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  /**
   * 编辑部门
   * @param id 部门id
   * @param dto 编辑部门参数
   * @param userId 操作人id
   */
  async update(id: number, dto: EditDepartmentDto, userId: bigint) {
    const { dto: formData } = await this.validateOnUpdate(id, dto);

    return await this.prisma.department.update({
      where: { id },
      data: {
        ...formData,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  /**
   * 删除部门
   * @param id 部门id
   * @param userId 操作人id
   */
  async delete(id: number, userId: bigint) {
    await this.validateOnDelete(id);
    return await this.prisma.department.update({
      where: { id },
      data: {
        deletedAt: Date.now(),
        deletedBy: userId,
      },
    });
  }

  /**
   * 分页查询部门列表
   * @param pagination 分页参数
   */
  async findList(pagination: PaginationParams<FindDepartmentListDto>) {
    const {
      keyword,
      page,
      pageSize,
      sortBy,
      sortOrder,
      data: { status },
    } = pagination;

    let where: Prisma.DepartmentWhereInput = {
      deletedAt: 0,
    };
    if (keyword) {
      where = {
        ...where,
        name: {
          contains: keyword,
        },
      };
    }
    if (status) {
      where = {
        ...where,
        status: +status ? 1 : 0,
      };
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.department.findMany({
        where,
        include: {
          users: true,
          children: true,
        },
        ...PaginationParams.pagination({
          page,
          pageSize,
          sortBy,
          sortOrder,
        }),
      }),
      this.prisma.department.count({ where }),
    ]);

    items.map((item) => {
      item['canDelete'] = item.users.length === 0 && item.children.length === 0;
      item['canEdit'] = true;
    });

    return PaginationResult.from(items, total);
  }

  /**
   * 查询部门列表
   * @param dto 查询参数
   */
  async findMany(dto: FindDepartmentManyDto) {
    const { keyword } = dto;
    return await this.prisma.department.findMany({
      where: {
        deletedAt: 0,
        status: 1,
        name: keyword
          ? {
              contains: keyword,
            }
          : undefined,
      },
    });
  }

  /**
   * 查询部门详情
   * @param id 部门id
   */
  async findById(id: number) {
    return await this.prisma.department.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
    });
  }

  /**
   * 验证新增部门
   * @param dto 创建部门参数
   */
  private async validateOnCreate(dto: CreateDepartmentDto) {
    const { name } = dto;
    const department = await this.prisma.department.findFirst({
      where: {
        name,
        deletedAt: 0,
      },
    });
    if (department) {
      throw new BadRequestException(`部门名称已存在`);
    }
  }

  /**
   * 验证编辑部门
   * @param id 部门id
   * @param dto 编辑部门参数
   */
  private async validateOnUpdate(id: number, dto: EditDepartmentDto) {
    const department = await this.prisma.department.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
    });
    if (!department) {
      throw new BadRequestException(`部门不存在`);
    }

    const { name } = dto;

    const exist = await this.prisma.department.findFirst({
      where: {
        name,
        deletedAt: 0,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new BadRequestException(`部门名称已存在`);
    }

    return {
      department,
      dto: formatDto(dto),
    };
  }

  /**
   * 验证删除部门
   * @param id 部门id
   */
  private async validateOnDelete(id: number) {
    const department = await this.prisma.department.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
      include: {
        users: true,
        children: true,
      },
    });
    if (!department) {
      throw new BadRequestException(`部门不存在`);
    }

    if (department.users.length > 0) {
      throw new BadRequestException(`部门下存在用户`);
    }

    if (department.children.length > 0) {
      throw new BadRequestException(`部门下存在子部门`);
    }

    return department;
  }
}
