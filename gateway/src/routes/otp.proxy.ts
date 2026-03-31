/**
 * OTP Route Proxy — Forwards OTP requests to Notification Service
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This router handles OTP-related requests. Note from the architecture doc:
 * - POST /otp/send is primarily called INTERNALLY by the Auth Service
 *   (Auth → Notification after login). It may not need to be exposed via Gateway.
 * - POST /otp/verify IS called by the frontend via the Gateway.
 *
 * ROUTES:
 *
 * 1. POST /send (internal — consider restricting access)
 *    - Validate body with otpSendSchema (userId, email)
 *    - Forward to NOTIFICATION_SERVICE_URL/otp/send
 *    - Note: This is normally called by Auth Service, not frontend
 *
 * 2. POST /verify (public — called by frontend after login)
 *    - Validate body with otpVerifySchema (userId, otpCode)
 *    - Forward to NOTIFICATION_SERVICE_URL/otp/verify
 *    - Return { verified: true } or 400/410 error
 *
 * TODO (Sanjaya):
 * - Implement proxy logic
 * - Decide whether to expose /send endpoint or restrict it
 * - Coordinate with Geethika on the Notification Service API contract
 */
import { Router, Request, Response, NextFunction } from "express";
import axios from "axios";
import { config } from "../config";
import { validate } from "../middleware/zodValidation";
import { otpSendSchema, otpVerifySchema } from "../schemas";

const router = Router();
const NOTIFICATION_URL = config.notificationServiceUrl;

// POST /api/otp/send (internal — Auth Service normally calls this directly)
router.post(
  "/send",
  validate(otpSendSchema),
  async (req: Request, res: Response, next: NextFunction) => {
     try {
      const response = await axios.post(`${NOTIFICATION_URL}/otp/send`, req.body, {
        headers: { "Content-Type": "application/json" },
      });
      res.status(response.status).json(response.data);
    } catch (err: any) {
      if (err.response) {
        return res.status(err.response.status).json(err.response.data);
      }
      next(err);
    }
  }
);

// POST /api/otp/verify (called by frontend)
router.post(
  "/verify",
  validate(otpVerifySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.post(`${NOTIFICATION_URL}/otp/verify`, req.body, {
        headers: { "Content-Type": "application/json" },
      });
      res.status(response.status).json(response.data);
    } catch (err: any) {
      if (err.response) {
        return res.status(err.response.status).json(err.response.data);
      }
      next(err);
    }
  }
);

export default router;
