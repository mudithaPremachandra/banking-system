/**
 * OTP Routes
 * OWNER: Geethika (Notification Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * These routes handle OTP sending and verification.
 *
 * ROUTES (from architecture doc, page 10):
 *
 * 1. POST /otp/send (called internally by Auth Service)
 *    Body: { userId: string, email: string }
 *    → Call notificationsService.sendOTP(userId, email)
 *    → Generates 6-digit OTP, hashes it, stores in DB, sends via email
 *    → Response: 200 { message: "OTP sent successfully", otpId: string }
 *    → Errors: 500 (email delivery failure)
 *
 * 2. POST /otp/verify (called by frontend via Gateway)
 *    Body: { userId: string, otpCode: string }
 *    → Call notificationsService.verifyOTP(userId, otpCode)
 *    → Finds latest unused OTP for user, compares hash, checks expiry
 *    → Response: 200 { verified: true }
 *    → Errors: 400 (invalid OTP code), 410 (OTP expired)
 *
 * SECURITY NOTE:
 * - POST /otp/send should ideally only be called by the Auth Service
 *   (internal Docker network). Consider adding an API key or checking
 *   the caller's IP. For this project, it's acceptable to leave it open.
 * - Rate limit OTP sending: max 5 OTPs per email per hour (optional)
 *
 * TODO (Geethika): Implement both routes
 * TODO (Sandun): Coordinate on the exact request/response shapes
 */
import { Router, Request, Response, NextFunction } from "express";
import * as notificationsService from "../services/notifications.service";

const router = Router();

// POST /otp/send (called by Auth Service after login)
router.post("/send", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, email } = req.body;

    // TODO (Geethika): Validate input
    if (!userId || !email) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "userId and email are required" },
      });
      return;
    }

    const result = await notificationsService.sendOTP(userId, email);
    res.json({ message: "OTP sent successfully", otpId: result.otpId });
  } catch (err) {
    next(err);
  }
});

// POST /otp/verify (called by frontend via Gateway)
router.post("/verify", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, otpCode } = req.body;

    // TODO (Geethika): Validate input
    if (!userId || !otpCode) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "userId and otpCode are required" },
      });
      return;
    }

    const result = await notificationsService.verifyOTP(userId, otpCode);

    if (result.expired) {
      res.status(410).json({
        success: false,
        error: { code: "OTP_EXPIRED", message: "OTP has expired" },
      });
      return;
    }

    if (!result.valid) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_OTP", message: "Invalid OTP code" },
      });
      return;
    }

    res.json({ verified: true });
  } catch (err) {
    next(err);
  }
});

export default router;
