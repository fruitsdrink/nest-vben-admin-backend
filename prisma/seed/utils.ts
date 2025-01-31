import { PrismaClient } from '@prisma/client';
import fs from 'fs-extra';
import { resolve } from 'path';

type Fun = (prisma: PrismaClient) => Promise<void>;
type Module = { seed: Fun; tableName?: string };

export async function improtModules(): Promise<Module[]> {
  const modules = [];
  const dir = resolve(__dirname, './modules');
  const files = fs.readdirSync(dir);
  // 遍历文件名
  for (const file of files) {
    // 获取文件名
    const fileName = file.split('.')[0];
    const extName = file.split('.')[1];
    if (extName === 'ts') {
      const importName = resolve(dir, fileName);
      const module = await import(importName);
      const seed = module.default as Fun;
      const tableName = module.tableName as string | undefined;

      modules.push({ seed, tableName });
    }
  }

  return modules;
}
