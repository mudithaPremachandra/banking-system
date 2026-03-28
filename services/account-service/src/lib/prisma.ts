/**
 * Prisma Client Singleton
 * OWNER: Kasunara (DBA), Disaan (Account Service Developer)
 *
 * Same singleton pattern as auth-service.
 * TODO (Kasunara): Add connection pooling config if needed
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
