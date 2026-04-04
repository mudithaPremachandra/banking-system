/**
 * API Gateway — Main Application Entry Point
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This is the centralized API Gateway for the banking system. It is the ONLY
 * entry point for the frontend. It contains ZERO business logic — it only:
 * 1. Receives requests from the frontend
 * 2. Validates request bodies using Zod schemas
 * 3. Optionally verifies JWTs by calling Auth Service's /auth/verify-token
 * 4. Proxies the request to the correct backend service
 * 5. Returns the response to the frontend
 *
 * IMPLEMENTATION REQUIREMENTS:
 *
 * 1. MIDDLEWARE STACK (apply in this order):
 *    - cors() — allow requests from frontend origin (http://localhost:5173)
 *    - helmet() — security headers
 *    - morgan("dev") — request logging
 *    - express.json() — parse JSON request bodies
 *
 * 2. ROUTE MOUNTING:
 *    - /api/auth/*   → proxy to AUTH_SERVICE_URL (http://auth-service:3001)
 *    - /api/accounts/* → proxy to ACCOUNT_SERVICE_URL (http://account-service:3002)
 *    - /api/otp/*    → proxy to NOTIFICATION_SERVICE_URL (http://notification-service:3003)
 *
 * 3. HEALTH CHECK: GET /health → 200 { status: "ok", service: "gateway" }
 *
 * 4. ERROR HANDLING: Global error handler middleware (last middleware)
 *    All errors return: { success: false, error: { code, message } }
 *
 * TODO (Sanjaya):
 * - Import and mount route files from ./routes/
 * - Import and apply error handler from ./middleware/errorHandler
 * - Configure CORS with specific origin
 * - Read port from config
 * - Add graceful shutdown handling
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";

// Import route proxies
import authProxy from "./routes/auth.proxy";
import accountsProxy from "./routes/accounts.proxy";
import otpProxy from "./routes/otp.proxy";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// --- Health Check ---
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gateway" });
});

// --- Route Proxies ---
// TODO (Sanjaya): Implement the proxy logic in each route file
app.use("/api/auth", authProxy);
app.use("/api/accounts", accountsProxy);
app.use("/api/otp", otpProxy);

// --- Global Error Handler (must be last) ---
app.use(errorHandler);

// --- Start Server ---
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`[Gateway] Running on port ${PORT}`);
  console.log(`[Gateway] Auth Service: ${config.authServiceUrl}`);
  console.log(`[Gateway] Account Service: ${config.accountServiceUrl}`);
  console.log(`[Gateway] Notification Service: ${config.notificationServiceUrl}`);
});

export default app;
