/**
 * requireAuth Middleware — JWT Verification for Protected Routes
 * OWNER: Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * THIS IS A CRITICAL BLOCKER — Sandun must deliver this first because
 * all protected routes in the Auth Service AND the Account Service depend on it.
 *
 * IMPLEMENTATION:
 * 1. Extract the Authorization header from the request
 * 2. Check format: "Bearer <token>"
 * 3. If missing or malformed → return 401 { code: "AUTH_REQUIRED" }
 * 4. Verify the JWT using tokenService.verifyAccessToken(token)
 * 5. If valid → attach userId and email to req (extend Express Request type)
 *    and call next()
 * 6. If expired → return 401 { code: "TOKEN_EXPIRED" }
 * 7. If invalid → return 401 { code: "INVALID_TOKEN" }
 *
 * USAGE:
 *   import { requireAuth } from "../middleware/requireAuth";
 *   router.get("/me", requireAuth, (req, res) => {
 *     const userId = (req as any).userId;
 *     // ...
 *   });
 *
 * NOTE FOR DISAAN (Account Service):
 * You can either:
 * A. Copy this middleware into account-service (simple, since both share JWT_SECRET)
 * B. Call Auth Service's GET /auth/verify-token to validate (more decoupled)
 * Option A is recommended for simplicity.
 *
 * TODO (Sandun):
 * - Implement this middleware FIRST — it's a blocker for Disaan and Sanjaya
 * - Handle TokenExpiredError vs JsonWebTokenError differently
 * - Extend Express Request type to include userId and userEmail
 */
import { Request, Response, NextFunction } from "express";
// import * as tokenService from "../services/token.service";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: { code: "AUTH_REQUIRED", message: "Authentication required" },
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // TODO (Sandun): Verify the token and attach user info to request
    // const decoded = tokenService.verifyAccessToken(token);
    // (req as any).userId = decoded.userId;
    // (req as any).userEmail = decoded.email;
    // next();

    // TEMPORARY: Pass through (remove this after implementing token verification)
    res.status(501).json({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "TODO: Sandun — implement requireAuth" },
    });
  } catch (err) {
    // TODO (Sandun): Handle TokenExpiredError vs other errors
    res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Invalid or expired token" },
    });
  }
}
