/**
 * Auth Service — Main Application Entry Point
 * OWNER: Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This is a standalone Express application running on port 3001.
 * It handles ALL authentication-related operations:
 * - User registration (hash password, create user, trigger OTP)
 * - User login (verify password, trigger OTP)
 * - JWT token issuing (access + refresh tokens)
 * - Token refresh and revocation
 * - Token verification (used by Gateway and other services)
 *
 * INTER-SERVICE COMMUNICATION:
 * After successful login, this service calls the Notification Service
 * at POST http://notification-service:3003/otp/send to trigger OTP email.
 *
 * IMPLEMENTATION:
 * 1. Apply middleware: cors(), express.json(), morgan("dev")
 * 2. Mount routes: app.use("/auth", authRoutes)
 * 3. Health check: GET /health → 200 { status: "ok", service: "auth-service" }
 * 4. Global error handler (last middleware)
 * 5. Listen on PORT (default 3001)
 *
 * TODO (Sandun):
 * - Import and mount auth routes
 * - Add error handling middleware
 * - Ensure Prisma client connects on startup
 */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Health Check ---
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

// --- Routes ---
app.use("/auth", authRoutes);

// --- Error Handler ---
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "An unexpected error occurred";
    console.error("[Auth Service Error]", statusCode, message);
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 500 ? "INTERNAL_ERROR" : "AUTH_ERROR", message },
    });
  }
);

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Auth Service] Running on port ${PORT}`);
});

export default app;
