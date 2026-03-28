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
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

interface AccessTokenPayload {
  userId: string;
  email: string;
}

interface RefreshTokenPayload {
  userId: string;
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  // TODO (Sandun): Implement
  // return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
  throw new Error("TODO: Sandun — implement generateAccessToken");
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  // TODO (Sandun): Implement
  // return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRY });
  throw new Error("TODO: Sandun — implement generateRefreshToken");
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  // TODO (Sandun): Implement
  // return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
  throw new Error("TODO: Sandun — implement verifyAccessToken");
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  // TODO (Sandun): Implement
  // return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
  throw new Error("TODO: Sandun — implement verifyRefreshToken");
}
