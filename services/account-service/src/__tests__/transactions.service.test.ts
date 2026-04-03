/**
 * Account Service — Transactions Unit Tests
 * OWNER: Kawindi (Testing)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Write unit tests for deposit and withdrawal logic.
 * Mock prisma.$transaction using jest.mock("../lib/prisma").
 * The most critical tests are the edge cases around balance checking.
 *
 * TEST CASES TO IMPLEMENT:
 *
 * deposit()
 *   ✓ updates balance and creates DEPOSIT transaction record
 *   ✓ auto-creates account if user has none
 *   ✓ correctly calculates new balance (old + amount)
 *   ✓ throws for negative amount
 *   ✓ throws for zero amount
 *
 * withdraw()
 *   ✓ updates balance and creates WITHDRAWAL transaction record
 *   ✓ correctly calculates new balance (old - amount)
 *   ✓ throws INSUFFICIENT_FUNDS when amount > balance
 *   ✓ throws INSUFFICIENT_FUNDS when amount == balance + 0.01
 *   ✓ allows withdrawal when amount == balance (full withdrawal)
 *   ✓ throws for negative amount
 *
 * getHistory()
 *   ✓ returns paginated results in descending createdAt order
 *   ✓ returns empty array when no transactions exist
 *   ✓ returns correct total count for pagination
 *   ✓ respects page and limit params
 *
 * TODO (Kawindi): Implement all test cases
 * Coordinate with Disaan as he finishes transactions.service.ts
 */
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionType } from "@prisma/client";

jest.mock("../lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    account: {
      findUnique: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import {
  deposit,
  withdraw,
  getHistory,
} from "../services/transactions.service";
import { prisma as mockPrismaReal } from "../lib/prisma";

const mockPrisma = mockPrismaReal as jest.Mocked<any>;

describe("transactions.service — deposit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates balance and creates DEPOSIT transaction record", async () => {
    const account = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(100),
      currency: "LKR",
      accountNumber: "ACC123",
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(account),
        update: jest.fn().mockResolvedValue({
          ...account,
          balance: new Decimal(150),
        }),
        create: jest.fn(),
      },
      transaction: {
        create: jest.fn().mockResolvedValue({
          id: "tx-1",
          accountId: "acc-1",
          type: TransactionType.DEPOSIT,
          amount: new Decimal(50),
          balanceAfter: new Decimal(150),
        }),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    const result = await deposit("user-1", 50);

    expect(tx.account.update).toHaveBeenCalled();
    expect(tx.transaction.create).toHaveBeenCalled();
    expect(result.newBalance).toBe(150);
  });

  it("auto-creates account if user has none", async () => {
    const createdAccount = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(0),
      currency: "LKR",
      accountNumber: "ACC123",
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(createdAccount),
        update: jest.fn().mockResolvedValue({
          ...createdAccount,
          balance: new Decimal(50),
        }),
      },
      transaction: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    await deposit("user-1", 50);

    expect(tx.account.create).toHaveBeenCalled();
  });

  it("correctly calculates new balance", async () => {
    const account = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(200),
      currency: "LKR",
      accountNumber: "ACC123",
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(account),
        update: jest.fn().mockResolvedValue({
          ...account,
          balance: new Decimal(300),
        }),
        create: jest.fn(),
      },
      transaction: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    const result = await deposit("user-1", 100);

    expect(result.newBalance).toBe(300);
  });

  it("throws for negative amount", async () => {
    await expect(deposit("user-1", -10)).rejects.toMatchObject({
      code: "INVALID_AMOUNT",
    });
  });

  it("throws for zero amount", async () => {
    await expect(deposit("user-1", 0)).rejects.toMatchObject({
      code: "INVALID_AMOUNT",
    });
  });
});

describe("transactions.service — withdraw", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates balance and creates WITHDRAWAL transaction", async () => {
    const account = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(100),
      currency: "LKR",
      accountNumber: "ACC123",
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(account),
        update: jest.fn().mockResolvedValue({
          ...account,
          balance: new Decimal(60),
        }),
      },
      transaction: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    const result = await withdraw("user-1", 40);

    expect(tx.account.update).toHaveBeenCalled();
    expect(result.newBalance).toBe(60);
  });

  it("correctly calculates new balance", async () => {
    const account = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(200),
      currency: "LKR",
      accountNumber: "ACC123",
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(account),
        update: jest.fn().mockResolvedValue({
          ...account,
          balance: new Decimal(150),
        }),
      },
      transaction: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    const result = await withdraw("user-1", 50);

    expect(result.newBalance).toBe(150);
  });

  it("throws INSUFFICIENT_FUNDS when amount > balance", async () => {
    const account = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(100),
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(account),
      },
      transaction: {
        create: jest.fn(),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    await expect(withdraw("user-1", 150)).rejects.toMatchObject({
      code: "INSUFFICIENT_FUNDS",
    });
  });

  it("throws INSUFFICIENT_FUNDS when amount == balance + 0.01", async () => {
    const account = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(100),
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(account),
      },
      transaction: {
        create: jest.fn(),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    await expect(withdraw("user-1", 100.01)).rejects.toMatchObject({
      code: "INSUFFICIENT_FUNDS",
    });
  });

  it("allows full withdrawal when amount == balance", async () => {
    const account = {
      id: "acc-1",
      userId: "user-1",
      balance: new Decimal(100),
    };

    const tx = {
      account: {
        findUnique: jest.fn().mockResolvedValue(account),
        update: jest.fn().mockResolvedValue({
          ...account,
          balance: new Decimal(0),
        }),
      },
      transaction: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

    const result = await withdraw("user-1", 100);

    expect(result.newBalance).toBe(0);
  });

  it("throws for negative amount", async () => {
    await expect(withdraw("user-1", -5)).rejects.toMatchObject({
      code: "INVALID_AMOUNT",
    });
  });

  it("throws for zero amount", async () => {
    await expect(withdraw("user-1", 0)).rejects.toMatchObject({
      code: "INVALID_AMOUNT",
    });
  });
});

describe("transactions.service — getHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns paginated results in descending order", async () => {
    const account = { id: "acc-1" };

    mockPrisma.account.findUnique.mockResolvedValue(account as any);
    mockPrisma.transaction.findMany.mockResolvedValue([{ id: "tx1" }] as any);
    mockPrisma.transaction.count.mockResolvedValue(1 as any);

    const result = await getHistory("user-1", 1, 10);

    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
      })
    );

    expect(result.transactions.length).toBe(1);
  });

  it("returns empty array when no account exists", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null as any);

    const result = await getHistory("user-1", 1, 10);

    expect(result.transactions).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("respects page and limit params", async () => {
    const account = { id: "acc-1" };

    mockPrisma.account.findUnique.mockResolvedValue(account as any);
    mockPrisma.transaction.findMany.mockResolvedValue([] as any);
    mockPrisma.transaction.count.mockResolvedValue(0 as any);

    await getHistory("user-1", 3, 5);

    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 5,
      })
    );
  });

  it("returns correct total count", async () => {
    const account = { id: "acc-1" };

    mockPrisma.account.findUnique.mockResolvedValue(account as any);
    mockPrisma.transaction.findMany.mockResolvedValue([] as any);
    mockPrisma.transaction.count.mockResolvedValue(25 as any);

    const result = await getHistory("user-1", 1, 10);

    expect(result.total).toBe(25);
  });
});