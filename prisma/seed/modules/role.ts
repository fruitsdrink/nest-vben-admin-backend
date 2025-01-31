import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
  const count = await prisma.role.count({
    where: {
      deletedAt: 0,
    },
  });
  if (count === 0) {
    await prisma.role.createMany({
      data: [
        {
          id: 1,
          name: '部门经理',
          status: 1,
        },
        {
          id: 2,
          name: '职员',
          status: 1,
        },
      ],
    });
  }
}

export const tableName = 'role';
