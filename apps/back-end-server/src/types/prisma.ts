import type { Prisma, PrismaClient } from '@prisma/client';

type ModelNames = Prisma.ModelName; // "User" | "Post"

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<M>]['findUnique']>>,
    null
  >;
};

export type AuthUser = PrismaModels['User'];
