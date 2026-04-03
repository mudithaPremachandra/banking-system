/**
 * Auth Route Proxy — Forwards auth requests to Auth Service
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This router receives auth-related requests from the frontend and proxies
 * them to the Auth Service at AUTH_SERVICE_URL (http://auth-service:3001).
 *
 * ROUTES TO IMPLEMENT:
 *
 * 1. POST /login (public)
 *    - Validate body with loginSchema (email, password)
 *    - Forward to AUTH_SERVICE_URL/auth/login
 *    - Auth Service will internally call Notification Service to send OTP
 *    - Return 200 response with user + tokens
 *
 * 3. POST /refresh (public)
 *    - Validate body with refreshSchema (refreshToken)
 *    - Forward to AUTH_SERVICE_URL/auth/refresh
 *    - Return new tokens
 *
 * 4. POST /logout (public — needs refreshToken in body)
 *    - Validate body with logoutSchema (refreshToken)
 *    - Forward to AUTH_SERVICE_URL/auth/logout
 *
 * 5. GET /verify-token (used internally by Gateway itself)
 *    - Forward Authorization header to AUTH_SERVICE_URL/auth/verify-token
 *    - Return { valid: true, userId } or 401
 *
 * 6. GET /me (protected — requires valid JWT)
 *    - TODO: Add JWT pre-verification middleware
 *    - Forward to AUTH_SERVICE_URL/auth/me with Authorization header
 *
 * PROXY PATTERN:
 *   For each route, use axios to make the same request to the Auth Service:
 *   - Forward the request body as-is (after Zod validation)
 *   - Forward relevant headers (Authorization, Content-Type)
 *   - Return the Auth Service's response status and body to the client
 *   - If axios throws (service down, 4xx, 5xx), forward the error response
 *
 * TODO (Sanjaya): Implement all routes with axios proxying
 */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosError } from "axios";
import { config } from "../config";
import { validate } from "../middleware/zodValidation";
import { loginSchema, refreshSchema, logoutSchema, updateProfileSchema, changePasswordSchema } from "../schemas";
import { jwtVerifyMiddleware } from "../middleware/jwtVerify";

const router = Router();
const AUTH_URL = config.authServiceUrl;
const handleAxiosError = (err: unknown, res: Response, next: NextFunction) => {
  if (axios.isAxiosError(err)) {
    return res
      .status(err.response?.status || 500)
      .json(err.response?.data || { message: err.message });
  }
  next(err);
};

// POST /api/auth/login
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Auth Service
      const response = await axios.post(`${AUTH_URL}/auth/login`,req.body);
      res.status(response.status).json(response.data);
      // res.status(501).json({
      //   success: false,
      //   error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      // });
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

// POST /api/auth/refresh
router.post(
  "/refresh",
  validate(refreshSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Auth Service
        const response = await axios.post(`${AUTH_URL}/auth/refresh`,req.body
      );
      res.status(response.status).json(response.data);
      // res.status(501).json({
      //   success: false,
      //   error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      // });
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

// POST /api/auth/logout
router.post(
  "/logout",
  validate(logoutSchema),
  async (req: Request, res: Response, next: NextFunction) => {
      // TODO (Sanjaya): Proxy to Auth Service
       try {
      const response = await axios.post(`${AUTH_URL}/auth/logout`,req.body);
      res.status(response.status).json(response.data);
      // res.status(501).json({
      //   success: false,
      //   error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      // });
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

// GET /api/auth/verify-token
router.get(
  "/verify-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Forward Authorization header to Auth Service
      const response = await axios.get(`${AUTH_URL}/auth/verify-token`, {
         headers: { Authorization: req.headers.authorization },
       });
       res.json(response.data);
      // res.status(501).json({
      //   success: false,
      //   error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      // });
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

// GET /api/auth/me (protected)
router.get(
  "/me",
  jwtVerifyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
      // TODO (Sanjaya): Proxy to Auth Service with Authorization header
      try {
      const response = await axios.get(`${AUTH_URL}/auth/me`,
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );
      res.status(response.status).json(response.data);
      // res.status(501).json({
      //   success: false,
      //   error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      // });
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

// PATCH /api/auth/me/profile (protected)
router.patch(
  "/me/profile",
  jwtVerifyMiddleware,
  validate(updateProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.patch(`${AUTH_URL}/auth/profile`, req.body, {
        headers: { Authorization: req.headers.authorization },
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

// POST /api/auth/me/change-password (protected)
router.post(
  "/me/change-password",
  jwtVerifyMiddleware,
  validate(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.post(`${AUTH_URL}/auth/change-password`, req.body, {
        headers: { Authorization: req.headers.authorization },
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

// GET /api/auth/me/sessions (protected)
router.get(
  "/me/sessions",
  jwtVerifyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(`${AUTH_URL}/auth/sessions`, {
        headers: { Authorization: req.headers.authorization },
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      return handleAxiosError(err, res, next);
    }
  }
);

export default router;
