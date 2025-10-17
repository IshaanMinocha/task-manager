import { PrismaClient } from '@prisma/client';
import { consts } from './consts';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (consts.env.nodeEnv !== 'production') globalForPrisma.prisma = prisma;

export default prisma;