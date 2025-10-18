import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaClient = DeepMockProxy<PrismaClient>;

const prismaMock = mockDeep<PrismaClient>();

export function resetPrismaMock() {
    mockReset(prismaMock);
}

export { prismaMock };

jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    prisma: prismaMock,
}));

