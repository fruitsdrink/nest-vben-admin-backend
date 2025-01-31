import { PrismaClient } from '@prisma/client';
import { improtModules } from './utils';

const prisma = new PrismaClient();

async function main() {
  // await seedUser();
  const modules = await improtModules();
  for (const module of modules) {
    const { seed, tableName } = module;
    if (tableName) {
      console.log(`Seed ${tableName}...`);
    }
    await seed(prisma);
    if (tableName) {
      console.log(`Seed ${tableName} success!\n`);
    }
  }
}

main();
