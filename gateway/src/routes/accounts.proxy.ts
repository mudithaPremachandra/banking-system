/**
 * Account Route Proxy — Forwards account requests to Account Service
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This router receives account-related requests and proxies them to the
 * Account Service at ACCOUNT_SERVICE_URL (http://account-service:3002).
 *
 * ALL ROUTES ARE PROTECTED — they require a valid JWT.
 * The Gateway should verify the JWT (either locally using JWT_SECRET or by
 * calling Auth Service's /auth/verify-token) and extract the userId.
 * The userId is then forwarded to the Account Service via an x-user-id header.
 *
 * ROUTES TO IMPLEMENT:
 *
 * 1. GET /me (protected)
 *    - Forward to ACCOUNT_SERVICE_URL/accounts/me
 *    - Pass x-user-id header with userId from JWT
 *
 * 2. GET /me/balance (protected)
 *    - Forward to ACCOUNT_SERVICE_URL/accounts/me/balance
 *
 * 3. POST /me/deposit (protected)
 *    - Validate body with depositSchema (amount, description?)
 *    - Forward to ACCOUNT_SERVICE_URL/accounts/me/deposit
 *
 * 4. POST /me/withdraw (protected)
 *    - Validate body with withdrawSchema (amount, description?)
 *    - Forward to ACCOUNT_SERVICE_URL/accounts/me/withdraw
 *
 * 5. GET /me/transactions (protected)
 *    - Forward query params (page, limit) to ACCOUNT_SERVICE_URL/accounts/me/transactions
 *
 * JWT VERIFICATION OPTIONS (pick one):
 * Option A (simpler): Verify JWT locally using jsonwebtoken + JWT_SECRET
 * Option B (more secure): Call Auth Service GET /auth/verify-token with the JWT
 *
 * TODO (Sanjaya):
 * - Add JWT verification middleware to all routes
 * - Implement proxy logic for each route
 * - Forward x-user-id header to Account Service
 */
import { Router, Request, Response, NextFunction } from "express";
import axios from "axios";
import { config } from "../config";
import { validate } from "../middleware/zodValidation";
import { depositSchema, withdrawSchema } from "../schemas";

const router = Router();
const ACCOUNT_URL = config.accountServiceUrl;

// TODO (Sanjaya): Add JWT verification middleware to this router
// router.use(jwtVerifyMiddleware);

// GET /api/accounts/me
router.get(
  "/me",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Account Service
      // const userId = (req as any).userId; // from JWT middleware
      // const response = await axios.get(`${ACCOUNT_URL}/accounts/me`, {
      //   headers: { "x-user-id": userId },
      // });
      // res.json(response.data);
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Account Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/accounts/me/balance
router.get(
  "/me/balance",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Account Service
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Account Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/accounts/me/deposit
router.post(
  "/me/deposit",
  validate(depositSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Account Service
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Account Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/accounts/me/withdraw
router.post(
  "/me/withdraw",
  validate(withdrawSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Account Service
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Account Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/accounts/me/transactions
router.get(
  "/me/transactions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Account Service with query params
      // const { page, limit } = req.query;
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Account Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
