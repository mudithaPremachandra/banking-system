/**
 * Token Service — JWT Generation and Verification
 * OWNER: Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file handles all JWT operations. It is used by auth.service.ts
 * and by the requireAuth middleware.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. generateAccessToken(payload: { userId: string, email: string })
 *    - Sign with JWT_SECRET
 *    - Expiry: JWT_ACCESS_EXPIRY (default "15m")
 *    - Returns: signed JWT string
 *
 * 2. generateRefreshToken(payload: { userId: string })
 *    - Sign with JWT_SECRET (same secret, or use a separate refresh secret)
 *    - Expiry: JWT_REFRESH_EXPIRY (default "7d")
 *    - Returns: signed JWT string
 *
 * 3. verifyAccessToken(token: string)
 *    - Verify and decode using JWT_SECRET
 *    - Returns: { userId, email } payload
 *    - Throws: TokenExpiredError or JsonWebTokenError
 *
 * 4. verifyRefreshToken(token: string)
 *    - Verify and decode using JWT_SECRET
 *    - Returns: { userId } payload
 *    - Throws: TokenExpiredError or JsonWebTokenError
 *
 * ENVIRONMENT VARIABLES:
 * - JWT_SECRET: The secret key for signing/verifying tokens
 * - JWT_ACCESS_EXPIRY: Access token expiry (e.g., "15m")
 * - JWT_REFRESH_EXPIRY: Refresh token expiry (e.g., "7d")
 *
 * TODO (Sandun):
 * - Implement all functions using the jsonwebtoken library
 * - Handle TokenExpiredError separately from other JWT errors
 * - Consider using different secrets for access vs refresh tokens
 */
import { sign, verify, TokenExpiredError, JsonWebTokenError, type Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "your-secret-key-here";
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "your-secret-key-here";
const ACCESS_EXPIRY = (process.env.JWT_ACCESS_EXPIRY || "15m") as StringValue;
const REFRESH_EXPIRY = (process.env.JWT_REFRESH_EXPIRY || "7d") as StringValue;

function parseExpiryToMs(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiry format: ${expiry}`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unsupported expiry unit: ${unit}`);
  }
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + parseExpiryToMs(REFRESH_EXPIRY));
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  return sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("[Token Service] Access token expired");
      throw error;
    } else if (error instanceof JsonWebTokenError) {
      console.error("[Token Service] Invalid access token");
      throw error;
    }
    throw error;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("[Token Service] Refresh token expired");
      throw error;
    } else if (error instanceof JsonWebTokenError) {
      console.error("[Token Service] Invalid refresh token");
      throw error;
    }
    throw error;
  }
}
