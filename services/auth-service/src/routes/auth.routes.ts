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
import * as authService from "../services/auth.service";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";

const router = Router();

// POST /auth/register
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName, phone } = req.body;

    const result = await authService.register({ email, password, fullName, phone });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh
router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout
router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/verify-token
router.get("/verify-token", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { code: "AUTH_REQUIRED", message: "No token provided" },
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await authService.verifyToken(token);

    res.status(200).json({
      valid: true,
      userId: decoded.userId,
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me (protected)
router.get(
  "/me",
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const user = await authService.getCurrentUser(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /auth/profile (protected)
router.patch(
  "/profile",
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const result = await authService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// POST /auth/change-password (protected)
router.post(
  "/change-password",
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// GET /auth/sessions (protected)
router.get(
  "/sessions",
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const result = await authService.getActiveSessions(userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
