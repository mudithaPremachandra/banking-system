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
 * 1. POST /register (public)
 *    - Validate body with registerSchema (email, password, fullName, phone?)
 *    - Forward to AUTH_SERVICE_URL/auth/register
 *    - Return 201 response from Auth Service
 *
 * 2. POST /login (public)
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
import axios from "axios";
import { config } from "../config";
import { validate } from "../middleware/zodValidation";
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from "../schemas";

const router = Router();
const AUTH_URL = config.authServiceUrl;

// POST /api/auth/register
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Auth Service
      // const response = await axios.post(`${AUTH_URL}/auth/register`, req.body);
      // res.status(response.status).json(response.data);
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Auth Service
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      });
    } catch (err) {
      next(err);
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
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/logout
router.post(
  "/logout",
  validate(logoutSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Auth Service
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/verify-token
router.get(
  "/verify-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Forward Authorization header to Auth Service
      // const response = await axios.get(`${AUTH_URL}/auth/verify-token`, {
      //   headers: { Authorization: req.headers.authorization },
      // });
      // res.json(response.data);
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me (protected)
router.get(
  "/me",
  // TODO (Sanjaya): Add JWT pre-verification middleware here
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO (Sanjaya): Proxy to Auth Service with Authorization header
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "TODO: Sanjaya — proxy to Auth Service" },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
