/**
 * requireAuth Middleware for Account Service
 * OWNER: Disaan (Account Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This middleware verifies JWTs on protected routes in the Account Service.
 * It works the same way as the Auth Service's requireAuth middleware.
 *
 * TWO OPTIONS (pick one):
 *
 * OPTION A — Local JWT verification (RECOMMENDED for simplicity):
 * - Use jsonwebtoken to verify the token with the shared JWT_SECRET
 * - This avoids an extra HTTP call to Auth Service on every request
 * - Requires both services to share the same JWT_SECRET env var
 *
 * OPTION B — Call Auth Service for verification:
 * - Make GET request to AUTH_SERVICE_URL/auth/verify-token
 * - More decoupled but adds latency on every request
 *
 * IMPLEMENTATION:
 * 1. Extract Authorization header: "Bearer <token>"
 * 2. Verify the JWT
 * 3. Attach userId to the request object
 * 4. Also check x-user-id header (set by Gateway as a fallback)
 *
 * TODO (Disaan):
 * - Implement using Option A (shared JWT_SECRET)
 * - Copy the pattern from auth-service/src/middleware/requireAuth.ts
 *   after Sandun implements it
 */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Option 1: Check x-user-id header (set by Gateway after its own JWT check)
    const userIdHeader = req.headers["x-user-id"];
    if (userIdHeader && typeof userIdHeader === "string") {
      (req as any).userId = userIdHeader;
      next();
      return;
    }

    // Option 2: Verify JWT directly
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: { code: "AUTH_REQUIRED", message: "Authentication required" },
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // TODO (Disaan): Verify token and extract userId
    // const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    // (req as any).userId = decoded.userId;
    // next();

    res.status(501).json({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "TODO: Disaan — implement requireAuth" },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Invalid or expired token" },
    });
  }
}
