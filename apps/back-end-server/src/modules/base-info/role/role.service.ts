import {
  formatDto,
  PaginationParams,
  PaginationResult,
  PrismaService,
} from '@lib/system';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateDto, EditDto, FindListDto, FindManyDto } from './dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * 创建角色前校验
   * @param dto 创建角色参数
   * @param userId 操作人id
   */
  async create(dto: CreateDto, userId: bigint) {
    await this.validateOnCreate(dto);
    return await this.prisma.role.create({
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

    return await this.prisma.role.update({
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
    return await this.prisma.role.update({
      where: { id },
      data: {
        deletedAt: Date.now(),
        deletedBy: userId,
      },
    });
  }

  async findList(pagination: PaginationParams<FindListDto>) {
    const {
      keyword,
      page,
      pageSize,
      sortBy,
      sortOrder,
      data: { status },
    } = pagination;

    let where: Prisma.RoleWhereInput = {
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
      this.prisma.role.findMany({
        where,
        include: {
          users: true,
        },
        ...PaginationParams.pagination({
          page,
          pageSize,
          sortBy,
          sortOrder,
        }),
      }),
      this.prisma.role.count({ where }),
    ]);

    items.map((item) => {
      item['canDelete'] = item.users.length === 0;
      item['canEdit'] = true;
    });

    return PaginationResult.from(items, total);
  }

  async findMany(dto: FindManyDto) {
    const { keyword } = dto;
    return await this.prisma.role.findMany({
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
    return await this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
    });
  }

  /**
   * 验证新增角色
   * @param dto 创建角色参数
   */
  private async validateOnCreate(dto: CreateDto) {
    const { name } = dto;
    const role = await this.prisma.role.findFirst({
      where: {
        name,
        deletedAt: 0,
      },
    });
    if (role) {
      throw new BadRequestException(`角色名称已存在`);
    }
  }

  private async validateOnUpdate(id: number, dto: EditDto) {
    const role = await this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
    });
    if (!role) {
      throw new BadRequestException(`角色不存在`);
    }

    const { name } = dto;

    const exist = await this.prisma.role.findFirst({
      where: {
        name,
        deletedAt: 0,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new BadRequestException(`角色名称已存在`);
    }

    return {
      role,
      dto: formatDto(dto),
    };
  }

  private async validateOnDelete(id: number) {
    const role = await this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
      include: {
        users: true,
      },
    });
    if (!role) {
      throw new BadRequestException(`角色不存在`);
    }

    if (role.users.length > 0) {
      throw new BadRequestException(`角色下存在用户`);
    }

    return role;
  }
}
