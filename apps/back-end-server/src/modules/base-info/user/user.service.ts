import { Configuration } from '@/types';
import { AuthUser } from '@/types/prisma';
import {
  formatDto,
  hashPassword,
  PaginationParams,
  PaginationResult,
  stringToInt,
} from '@lib/system';
import { PrismaService } from '@lib/system/modules';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import fs from 'fs';
import {
  CreateUserDto,
  EditUserDto,
  FindUserListDto,
  FindUserManyDto,
  ResetPasswordDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Configuration>,
  ) {}

  /**
   * 获取当前用户信息
   * @param user 当前登录用户
   */
  async info(user: AuthUser) {
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    const currentUser = await this.prisma.user.findUnique({
      include: {
        department: true,
        roles: true,
      },
      where: {
        id: user.id,
        deletedAt: 0,
      },
    });

    if (!currentUser) {
      throw new UnauthorizedException('用户不存在');
    }

    const host = this.config.get('http.host', { infer: true });
    const avatar = currentUser.avatar
      ? `${host}/${currentUser.avatar}`
      : `${host}/public/images/avatar.webp`;

    return {
      id: currentUser.id,
      username: currentUser.username,
      realName: currentUser.realName || currentUser.nickName,
      email: currentUser.email,
      avatar,
      isAdmin: currentUser.isAdmin ? 1 : 0,
      roles: currentUser.roles ? currentUser.roles.map((r) => r.id) : [],
    };
  }

  /**
   * 创建用户
   * @param dto 创建用户参数
   * @param userId 操作人id
   */
  async create(dto: CreateUserDto, userId: bigint) {
    const data = await this.validateOnCreate(dto);

    const { departmentId, roles, ...rest } = data;

    return await this.prisma.user.create({
      data: {
        ...rest,
        status: dto.status ?? 1,
        createdBy: userId,
        updatedBy: userId,
        department: departmentId && { connect: { id: departmentId } },
        roles: roles && { connect: roles.map((id) => ({ id })) },
      },
    });
  }

  /**
   * 编辑用户
   * @param id 用户id
   * @param dto 更新参数
   * @param userId 操作人id
   */
  async update(id: bigint, dto: EditUserDto, userId: bigint) {
    const data = await this.validateOnUpdate(id, dto);

    const { departmentId, roles, ...rest } = data;

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        updatedAt: new Date(),
        updatedBy: userId,
        department: departmentId
          ? { connect: { id: departmentId } }
          : {
              disconnect: true,
            },
        roles: {
          set: roles && roles.length ? roles.map((id) => ({ id })) : [],
        },
      },
    });
  }

  /**
   * 删除用户
   * @param id 用户id
   * @param userId 操作人id
   */
  async delete(id: bigint, userId: bigint) {
    await this.validateOnDelete(id);
    return await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: Date.now(),
        deletedBy: userId,
      },
    });
  }

  /**
   * 分页查询用户列表
   * @param pagination 分页参数
   */
  async findList(pagination: PaginationParams<FindUserListDto>) {
    const {
      keyword,
      page,
      pageSize,
      sortBy,
      sortOrder,
      data: { status, departmentId },
    } = pagination;

    let where: Prisma.UserWhereInput = {
      deletedAt: 0,
    };
    if (keyword) {
      where = {
        ...where,
        OR: [
          {
            username: {
              contains: keyword,
            },
          },
          {
            nickName: {
              contains: keyword,
            },
          },
          {
            realName: {
              contains: keyword,
            },
          },
        ],
      };
    }
    if (status) {
      where = {
        ...where,
        status: +status ? 1 : 0,
      };
    }
    if (departmentId) {
      where = {
        ...where,
        departmentId: stringToInt(departmentId.toString()),
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          roles: true,
          department: true,
        },
        ...PaginationParams.pagination({
          page,
          pageSize,
          sortBy,
          sortOrder,
        }),
      }),
      this.prisma.user.count({ where }),
    ]);

    items.map((item) => {
      this.deleteSensitiveInfo(item);
      item['canDelete'] = true;
      item['canEdit'] = true;
    });

    return PaginationResult.from(items, total);
  }

  /**
   * 查询用户列表
   * @param dto 查询参数
   */
  async findMany(dto: FindUserManyDto) {
    const { keyword, departmentId } = dto;

    let where: Prisma.UserWhereInput = {
      deletedAt: 0,
      status: 1,
    };

    if (keyword) {
      where = {
        ...where,
        OR: [
          {
            username: {
              contains: keyword,
            },
          },
          {
            nickName: {
              contains: keyword,
            },
          },
          {
            realName: {
              contains: keyword,
            },
          },
        ],
      };
    }

    if (departmentId) {
      where = {
        ...where,
        departmentId: stringToInt(departmentId),
      };
    }

    const data = await this.prisma.user.findMany({
      where,
    });

    data.map((item) => {
      this.deleteSensitiveInfo(item);
    });
    return data;
  }

  /**
   * 查询用户详情
   * @param id 用户id
   */
  async findById(id: bigint) {
    const data = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
      include: {
        roles: true,
      },
    });

    this.deleteSensitiveInfo(data);
    return {
      ...data,
      roles: data.roles.map((item) => item.id),
    };
  }

  /**
   * 删除敏感信息
   */
  private deleteSensitiveInfo(item: User) {
    delete item.password;
    delete item.accessToken;
    delete item.refreshToken;
    delete item.openId;
  }

  /**
   * 重置密码
   * @param userId 当前用户id
   * @param dto 重置密码参数
   */
  async resetPassword(cusrrentUserId: bigint, dto: ResetPasswordDto) {
    if (!dto.userId) {
      throw new BadRequestException(`用户id不能为空`);
    }

    if (!dto.password) {
      throw new BadRequestException(`密码不能为空`);
    }

    const pwd = hashPassword(dto.password);
    const user = await this.prisma.user.update({
      where: { id: dto.userId },
      data: { password: pwd, updatedAt: new Date(), updatedBy: cusrrentUserId },
    });

    this.deleteSensitiveInfo(user);

    return user;
  }

  /**
   * 验证新增/编辑用户
   * @param dto 用户参数
   */
  private async validateOnCreateAndUpdate(
    dto: CreateUserDto | EditUserDto,
    id?: bigint,
  ) {
    const { username, email, avatar, departmentId, roles } = dto;

    const [userExist, emailExist, departmentExist] = await Promise.all([
      this.prisma.user.findFirst({
        where: {
          username,
          deletedAt: 0,
          id: id ? { not: id } : undefined,
        },
      }),
      email &&
        this.prisma.user.findFirst({
          where: {
            email,
            deletedAt: 0,
            id: id ? { not: id } : undefined,
          },
        }),
      departmentId &&
        this.prisma.department.findFirst({
          where: {
            id: departmentId,
            deletedAt: 0,
          },
        }),
    ]);

    if (userExist) {
      throw new BadRequestException(`用户名称已存在`);
    }
    if (emailExist) {
      throw new BadRequestException(`邮箱已存在`);
    }
    if (departmentId && !departmentExist) {
      throw new BadRequestException(`部门不存在`);
    }
    if (avatar) {
      this.validateAvatar(avatar);
    }
    if (roles && roles.length > 0) {
      for (let i = 0; i < roles.length; i++) {
        const id = roles[i];
        const role = await this.prisma.role.findFirst({
          where: {
            id,
            deletedAt: 0,
          },
        });
        if (role === null || role === undefined) {
          throw new BadRequestException(`角色不存在`);
        }
      }
    }

    return formatDto(dto);
  }

  /**
   * 验证新增角色
   * @param dto 创建角色参数
   */
  private async validateOnCreate(dto: CreateUserDto) {
    const data = (await this.validateOnCreateAndUpdate(dto)) as CreateUserDto;
    data.password = hashPassword(data.password);
    return data;
  }

  /**
   * 验证编辑用户
   * @param id 用户id
   * @param dto 编辑用户参数
   */
  private async validateOnUpdate(id: bigint, dto: EditUserDto) {
    const data = await this.validateOnCreateAndUpdate(dto, id);

    if (data['password']) {
      delete data['password'];
    }
    if (!data.roles) {
      data.roles = [];
    }
    return data as EditUserDto;
  }

  /**
   * 验证删除用户
   * @param id 用户id
   */
  private async validateOnDelete(id: bigint) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: 0,
      },
    });
    if (!user) {
      throw new BadRequestException(`用户不存在`);
    }

    return user;
  }

  /**
   * 验证头像
   * @param avatar 头像
   */
  private validateAvatar(avatar: string) {
    const host = this.config.get('http.host', { infer: true });
    // 如果avatar以/开头，则删除/
    if (avatar.startsWith('/')) {
      avatar = avatar.substring(1);
    }
    const filename = `${host}/${avatar}`;
    // 判断文件是否存在
    if (!fs.existsSync(filename)) {
      throw new BadRequestException(`头像不存在`);
    }
  }
}
