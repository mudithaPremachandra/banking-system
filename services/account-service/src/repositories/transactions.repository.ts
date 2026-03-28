/**
 * Transactions Repository — Database Access Layer
 * OWNER: Disaan (Account & Transaction Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Prisma queries for the Transaction model. Called by transactions.service.ts.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. findByAccountId(accountId: string, options: { skip, take, orderBy })
 *    → Transaction[] — for paginated transaction history
 *
 * 2. countByAccountId(accountId: string) → number
 *    → Total count for pagination
 *
 * 3. create(data: { accountId, type, amount, balanceAfter, description? })
 *    → Transaction — for recording new deposits/withdrawals
 *
 * NOTE: For atomic operations, the service layer uses prisma.$transaction
 * and calls tx.transaction.create directly. These repository functions
 * are for read operations.
 *
 * TODO (Disaan): Implement all functions
 */
import { prisma } from "../lib/prisma";

export async function findByAccountId(
  accountId: string,
  options: { skip: number; take: number }
) {
  // TODO (Disaan): Implement
  // return prisma.transaction.findMany({
  //   where: { accountId },
  //   orderBy: { createdAt: "desc" },
  //   skip: options.skip,
  //   take: options.take,
  // });
  throw new Error("TODO: Disaan — implement findByAccountId");
}

export async function countByAccountId(accountId: string) {
  // TODO (Disaan): Implement
  // return prisma.transaction.count({ where: { accountId } });
  throw new Error("TODO: Disaan — implement countByAccountId");
}
