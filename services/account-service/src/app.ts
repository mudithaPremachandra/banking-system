/**
 * Account Service — Main Application Entry Point
 * OWNER: Disaan (Account & Transaction Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This is a standalone Express application running on port 3002.
 * It handles ALL account and transaction operations:
 * - Account lookup and creation
 * - Balance retrieval
 * - Deposits (atomic balance update + transaction record)
 * - Withdrawals (with balance check + atomic update)
 * - Transaction history with pagination
 *
 * JWT VERIFICATION:
 * This service verifies JWTs to identify the user. Options:
 * Option A (recommended): Verify JWT locally using shared JWT_SECRET
 * Option B: Call Auth Service's GET /auth/verify-token
 * The Gateway also sends x-user-id header after its own verification.
 *
 * IMPLEMENTATION:
 * 1. Apply middleware: cors(), express.json(), morgan("dev")
 * 2. Mount routes:
 *    - app.use("/accounts", accountsRoutes)
 *    - app.use("/accounts", transactionsRoutes)
 * 3. Health check: GET /health
 * 4. Global error handler
 * 5. Listen on PORT (default 3002)
 *
 * TODO (Disaan): Import and mount routes, add error handling
 */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import accountsRoutes from "./routes/accounts.routes";
import transactionsRoutes from "./routes/transactions.routes";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Health Check ---
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "account-service" });
});

// --- Routes ---
app.use("/accounts", accountsRoutes);
app.use("/accounts", transactionsRoutes);

// --- Error Handler ---
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[Account Service Error]", err.message);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  }
);

// --- Start Server ---
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`[Account Service] Running on port ${PORT}`);
});

export default app;
