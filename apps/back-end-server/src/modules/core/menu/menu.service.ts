import { PrismaService } from '@lib/system';
import { Injectable } from '@nestjs/common';
import { menus } from './data';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async all(userId: bigint) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: 0,
        status: 1,
      },
    });
    if (!user) {
      return [];
    }
    if (user.isAdmin) {
      return menus;
      // return this.getAllAccessCodes(menus);
    }
    return [];
  }

  private getAllAccessCodes(menus: any[], pcode?: string) {
    const codes = [];
    for (const menu of menus) {
      const { code, children } = menu;
      if (code && children) {
        if (!pcode) {
          codes.push(...this.getAllAccessCodes(children, `${code}`));
        } else {
          codes.push(...this.getAllAccessCodes(children, `${pcode}_${code}`));
        }
      } else {
        const { accessCodes, code: mcode } = menu;
        if (accessCodes && accessCodes.length && pcode) {
          for (const accessCode of accessCodes) {
            if (!mcode) {
              codes.push(`${pcode}_${accessCode.code}`);
            } else {
              codes.push(`${pcode}_${mcode}_${accessCode.code}`);
            }
          }
        }
      }
    }

    return codes;
  }
}
