/**
 * Auth Repository — Database Access Layer
 * OWNER: Sandun (Auth Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file contains ALL Prisma queries for the Auth Service.
 * The service layer (auth.service.ts) calls these functions.
 * This separation keeps business logic out of the database layer.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. findUserByEmail(email: string)
 *    → prisma.user.findUnique({ where: { email } })
 *    → Returns User | null
 *
 * 2. findUserById(id: string)
 *    → prisma.user.findUnique({ where: { id } })
 *    → Returns User | null (exclude passwordHash in select)
 *
 * 3. createUser(data: { email, passwordHash, fullName, phone? })
 *    → prisma.user.create({ data })
 *    → Returns created User
 *
 * 4. createToken(data: { userId, refreshToken, expiresAt })
 *    → prisma.token.create({ data })
 *    → Returns created Token
 *
 * 5. findTokenByRefreshToken(refreshToken: string)
 *    → prisma.token.findUnique({ where: { refreshToken } })
 *    → Returns Token | null
 *
 * 6. revokeToken(id: string)
 *    → prisma.token.update({ where: { id }, data: { revoked: true } })
 *
 * 7. revokeAllUserTokens(userId: string)
 *    → prisma.token.updateMany({ where: { userId }, data: { revoked: true } })
 *    → Used for "logout from all devices" feature (optional)
 *
 * TODO (Sandun): Implement all functions using the Prisma client from ../lib/prisma
 * TODO (Kasunara): Review queries for performance, suggest indexes if needed
 */
import { prisma } from "../lib/prisma";

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Find user by ID (exclude passwordHash)
 */
export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      createdAt: true,
    },
  });
}

/**
 * Create new user
 */
export async function createUser(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
}) {
  return prisma.user.create({
    data,
  });
}

/**
 * Store refresh token
 */
export async function createToken(data: {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}) {
  return prisma.token.create({
    data,
  });
}

/**
 * Find token by refresh token
 */
export async function findTokenByRefreshToken(refreshToken: string) {
  return prisma.token.findUnique({
    where: { refreshToken },
  });
}

/**
 * Revoke a single token
 */
export async function revokeToken(id: string) {
  return prisma.token.update({
    where: { id },
    data: { revoked: true },
  });
}

/**
 * Revoke all tokens of a user (logout from all devices)
 */
export async function revokeAllUserTokens(userId: string) {
  return prisma.token.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}