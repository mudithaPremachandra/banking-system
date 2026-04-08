/**
 * Account Service — Integration Tests
 * OWNER: Testing Team
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Write integration tests for the account service HTTP endpoints.
 * Use Supertest to make HTTP requests to the Express app.
 * Use a test database for account and transaction data.
 *
 * TEST CASES TO IMPLEMENT:
 *
 * GET /accounts/me (protected)
 *   ✓ returns 200 with user accounts when authenticated
 *   ✓ returns 401 when no token provided
 *
 * POST /accounts/me/deposit (protected)
 *   ✓ returns 200 and creates deposit transaction
 *   ✓ returns 400 when amount is invalid
 *   ✓ updates account balance correctly
 *
 * POST /accounts/me/withdraw (protected)
 *   ✓ returns 200 and creates withdrawal transaction
 *   ✓ returns 400 when insufficient funds
 *   ✓ returns 400 when amount is invalid
 *
 * GET /accounts/me/transactions (protected)
 *   ✓ returns 200 with transaction history
 *   ✓ returns empty array when no transactions
 *
 * SETUP:
 * - Use test database
 * - Mock JWT verification (or use test tokens)
 * - Clean up test data after each test
 */

import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Account Service — Integration Tests", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear all tables
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
  });

  describe("GET /accounts/me", () => {
    it("returns 200 with user accounts when authenticated", async () => {
      // Create test account directly (user exists in auth service)
      const testUserId = "test-user-id";
      const account = await prisma.account.create({
        data: {
          userId: testUserId,
          accountNumber: "1234567890",
          balance: 1000.00
        }
      });

      // Mock authentication middleware
      const response = await request(app)
        .get("/accounts/me")
        .set("x-user-id", testUserId); // Assuming you use x-user-id header

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("account");
      expect(response.body.account).toHaveProperty("accountNumber", "1234567890");
      expect(response.body.account.balance).toBe(1000.0);
    });

    it("returns 401 when no user id provided", async () => {
      const response = await request(app).get("/accounts/me");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /accounts/me/deposit", () => {
    it("returns 200 and creates deposit transaction", async () => {
      // Create test account directly
      const testUserId = "test-user-id";
      const account = await prisma.account.create({
        data: {
          userId: testUserId,
          accountNumber: "1234567890",
          balance: 1000.00
        }
      });

      const depositAmount = 500.00;

      const response = await request(app)
        .post("/accounts/me/deposit")
        .set("x-user-id", testUserId)
        .send({ amount: depositAmount });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("transaction");
      expect(response.body.transaction.type).toBe("DEPOSIT");
      expect(response.body.transaction.amount).toBe(depositAmount);

      // Verify balance updated
      const updatedAccount = await prisma.account.findUnique({
        where: { id: account.id },
      });
      expect(Number(updatedAccount?.balance)).toBe(1500.0);

      // Verify transaction created
      const transactions = await prisma.transaction.findMany({
        where: { accountId: account.id }
      });
      expect(transactions).toHaveLength(1);
      expect(transactions[0].type).toBe("DEPOSIT");
    });

    it("returns 400 when amount is negative", async () => {
      const testUserId = "test-user-id";

      const response = await request(app)
        .post("/accounts/me/deposit")
        .set("x-user-id", testUserId)
        .send({ amount: -100 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /accounts/me/withdraw", () => {
    it("returns 200 and creates withdrawal transaction", async () => {
      // Create test account with sufficient balance
      const testUserId = "test-user-id";
      const account = await prisma.account.create({
        data: {
          userId: testUserId,
          accountNumber: "1234567890",
          balance: 1000.00
        }
      });

      const withdrawAmount = 300.00;

      const response = await request(app)
        .post("/accounts/me/withdraw")
        .set("x-user-id", testUserId)
        .send({ amount: withdrawAmount });

      expect(response.status).toBe(200);
      expect(response.body.transaction.type).toBe("WITHDRAWAL");

      // Verify balance updated
      const updatedAccount = await prisma.account.findUnique({
        where: { id: account.id },
      });
      expect(Number(updatedAccount?.balance)).toBe(700.0);
    });

    it("returns 400 when insufficient funds", async () => {
      const testUserId = "test-user-id";
      await prisma.account.create({
        data: {
          userId: testUserId,
          accountNumber: "1234567890",
          balance: 100.00
        }
      });

      const response = await request(app)
        .post("/accounts/me/withdraw")
        .set("x-user-id", testUserId)
        .send({ amount: 200.00 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INSUFFICIENT_FUNDS");
    });
  });

  describe("GET /health", () => {
    it("returns service health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "ok",
        service: "account-service"
      });
    });
  });
});