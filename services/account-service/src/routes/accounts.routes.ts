/**
 * Account Routes
 * OWNER: Disaan (Account & Transaction Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * These routes handle account lookup and balance retrieval.
 * All routes are PROTECTED (require valid JWT via requireAuth middleware).
 *
 * ROUTES (from architecture doc, page 9):
 *
 * 1. GET /accounts/me (protected)
 *    → Return the user's account details
 *    → Auto-create account if it doesn't exist yet (on first access after registration)
 *    → Response: 200 { account }
 *
 * 2. GET /accounts/me/balance (protected)
 *    → Return just the balance and currency
 *    → Response: 200 { balance, currency }
 *
 * The userId comes from:
 * - (req as any).userId — set by requireAuth middleware
 * - OR req.headers["x-user-id"] — set by Gateway
 *
 * TODO (Disaan):
 * - Apply requireAuth middleware to all routes
 * - Call accountsService functions for business logic
 * - Handle auto-creation of account on first access
 */
import { Router, Response, NextFunction } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import * as accountsService from "../services/accounts.service";

const router = Router();

// GET /accounts/me
router.get(
  "/me",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: "AUTH_REQUIRED", message: "Authentication required" },
        });
        return;
      }
      const account = await accountsService.getOrCreateAccount(userId);
      res.json({ account });
    } catch (err) {
      next(err);
    }
  }
);

// GET /accounts/me/balance
router.get(
  "/me/balance",
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

      const result = await accountsService.getBalance(req.userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
