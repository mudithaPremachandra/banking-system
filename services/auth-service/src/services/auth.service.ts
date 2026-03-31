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
 * 1. login({ email, password })
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
  const { email, password, fullName, phone } = data;

  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw { statusCode: 409, message: "Email is already in use" };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await authRepository.createUser({
    email,
    passwordHash,
    fullName,
    phone,
  });

  const accessToken = tokenService.generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  const refreshToken = tokenService.generateRefreshToken({
    userId: user.id,
  });

  await authRepository.createToken({
    userId: user.id,
    refreshToken,
    expiresAt: tokenService.getRefreshTokenExpiry(),
  });

  await notificationClient.sendOTP({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
    },
    accessToken,
    refreshToken,
  };
}

export async function login(data: { email: string; password: string }) {
  const { email, password } = data;

  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const accessToken = tokenService.generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  const refreshToken = tokenService.generateRefreshToken({
    userId: user.id,
  });

  await authRepository.createToken({
    userId: user.id,
    refreshToken,
    expiresAt: tokenService.getRefreshTokenExpiry(),
  });

  await notificationClient.sendOTP({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(refreshTokenValue: string) {
  const tokenRecord = await authRepository.findTokenByRefreshToken(refreshTokenValue);

  if (!tokenRecord) {
    throw { statusCode: 401, message: "Invalid refresh token" };
  }

  if (tokenRecord.revoked) {
    throw { statusCode: 401, message: "Token revoked" };
  }

  if (new Date() > tokenRecord.expiresAt) {
    throw { statusCode: 401, message: "Token expired" };
  }

  const decoded = tokenService.verifyRefreshToken(refreshTokenValue);
  const user = await authRepository.findUserById(decoded.userId);
  if (!user) {
    throw { statusCode: 401, message: "Invalid refresh token" };
  }

  await authRepository.revokeToken(tokenRecord.id);

  const accessToken = tokenService.generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  const newRefreshToken = tokenService.generateRefreshToken({
    userId: user.id,
  });

  await authRepository.createToken({
    userId: user.id,
    refreshToken: newRefreshToken,
    expiresAt: tokenService.getRefreshTokenExpiry(),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(refreshTokenValue: string) {
  const tokenRecord = await authRepository.findTokenByRefreshToken(refreshTokenValue);

  if (!tokenRecord) {
    throw { statusCode: 401, message: "Invalid token" };
  }

  await authRepository.revokeToken(tokenRecord.id);

  return { message: "Logged out successfully" };
}

export async function verifyToken(token: string): Promise<tokenService.AccessTokenPayload> {
  return tokenService.verifyAccessToken(token);
}

export async function getCurrentUser(userId: string) {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return user;
}
