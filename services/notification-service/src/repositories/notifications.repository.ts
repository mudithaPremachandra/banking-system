/**
 * Notifications Repository — Database Access Layer
 * OWNER: Geethika (Notification Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Prisma queries for the OTP model. Called by notifications.service.ts.
 *
 * FUNCTIONS TO IMPLEMENT:
 *
 * 1. createOTP(data: { userId, email, otpHash, expiresAt })
 *    → prisma.oTP.create({ data })
 *    → Returns the created OTP record
 *
 * 2. findLatestUnusedOTP(userId: string)
 *    → Find the most recent OTP for this user that is NOT used and NOT expired
 *    → prisma.oTP.findFirst({
 *        where: { userId, used: false },
 *        orderBy: { createdAt: "desc" }
 *      })
 *    → Returns OTP | null
 *
 * 3. markAsUsed(id: string)
 *    → prisma.oTP.update({ where: { id }, data: { used: true } })
 *
 * 4. invalidateExistingOTPs(userId: string)
 *    → Mark all unused OTPs for this user as used (prevents old OTPs from working)
 *    → prisma.oTP.updateMany({ where: { userId, used: false }, data: { used: true } })
 *
 * 5. cleanupExpired(olderThan: Date) (optional)
 *    → Delete OTP records older than the given date
 *    → prisma.oTP.deleteMany({ where: { createdAt: { lt: olderThan } } })
 *
 * TODO (Geethika): Implement all functions
 * TODO (Kasunara): Review queries and suggest indexes
 */
import { prisma } from "../lib/prisma";

export async function createOTP(data: {
  userId: string;
  email: string;
  otpHash: string;
  expiresAt: Date;
}) {
  // TODO (Geethika): Implement
  // return prisma.oTP.create({ data });
  throw new Error("TODO: Geethika — implement createOTP");
}

export async function findLatestUnusedOTP(userId: string) {
  // TODO (Geethika): Implement
  // return prisma.oTP.findFirst({
  //   where: { userId, used: false },
  //   orderBy: { createdAt: "desc" },
  // });
  throw new Error("TODO: Geethika — implement findLatestUnusedOTP");
}

export async function markAsUsed(id: string) {
  // TODO (Geethika): Implement
  // return prisma.oTP.update({ where: { id }, data: { used: true } });
  throw new Error("TODO: Geethika — implement markAsUsed");
}

export async function invalidateExistingOTPs(userId: string) {
  // TODO (Geethika): Implement
  // return prisma.oTP.updateMany({
  //   where: { userId, used: false },
  //   data: { used: true },
  // });
  throw new Error("TODO: Geethika — implement invalidateExistingOTPs");
}
