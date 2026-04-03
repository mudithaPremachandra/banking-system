/**
 * Notification Service Client — Inter-Service REST Communication
 * OWNER: Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file makes HTTP calls to the Notification Service to trigger OTP emails.
 * It is called by auth.service.ts after successful login/registration.
 *
 * INTER-SERVICE CALL (from architecture doc, page 5):
 *   Auth Service → POST http://notification-service:3003/otp/send
 *   Request body: { userId: string, email: string }
 *   Response: 200 { message: string, otpId: string }
 *
 * IMPORTANT:
 * - The URL is set via NOTIFICATION_SERVICE_URL env var
 * - Inside Docker: http://notification-service:3003
 * - Outside Docker (dev): http://localhost:3003
 * - If the Notification Service is down, login should still succeed
 *   (OTP sending failure should be logged but not block login)
 *
 * TODO (Sandun):
 * - Implement sendOTP function using axios
 * - Add error handling: log failures but don't throw (graceful degradation)
 * - Coordinate with Geethika on the exact API contract
 */
import axios from "axios";

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3003";

export async function sendOTP(data: {
  userId: string;
  email: string;
}): Promise<void> {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/otp/send`, data);
    console.log(
      `[Auth Service] OTP request sent to Notification Service for ${data.email}`
    );
  } catch (error) {
    // Log but don't throw — OTP failure shouldn't block login
    console.error("[Auth Service] Failed to send OTP:", error);
    // TODO (Sandun): Consider adding retry logic or a dead-letter queue
  }
}
