import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
  const count = await prisma.department.count({
    where: {
      deletedAt: 0,
    },
  });
  if (count === 0) {
    await prisma.department.createMany({
      data: [
        {
          id: 1,
          name: '技术部',
          status: 1,
        },
        {
          id: 2,
          name: '人事部',
          status: 1,
        },
        {
          id: 3,
          name: '财务部',
          status: 1,
        },
      ],
    });
  }
}

export const tableName = 'department';
