/**
 * Notifications Service — OTP Business Logic
 * OWNER: Geethika (Notification Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file contains all OTP business logic: generation, hashing,
 * storage, email sending, and verification.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. sendOTP(userId: string, email: string)
 *    STEPS:
 *    a. Invalidate any existing unused OTPs for this user
 *       → notificationsRepository.invalidateExistingOTPs(userId)
 *    b. Generate 6-digit OTP: crypto.randomInt(100000, 999999).toString()
 *    c. Hash the OTP with bcrypt (10 salt rounds) — NEVER store plain OTP
 *    d. Calculate expiry: new Date(Date.now() + 5 * 60 * 1000) (5 minutes)
 *    e. Store in DB: notificationsRepository.createOTP({ userId, email, otpHash, expiresAt })
 *    f. Send email with the PLAIN OTP via emailService.sendOTPEmail(email, otp)
 *    g. Return { otpId: record.id }
 *
 *    IMPORTANT: Hash BEFORE storing, send plain OTP via email.
 *    If email fails, still store the OTP (user can request resend).
 *
 * 2. verifyOTP(userId: string, otpCode: string)
 *    STEPS:
 *    a. Find the latest unused OTP for this user
 *       → notificationsRepository.findLatestUnusedOTP(userId)
 *    b. If not found → return { valid: false, expired: false }
 *    c. Check if expired (expiresAt < now) → return { valid: false, expired: true }
 *    d. Compare otpCode with stored hash using bcrypt.compare()
 *    e. If match → mark OTP as used, return { valid: true, expired: false }
 *    f. If no match → return { valid: false, expired: false }
 *
 * 3. cleanupExpiredOTPs() (optional — for maintenance)
 *    - Delete all OTP records older than 24 hours
 *    - Can be called periodically or on each request
 *
 * TODO (Geethika): Implement all functions
 * TODO (Kawindi): Write tests for OTP generation, expiry, reuse prevention
 */
import crypto from "crypto";
import bcrypt from "bcryptjs";
import * as notificationsRepository from "../repositories/notifications.repository";
import * as emailService from "./email.service";

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 5;

export async function sendOTP(userId: string, email: string) {
  // TODO (Geethika): Implement OTP generation and sending
  //
  // Step 1: Invalidate existing OTPs for this user
  // await notificationsRepository.invalidateExistingOTPs(userId);
  //
  // Step 2: Generate 6-digit OTP
  // const otp = crypto.randomInt(100000, 999999).toString();
  //
  // Step 3: Hash the OTP
  // const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
  //
  // Step 4: Calculate expiry
  // const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  //
  // Step 5: Store in DB
  // const record = await notificationsRepository.createOTP({
  //   userId, email, otpHash, expiresAt,
  // });
  //
  // Step 6: Send email (don't await — fire and forget, or await with try/catch)
  // try {
  //   await emailService.sendOTPEmail(email, otp);
  // } catch (err) {
  //   console.error("Failed to send OTP email:", err);
  //   // Still return success — OTP is stored, user can request resend
  // }
  //
  // return { otpId: record.id };

  throw new Error("TODO: Geethika — implement sendOTP");
}

export async function verifyOTP(userId: string, otpCode: string) {
  // TODO (Geethika): Implement OTP verification
  //
  // Step 1: Find latest unused OTP
  // const otpRecord = await notificationsRepository.findLatestUnusedOTP(userId);
  // if (!otpRecord) return { valid: false, expired: false };
  //
  // Step 2: Check expiry
  // if (new Date() > otpRecord.expiresAt) return { valid: false, expired: true };
  //
  // Step 3: Compare hash
  // const isValid = await bcrypt.compare(otpCode, otpRecord.otpHash);
  // if (!isValid) return { valid: false, expired: false };
  //
  // Step 4: Mark as used
  // await notificationsRepository.markAsUsed(otpRecord.id);
  //
  // return { valid: true, expired: false };

  throw new Error("TODO: Geethika — implement verifyOTP");
}
