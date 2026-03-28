/**
 * Accounts Repository — Database Access Layer
 * OWNER: Disaan (Account & Transaction Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Prisma queries for the Account model. Called by accounts.service.ts.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. findByUserId(userId: string) → Account | null
 * 2. findById(id: string) → Account | null
 * 3. create({ userId, accountNumber, balance?, currency? }) → Account
 * 4. updateBalance(id: string, newBalance: Decimal) → Account
 *
 * NOTE: For atomic operations (deposit/withdraw), use Prisma's $transaction
 * in the service layer instead of calling these functions separately.
 * These repository functions are for simple lookups.
 *
 * TODO (Disaan): Implement all functions
 * TODO (Kasunara): Review for performance
 */
import { prisma } from "../lib/prisma";

export async function findByUserId(userId: string) {
  // TODO (Disaan): Implement
  // return prisma.account.findUnique({ where: { userId } });
  throw new Error("TODO: Disaan — implement findByUserId");
}

export async function findById(id: string) {
  // TODO (Disaan): Implement
  // return prisma.account.findUnique({ where: { id } });
  throw new Error("TODO: Disaan — implement findById");
}

export async function create(data: {
  userId: string;
  accountNumber: string;
  balance?: number;
  currency?: string;
}) {
  // TODO (Disaan): Implement
  // return prisma.account.create({ data });
  throw new Error("TODO: Disaan — implement create");
}
