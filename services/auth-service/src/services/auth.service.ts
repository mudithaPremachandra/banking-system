/**
 * Auth Service — Business Logic Layer
 * OWNER: Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file contains ALL authentication business logic. Routes call these
 * functions. These functions call the repository layer for database operations
 * and the token service for JWT operations.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. register({ email, password, fullName, phone? })
 *    STEPS:
 *    a. Check if email already exists → if yes, throw 409 CONFLICT
 *    b. Hash password using bcrypt (10-12 salt rounds)
 *    c. Create User record via authRepository.createUser()
 *    d. Generate access token + refresh token via tokenService
 *    e. Store refresh token in Token table via authRepository.createToken()
 *    f. Call notificationClient.sendOTP() to send OTP email
 *    g. Return { user: { id, email, fullName }, accessToken, refreshToken }
 *
 * 2. login({ email, password })
 *    STEPS:
 *    a. Find user by email → if not found, throw 404 NOT_FOUND
 *    b. Compare password with stored hash using bcrypt → if mismatch, throw 401
 *    c. Generate access token + refresh token
 *    d. Store refresh token in Token table
 *    e. Call notificationClient.sendOTP({ userId, email }) to trigger OTP
 *       This calls POST http://notification-service:3003/otp/send
 *    f. Return { user, accessToken, refreshToken }
 *
 * 3. refreshToken(refreshToken)
 *    STEPS:
 *    a. Find Token record by refreshToken → if not found, throw 401
 *    b. Check if revoked → if yes, throw 401
 *    c. Check if expired → if yes, throw 401
 *    d. Verify the refresh token JWT signature
 *    e. Revoke the old refresh token (rotate)
 *    f. Generate new access + refresh tokens
 *    g. Store new refresh token
 *    h. Return { accessToken, refreshToken }
 *
 * 4. logout(refreshToken)
 *    STEPS:
 *    a. Find Token record → revoke it (set revoked = true)
 *    b. Return { message: "Logged out successfully" }
 *
 * 5. getUserById(userId)
 *    - Fetch user from DB, return without passwordHash
 *
 * SECURITY NOTES:
 * - NEVER return passwordHash in any response
 * - bcrypt salt rounds: 10-12 (10 is fine for development)
 * - Access tokens: ~15 min expiry, contain { userId, email }
 * - Refresh tokens: ~7 days expiry, contain { userId }
 *
 * TODO (Sandun): Implement all functions above
 */
import bcrypt from "bcryptjs";
import * as authRepository from "../repositories/auth.repository";
import * as tokenService from "./token.service";
import * as notificationClient from "./notification.client";

const SALT_ROUNDS = 10;

export async function register(data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}) {
  // TODO (Sandun): Implement registration logic
  // Step 1: Check if email exists
  // Step 2: Hash password
  // Step 3: Create user
  // Step 4: Generate tokens
  // Step 5: Store refresh token
  // Step 6: Send OTP
  // Step 7: Return response
  throw new Error("TODO: Sandun — implement register");
}

export async function login(data: { email: string; password: string }) {
  // TODO (Sandun): Implement login logic
  // Step 1: Find user by email
  // Step 2: Compare password
  // Step 3: Generate tokens
  // Step 4: Store refresh token
  // Step 5: Call notification service to send OTP
  // Step 6: Return response
  throw new Error("TODO: Sandun — implement login");
}

export async function refreshAccessToken(refreshTokenValue: string) {
  // TODO (Sandun): Implement token refresh logic
  // Step 1: Find token record
  // Step 2: Check revoked/expired
  // Step 3: Verify JWT signature
  // Step 4: Rotate tokens
  // Step 5: Return new tokens
  throw new Error("TODO: Sandun — implement refreshToken");
}

export async function logout(refreshTokenValue: string) {
  // TODO (Sandun): Revoke the refresh token
  throw new Error("TODO: Sandun — implement logout");
}

export async function getUserById(userId: string) {
  // TODO (Sandun): Fetch user and return without passwordHash
  throw new Error("TODO: Sandun — implement getUserById");
}
