/**
 * Prisma Client Singleton
 * OWNER: Kasunara (DBA), Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file creates a single Prisma Client instance that is reused across
 * the entire Auth Service. Do NOT create multiple PrismaClient instances.
 *
 * In development, the singleton pattern prevents creating too many connections
 * during hot-reloading (ts-node-dev restarts).
 *
 * TODO (Kasunara): Add connection pooling config if needed for production
 * TODO (Sandun): Import this in all repository files
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
