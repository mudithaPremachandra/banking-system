/**
 * Notification Service — Unit Tests
 * OWNER: Kawindi (Testing)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Write unit tests for OTP generation and verification logic.
 * Mock the repository (Prisma) and email service using jest.mock().
 *
 * TEST CASES TO IMPLEMENT:
 *
 * sendOTP()
 *   ✓ generates a 6-digit OTP code
 *   ✓ hashes the OTP before storing (never stores plain OTP)
 *   ✓ stores OTP with 5-minute expiry
 *   ✓ calls emailService.sendOTPEmail with the PLAIN otp (not hash)
 *   ✓ invalidates previous unused OTPs for the same user before creating new one
 *   ✓ returns an otpId
 *
 * verifyOTP()
 *   ✓ returns { valid: true } for correct OTP code
 *   ✓ returns { valid: false } for wrong OTP code
 *   ✓ returns { valid: false, expired: true } for expired OTP (expiresAt in past)
 *   ✓ returns { valid: false } when no OTP record exists for user
 *   ✓ marks OTP as used after successful verification
 *   ✓ does NOT allow same OTP to be used twice (already marked used)
 *
 * TODO (Kawindi): Implement all test cases
 * Coordinate with Geethika as she finishes notifications.service.ts
 */
describe("notifications.service — sendOTP", () => {
  it.todo("generates a 6-digit numeric OTP");
  it.todo("stores a bcrypt hash, not the plain OTP");
  it.todo("stores OTP with 5-minute expiry from now");
  it.todo("calls emailService.sendOTPEmail with plain OTP");
  it.todo("invalidates previous unused OTPs for same user");
  it.todo("returns an otpId");
});

describe("notifications.service — verifyOTP", () => {
  it.todo("returns valid: true for correct OTP code");
  it.todo("returns valid: false for wrong OTP code");
  it.todo("returns expired: true for expired OTP");
  it.todo("returns valid: false when no OTP record exists");
  it.todo("marks OTP as used after successful verification");
  it.todo("rejects already-used OTP (prevents replay)");
});
