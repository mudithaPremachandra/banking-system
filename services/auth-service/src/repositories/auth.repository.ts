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

export async function findUserByEmail(email: string) {
  // TODO (Sandun): Implement
  // return prisma.user.findUnique({ where: { email } });
  throw new Error("TODO: Sandun — implement findUserByEmail");
}

export async function findUserById(id: string) {
  // TODO (Sandun): Implement — exclude passwordHash from response
  // return prisma.user.findUnique({
  //   where: { id },
  //   select: { id: true, email: true, fullName: true, phone: true, createdAt: true },
  // });
  throw new Error("TODO: Sandun — implement findUserById");
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
}) {
  // TODO (Sandun): Implement
  // return prisma.user.create({ data });
  throw new Error("TODO: Sandun — implement createUser");
}

export async function createToken(data: {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}) {
  // TODO (Sandun): Implement
  // return prisma.token.create({ data });
  throw new Error("TODO: Sandun — implement createToken");
}

export async function findTokenByRefreshToken(refreshToken: string) {
  // TODO (Sandun): Implement
  // return prisma.token.findUnique({ where: { refreshToken } });
  throw new Error("TODO: Sandun — implement findTokenByRefreshToken");
}

export async function revokeToken(id: string) {
  // TODO (Sandun): Implement
  // return prisma.token.update({ where: { id }, data: { revoked: true } });
  throw new Error("TODO: Sandun — implement revokeToken");
}
