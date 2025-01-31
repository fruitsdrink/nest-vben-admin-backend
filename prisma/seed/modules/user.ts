import { hashPassword } from '@lib/system';
import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: 0,
      id: 1,
    },
  });
  if (users.length > 0) {
    return;
  }

  await prisma.user.create({
    data: {
      id: 1,
      username: 'admin',
      password: hashPassword('admin123'),
      nickName: 'admin',
      isAdmin: 1,
    },
  });
}

export const tableName = 'user';
