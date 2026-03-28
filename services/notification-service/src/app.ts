/**
 * Notification Service — Main Application Entry Point
 * OWNER: Geethika (Notification Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This is a standalone Express application running on port 3003.
 * It handles OTP generation, email delivery, and verification.
 *
 * This service is called INTERNALLY by the Auth Service (not by the frontend
 * directly, except for OTP verification which goes through the Gateway).
 *
 * KEY RESPONSIBILITIES:
 * - Generate 6-digit OTPs using crypto.randomInt
 * - Hash OTPs with bcrypt before storing (never store plain OTP)
 * - Send OTP via email using Nodemailer
 * - Verify OTPs (compare hash, check expiry, mark as used)
 *
 * IMPLEMENTATION:
 * 1. Apply middleware: cors(), express.json(), morgan("dev")
 * 2. Mount routes: app.use("/otp", otpRoutes)
 * 3. Health check: GET /health
 * 4. Global error handler
 * 5. Listen on PORT (default 3003)
 *
 * TODO (Geethika): Import and mount OTP routes, add error handling
 */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import otpRoutes from "./routes/otp.routes";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Health Check ---
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "notification-service" });
});

// --- Routes ---
app.use("/otp", otpRoutes);

// --- Error Handler ---
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[Notification Service Error]", err.message);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  }
);

// --- Start Server ---
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`[Notification Service] Running on port ${PORT}`);
});

export default app;
