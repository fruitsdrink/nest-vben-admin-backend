import { Menu, menus } from '@/data';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService {
  findAll() {
    const result = this.getModules(menus);

    result.forEach((module) => {
      module.actions = module.actions.map((action) => {
        return {
          label: action.name,
          value: action.code,
        };
      });
    });
    return result;
  }

  private getModules(
    menus: Menu[],
    pmodule?: { title: string; code?: string },
  ) {
    const sortMenus = menus.sort((a, b) => {
      return (a.meta?.order || 0) - (b.meta?.order || 0);
    });
    let modules = [];
    for (const menu of sortMenus) {
      const {
        meta: { title },
        id,
        code,
        children,
        actions,
      } = menu;

      const module = {
        id,
        title,
        code,
        actions,
      };

      if (actions && actions.length) {
        module.actions = actions.map((action) => {
          return {
            ...action,
            code: `${module.code}_${action.code}`,
          };
        });
      }

      if (pmodule) {
        module.title = `${pmodule.title}/${module.title}`;
        if (pmodule.code) {
          module.code = `${pmodule.code}_${module.code}`;
        }
      }

      if (children && children.length) {
        modules.push(...this.getModules(children, { title }));
      } else {
        modules.push(module);
      }
    }

    modules = modules.filter((module) => {
      return module.actions && module.actions.length;
    });

    return modules;
  }
}
