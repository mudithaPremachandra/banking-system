/**
 * Transactions Service — Business Logic Layer
 * OWNER: Disaan (Account & Transaction Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This is the MOST CRITICAL business logic file in the entire project.
 * It handles money movement (deposits and withdrawals) which MUST be atomic.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. deposit(userId: string, amount: number, description?: string)
 *    STEPS (all within a Prisma interactive transaction):
 *    a. Find or create the user's account
 *    b. Calculate newBalance = currentBalance + amount
 *    c. Update account balance to newBalance
 *    d. Create Transaction record with type: DEPOSIT, balanceAfter: newBalance
 *    e. Return { transaction, newBalance }
 *
 *    PRISMA TRANSACTION PATTERN:
 *    ```typescript
 *    const result = await prisma.$transaction(async (tx) => {
 *      const account = await tx.account.findUnique({ where: { userId } });
 *      const newBalance = account.balance.add(new Decimal(amount));
 *      await tx.account.update({ where: { id: account.id }, data: { balance: newBalance } });
 *      const transaction = await tx.transaction.create({ data: { ... } });
 *      return { transaction, newBalance };
 *    });
 *    ```
 *
 * 2. withdraw(userId: string, amount: number, description?: string)
 *    STEPS (all within a Prisma interactive transaction):
 *    a. Find the user's account → if not found, throw 404
 *    b. Check if balance >= amount → if not, throw INSUFFICIENT_FUNDS error
 *    c. Calculate newBalance = currentBalance - amount
 *    d. Update account balance to newBalance
 *    e. Create Transaction record with type: WITHDRAWAL, balanceAfter: newBalance
 *    f. Return { transaction, newBalance }
 *
 *    CRITICAL: The balance check AND balance update MUST happen in the same
 *    transaction. Do NOT read balance, check in JS, then update separately —
 *    that creates a race condition where two concurrent withdrawals could
 *    both pass the check before either updates the balance.
 *
 * 3. getHistory(userId: string, page: number, limit: number)
 *    - Find account by userId
 *    - Fetch transactions ordered by createdAt DESC
 *    - Apply pagination: skip = (page - 1) * limit, take = limit
 *    - Count total transactions for pagination info
 *    - Return { transactions[], total, page }
 *
 * ERROR TYPES:
 * - INSUFFICIENT_FUNDS: withdrawal amount > balance
 * - ACCOUNT_NOT_FOUND: no account for this userId (shouldn't happen if auto-created)
 * - INVALID_AMOUNT: amount <= 0 (should be caught by Zod at gateway, but double-check)
 *
 * TODO (Disaan): Implement all functions with Prisma interactive transactions
 * TODO (Kawindi): Write tests for concurrent deposits, insufficient funds, pagination
 */
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../lib/prisma";

export async function deposit(
  userId: string,
  amount: number,
  description?: string
) {
  // TODO (Disaan): Implement atomic deposit using prisma.$transaction
  //
  // const result = await prisma.$transaction(async (tx) => {
  //   // 1. Find or create account
  //   let account = await tx.account.findUnique({ where: { userId } });
  //   if (!account) {
  //     account = await tx.account.create({ data: { userId, accountNumber: generateAccountNumber() } });
  //   }
  //
  //   // 2. Calculate new balance
  //   const newBalance = account.balance.add(new Decimal(amount));
  //
  //   // 3. Update balance
  //   await tx.account.update({
  //     where: { id: account.id },
  //     data: { balance: newBalance },
  //   });
  //
  //   // 4. Create transaction record
  //   const transaction = await tx.transaction.create({
  //     data: {
  //       accountId: account.id,
  //       type: "DEPOSIT",
  //       amount: new Decimal(amount),
  //       balanceAfter: newBalance,
  //       description,
  //     },
  //   });
  //
  //   return { transaction, newBalance: Number(newBalance) };
  // });
  //
  // return result;

  throw new Error("TODO: Disaan — implement deposit");
}

export async function withdraw(
  userId: string,
  amount: number,
  description?: string
) {
  // TODO (Disaan): Implement atomic withdrawal using prisma.$transaction
  //
  // const result = await prisma.$transaction(async (tx) => {
  //   const account = await tx.account.findUnique({ where: { userId } });
  //   if (!account) throw Object.assign(new Error("Account not found"), { code: "ACCOUNT_NOT_FOUND" });
  //
  //   if (account.balance.lessThan(new Decimal(amount))) {
  //     throw Object.assign(
  //       new Error("Withdrawal amount exceeds available balance"),
  //       { code: "INSUFFICIENT_FUNDS" }
  //     );
  //   }
  //
  //   const newBalance = account.balance.sub(new Decimal(amount));
  //   // ... update balance, create transaction record
  // });

  throw new Error("TODO: Disaan — implement withdraw");
}

export async function getHistory(
  userId: string,
  page: number,
  limit: number
) {
  // TODO (Disaan): Implement paginated transaction history
  //
  // const account = await prisma.account.findUnique({ where: { userId } });
  // if (!account) return { transactions: [], total: 0, page };
  //
  // const [transactions, total] = await Promise.all([
  //   prisma.transaction.findMany({
  //     where: { accountId: account.id },
  //     orderBy: { createdAt: "desc" },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   }),
  //   prisma.transaction.count({ where: { accountId: account.id } }),
  // ]);
  //
  // return { transactions, total, page };

  throw new Error("TODO: Disaan — implement getHistory");
}
