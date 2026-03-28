/**
 * Accounts Service — Business Logic Layer
 * OWNER: Disaan (Account & Transaction Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file contains business logic for account operations.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. getOrCreateAccount(userId: string)
 *    - Find account by userId
 *    - If not found, create one with:
 *      - balance: 0
 *      - currency: "LKR"
 *      - accountNumber: generate a unique account number (e.g., "ACC" + random digits)
 *    - Return the account object
 *
 * 2. getBalance(userId: string)
 *    - Find account by userId
 *    - Return { balance: number, currency: string }
 *    - If no account exists, return { balance: 0, currency: "LKR" }
 *
 * ACCOUNT NUMBER GENERATION:
 * Generate a unique account number. Suggested format: "ACC" + 10 random digits
 * e.g., "ACC1234567890". Must be unique (accountNumber is @unique in schema).
 *
 * TODO (Disaan): Implement all functions
 * TODO (Kasunara): Confirm account number format
 */
import * as accountsRepository from "../repositories/accounts.repository";

export async function getOrCreateAccount(userId: string) {
  // TODO (Disaan): Implement
  // let account = await accountsRepository.findByUserId(userId);
  // if (!account) {
  //   const accountNumber = generateAccountNumber();
  //   account = await accountsRepository.create({ userId, accountNumber });
  // }
  // return account;
  throw new Error("TODO: Disaan — implement getOrCreateAccount");
}

export async function getBalance(userId: string) {
  // TODO (Disaan): Implement
  // const account = await getOrCreateAccount(userId);
  // return { balance: Number(account.balance), currency: account.currency };
  throw new Error("TODO: Disaan — implement getBalance");
}

function generateAccountNumber(): string {
  // Generate "ACC" + 10 random digits
  const digits = Math.floor(Math.random() * 10_000_000_000)
    .toString()
    .padStart(10, "0");
  return `ACC${digits}`;
}
