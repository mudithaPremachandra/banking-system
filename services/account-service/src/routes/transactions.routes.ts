/**
 * Transaction Routes
 * OWNER: Disaan (Account & Transaction Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * These routes handle deposits, withdrawals, and transaction history.
 * All routes are PROTECTED.
 *
 * ROUTES (from architecture doc, page 9):
 *
 * 1. POST /accounts/me/deposit (protected)
 *    Body: { amount: number, description?: string }
 *    → Validate: amount must be positive
 *    → Call transactionsService.deposit(userId, amount, description)
 *    → Response: 200 { transaction, newBalance }
 *
 * 2. POST /accounts/me/withdraw (protected)
 *    Body: { amount: number, description?: string }
 *    → Validate: amount must be positive AND not exceed balance
 *    → Call transactionsService.withdraw(userId, amount, description)
 *    → Response: 200 { transaction, newBalance }
 *    → Error: 400 { error: { code: "INSUFFICIENT_FUNDS" } } if balance too low
 *
 * 3. GET /accounts/me/transactions (protected)
 *    Query: ?page=1&limit=10
 *    → Call transactionsService.getHistory(userId, page, limit)
 *    → Response: 200 { transactions[], total, page }
 *
 * CRITICAL: Deposits and withdrawals MUST use Prisma interactive transactions
 * ($transaction) for atomicity. A withdrawal must:
 * 1. Read the current balance
 * 2. Check if sufficient funds exist
 * 3. Update the balance
 * 4. Create the Transaction record
 * All within a single database transaction to prevent race conditions.
 *
 * TODO (Disaan): Implement all routes
 * TODO (Kawindi): Write tests for insufficient funds, concurrent deposits
 */
import { Router, Response, NextFunction } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import * as transactionsService from "../services/transactions.service";

interface CodedError extends Error {
  code?: string;
}

function parsePositiveAmount(value: unknown): number {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    const err = new Error("Amount must be greater than zero") as CodedError;
    err.code = "INVALID_AMOUNT";
    throw err;
  }
  return amount;
}

const router = Router();

// POST /accounts/me/deposit
router.post(
  "/me/deposit",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: { code: "AUTH_REQUIRED", message: "Authentication required" },
        });
        return;
      }

      const { amount, description } = req.body;
      const parsedAmount = parsePositiveAmount(amount);
      const result = await transactionsService.deposit(
        req.userId,
        parsedAmount,
        description
      );

      res.json({ transaction: result.transaction, newBalance: result.newBalance });
    } catch (err) {
      const e = err as CodedError;
      if (e.code === "INVALID_AMOUNT") {
        res.status(400).json({
          success: false,
          error: { code: "INVALID_AMOUNT", message: e.message },
        });
        return;
      }
      next(err);
    }
  }
);

// POST /accounts/me/withdraw
router.post(
  "/me/withdraw",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: { code: "AUTH_REQUIRED", message: "Authentication required" },
        });
        return;
      }

      const { amount, description } = req.body;
      const parsedAmount = parsePositiveAmount(amount);

      const result = await transactionsService.withdraw(
        req.userId,
        parsedAmount,
        description
      );

      res.json({ transaction: result.transaction, newBalance: result.newBalance });
    } catch (err) {
      const e = err as CodedError;

      if (e.code === "INVALID_AMOUNT") {
        res.status(400).json({
          success: false,
          error: { code: "INVALID_AMOUNT", message: e.message },
        });
        return;
      }

      if (e.code === "INSUFFICIENT_FUNDS") {
        res.status(400).json({
          success: false,
          error: { code: "INSUFFICIENT_FUNDS", message: e.message },
        });
        return;
      }

      if (e.code === "ACCOUNT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          error: { code: "ACCOUNT_NOT_FOUND", message: e.message },
        });
        return;
      }

      next(err);
    }
  }
);

// POST /accounts/me/transfer
router.post(
  "/me/transfer",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: { code: "AUTH_REQUIRED", message: "Authentication required" },
        });
        return;
      }

      const { toAccountNumber, amount, description } = req.body;
      const parsedAmount = parsePositiveAmount(amount);

      if (!toAccountNumber || typeof toAccountNumber !== "string") {
        res.status(400).json({
          success: false,
          error: { code: "INVALID_INPUT", message: "Recipient account number is required" },
        });
        return;
      }

      const result = await transactionsService.transfer(
        req.userId,
        toAccountNumber,
        parsedAmount,
        description
      );

      res.json({ transaction: result.transaction, newBalance: result.newBalance });
    } catch (err) {
      const e = err as CodedError;

      if (e.code === "INVALID_AMOUNT") {
        res.status(400).json({
          success: false,
          error: { code: "INVALID_AMOUNT", message: e.message },
        });
        return;
      }

      if (e.code === "INSUFFICIENT_FUNDS") {
        res.status(400).json({
          success: false,
          error: { code: "INSUFFICIENT_FUNDS", message: e.message },
        });
        return;
      }

      if (e.code === "ACCOUNT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          error: { code: "ACCOUNT_NOT_FOUND", message: e.message },
        });
        return;
      }

      if (e.code === "SELF_TRANSFER") {
        res.status(400).json({
          success: false,
          error: { code: "SELF_TRANSFER", message: e.message },
        });
        return;
      }

      next(err);
    }
  }
);

// GET /accounts/me/transactions
router.get(
  "/me/transactions",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: { code: "AUTH_REQUIRED", message: "Authentication required" },
        });
        return;
      }

      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await transactionsService.getHistory(req.userId, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
