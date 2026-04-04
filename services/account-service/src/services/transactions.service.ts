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
import { TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../lib/prisma";

type ServiceErrorCode =
  | "INVALID_AMOUNT"
  | "ACCOUNT_NOT_FOUND"
  | "INSUFFICIENT_FUNDS"
  | "SELF_TRANSFER";

interface ServiceError extends Error {
  code?: ServiceErrorCode;
}

function createServiceError(code: ServiceErrorCode, message: string): ServiceError {
  const error = new Error(message) as ServiceError;
  error.code = code;
  return error;
}

function generateAccountNumber(): string {
  const digits = Math.floor(Math.random() * 10_000_000_000)
    .toString()
    .padStart(10, "0");
  return `ACC${digits}`;
}

async function createAccountWithRetry(tx: any, userId: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await tx.account.create({
        data: { userId, accountNumber: generateAccountNumber() },
      });
    } catch (error: any) {
      if (error?.code !== "P2002") throw error;
    }
  }
  throw new Error("Failed to generate unique account number");
}

export async function deposit(
  userId: string,
  amount: number,
  description?: string
) {
  if (amount <= 0) {
    throw createServiceError("INVALID_AMOUNT", "Amount must be greater than zero");
  }

  return prisma.$transaction(async (tx) => {
    let account = await tx.account.findUnique({ where: { userId } });
    if (!account) {
      account = await createAccountWithRetry(tx, userId);
    }
    if (!account) {
      throw createServiceError("ACCOUNT_NOT_FOUND", "Account not found");
    }

    const amountDecimal = new Decimal(amount);
    const newBalance = account.balance.add(amountDecimal);

    await tx.account.update({
      where: { id: account.id },
      data: { balance: newBalance },
    });

    const transaction = await tx.transaction.create({
      data: {
        accountId: account.id,
        type: TransactionType.DEPOSIT,
        amount: amountDecimal,
        balanceAfter: newBalance,
        description,
      },
    });

    return { transaction, newBalance: Number(newBalance) };
  });
}

export async function withdraw(
  userId: string,
  amount: number,
  description?: string
) {
  if (amount <= 0) {
    throw createServiceError("INVALID_AMOUNT", "Amount must be greater than zero");
  }

  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findUnique({ where: { userId } });
    if (!account) {
      throw createServiceError("ACCOUNT_NOT_FOUND", "Account not found");
    }

    const amountDecimal = new Decimal(amount);
    if (account.balance.lessThan(amountDecimal)) {
      throw createServiceError(
        "INSUFFICIENT_FUNDS",
        "Withdrawal amount exceeds available balance"
      );
    }

    const newBalance = account.balance.sub(amountDecimal);

    await tx.account.update({
      where: { id: account.id },
      data: { balance: newBalance },
    });

    const transaction = await tx.transaction.create({
      data: {
        accountId: account.id,
        type: TransactionType.WITHDRAWAL,
        amount: amountDecimal,
        balanceAfter: newBalance,
        description,
      },
    });

    return { transaction, newBalance: Number(newBalance) };
  });
}

export async function transfer(
  senderUserId: string,
  toAccountNumber: string,
  amount: number,
  description?: string
) {
  if (amount <= 0) {
    throw createServiceError("INVALID_AMOUNT", "Amount must be greater than zero");
  }

  return prisma.$transaction(async (tx) => {
    const senderAccount = await tx.account.findUnique({ where: { userId: senderUserId } });
    if (!senderAccount) {
      throw createServiceError("ACCOUNT_NOT_FOUND", "Sender account not found");
    }

    const recipientAccount = await tx.account.findUnique({ where: { accountNumber: toAccountNumber } });
    if (!recipientAccount) {
      throw createServiceError("ACCOUNT_NOT_FOUND", "Recipient account not found");
    }

    if (senderAccount.id === recipientAccount.id) {
      throw createServiceError("SELF_TRANSFER", "Cannot transfer to your own account");
    }

    const amountDecimal = new Decimal(amount);
    if (senderAccount.balance.lessThan(amountDecimal)) {
      throw createServiceError("INSUFFICIENT_FUNDS", "Transfer amount exceeds available balance");
    }

    const senderNewBalance = senderAccount.balance.sub(amountDecimal);
    const recipientNewBalance = recipientAccount.balance.add(amountDecimal);

    await tx.account.update({
      where: { id: senderAccount.id },
      data: { balance: senderNewBalance },
    });

    await tx.account.update({
      where: { id: recipientAccount.id },
      data: { balance: recipientNewBalance },
    });

    const senderTx = await tx.transaction.create({
      data: {
        accountId: senderAccount.id,
        type: TransactionType.WITHDRAWAL,
        amount: amountDecimal,
        balanceAfter: senderNewBalance,
        description: description || `Transfer to ${toAccountNumber}`,
      },
    });

    await tx.transaction.create({
      data: {
        accountId: recipientAccount.id,
        type: TransactionType.DEPOSIT,
        amount: amountDecimal,
        balanceAfter: recipientNewBalance,
        description: `Transfer from ${senderAccount.accountNumber}`,
      },
    });

    return { transaction: senderTx, newBalance: Number(senderNewBalance) };
  });
}

export async function getHistory(
  userId: string,
  page: number,
  limit: number
) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  const account = await prisma.account.findUnique({ where: { userId } });
  if (!account) {
    return { transactions: [], total: 0, page: safePage };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.transaction.count({ where: { accountId: account.id } }),
  ]);

  return { transactions, total, page: safePage };
}
