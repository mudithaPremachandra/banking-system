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
import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/requireAuth";
// import * as transactionsService from "../services/transactions.service";

const router = Router();

// POST /accounts/me/deposit
router.post(
  "/me/deposit",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { amount, description } = req.body;

      // TODO (Disaan): Validate amount > 0
      // TODO (Disaan): Call transactionsService.deposit(userId, amount, description)
      // const result = await transactionsService.deposit(userId, amount, description);
      // res.json({ transaction: result.transaction, newBalance: result.newBalance });

      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Disaan — implement deposit" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /accounts/me/withdraw
router.post(
  "/me/withdraw",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { amount, description } = req.body;

      // TODO (Disaan): Validate amount > 0
      // TODO (Disaan): Call transactionsService.withdraw(userId, amount, description)
      // Handle INSUFFICIENT_FUNDS error → return 400

      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Disaan — implement withdraw" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /accounts/me/transactions
router.get(
  "/me/transactions",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // TODO (Disaan): Call transactionsService.getHistory(userId, page, limit)
      // const result = await transactionsService.getHistory(userId, page, limit);
      // res.json(result);

      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Disaan — implement transactions list" },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
