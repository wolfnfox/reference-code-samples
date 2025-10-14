import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
};

export const createContext = async (): Promise<Context> => ({
  prisma,
});
