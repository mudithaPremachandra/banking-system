/**
 * Auth Routes
 * OWNER: Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Define all auth-related Express routes here. Each route calls
 * the corresponding function in auth.service.ts.
 *
 * ROUTES:
 *
 * 1. POST /login
 *    Body: { email, password }
 *    → Call authService.login()
 *    → This triggers OTP email via Notification Service
 *    → Return 200: { user, accessToken, refreshToken }
 *    → Errors: 401 (wrong password), 404 (user not found)
 *
 * 3. POST /refresh
 *    Body: { refreshToken }
 *    → Call authService.refreshToken()
 *    → Return 200: { accessToken, refreshToken }
 *    → Errors: 401 (revoked/expired token)
 *
 * 4. POST /logout
 *    Body: { refreshToken }
 *    → Call authService.logout()
 *    → Return 200: { message: "Logged out successfully" }
 *
 * 5. GET /verify-token (used by Gateway and other services)
 *    Headers: Authorization: Bearer <token>
 *    → Call tokenService.verifyAccessToken()
 *    → Return 200: { valid: true, userId } or 401
 *
 * 6. GET /me (protected — requires valid JWT)
 *    Headers: Authorization: Bearer <token>
 *    → Use requireAuth middleware
 *    → Return 200: { user }
 *
 * TODO (Sandun):
 * - Import auth service functions
 * - Import requireAuth middleware for protected routes
 * - Implement each route handler with proper error handling
 * - Use try/catch and pass errors to next() for the error handler
 */
import { Router, Request, Response, NextFunction } from "express";
// import * as authService from "../services/auth.service";
// import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// POST /auth/login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO (Sandun): Call authService.login(req.body)
    // This should also trigger OTP via Notification Service
    res.status(501).json({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "TODO: Sandun — implement login" },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh
router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO (Sandun): Call authService.refreshToken(req.body.refreshToken)
    res.status(501).json({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "TODO: Sandun — implement refresh" },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout
router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO (Sandun): Call authService.logout(req.body.refreshToken)
    res.status(501).json({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "TODO: Sandun — implement logout" },
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/verify-token
router.get("/verify-token", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO (Sandun): Extract JWT from Authorization header, verify it
    // Return { valid: true, userId } or 401
    res.status(501).json({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "TODO: Sandun — implement verify-token" },
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me (protected)
router.get(
  "/me",
  // requireAuth, // TODO (Sandun): Uncomment after implementing requireAuth
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sandun): Return user data from req.userId (set by requireAuth)
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sandun — implement /me" },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
