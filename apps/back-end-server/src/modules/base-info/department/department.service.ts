import { formatDto, PaginationParams, PaginationResult } from '@lib/system';
import { PrismaService } from '@lib/system/modules';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateDto, EditDto, FindListDto, FindManyDto } from './dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * 创建部门
   * @param dto 创建部门参数
   * @param userId 操作人id
   */
  async create(dto: CreateDto, userId: bigint) {
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

  async update(id: number, dto: EditDto, userId: bigint) {
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

  async findList(pagination: PaginationParams, dto: FindListDto) {
    const { keyword, page, pageSize, sortBy, sortOrder } = pagination;
    const { status } = dto;
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

  async findMany(dto: FindManyDto) {
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
  private async validateOnCreate(dto: CreateDto) {
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

  private async validateOnUpdate(id: number, dto: EditDto) {
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

    console.log({ formatDto: formatDto(dto) });
    return {
      department,
      dto: formatDto(dto),
    };
  }

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
