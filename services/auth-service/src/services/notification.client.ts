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
/**
 * Notification Service Client — Inter-Service REST Communication
 * OWNER: Sandun (Auth Service Developer)
 *
 * DESCRIPTION:
 * This module handles sending OTP requests to the Notification Service.
 * Called by Auth Service after successful login or registration.
 *
 * INTER-SERVICE CALL:
 *   POST {NOTIFICATION_SERVICE_URL}/otp/send
 *   Request body: { userId: string, email: string }
 *   Response: 200 { message: string, otpId: string }
 *
 * IMPORTANT:
 * - URL is configured via NOTIFICATION_SERVICE_URL env variable
 * - Docker: http://notification-service:3003
 * - Local dev: http://localhost:3003
 * - Failures are logged but do not block login
 */

import axios from "axios";

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3003";

/**
 * Send OTP to a user's email via Notification Service
 * @param data Object containing userId and email
 */
export async function sendOTP(data: { userId: string; email: string }): Promise<void> {
  try {
    // Make HTTP POST request to Notification Service
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/otp/send`, data, {
      timeout: 5000, // Prevent hanging requests
    });

    console.log(
      `[Auth Service] OTP sent successfully to ${data.email}, otpId: ${response.data.otpId}`
    );
  } catch (error: any) {
    // Log errors but don't throw — OTP failure shouldn't block login
    if (axios.isAxiosError(error)) {
      console.error(
        `[Auth Service] Failed to send OTP to ${data.email}. Status: ${error.response?.status}, Data: ${JSON.stringify(
          error.response?.data
        )}`
      );
    } else {
      console.error("[Auth Service] Unexpected error sending OTP:", error);
    }

    // Optional: implement retry logic, queue, or alerting here
  }
}