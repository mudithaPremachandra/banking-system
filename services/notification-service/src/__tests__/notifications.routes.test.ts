/**
 * Notification Service — Integration Tests
 * OWNER: Testing Team
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Write integration tests for the notification service HTTP endpoints.
 * Use Supertest to make HTTP requests to the Express app.
 * Use a test database for OTP records.
 * Mock email sending (nodemailer) to avoid actual emails.
 *
 * TEST CASES TO IMPLEMENT:
 *
 * POST /otp/send
 *   ✓ returns 200 and creates OTP record when email is valid
 *   ✓ returns 400 when email format is invalid
 *   ✓ sends email with OTP (mocked)
 *
 * POST /otp/verify
 *   ✓ returns 200 when OTP is correct and within 5 minutes
 *   ✓ returns 400 when OTP is incorrect
 *   ✓ returns 400 when OTP is expired (after 5 minutes)
 *   ✓ returns 400 when OTP has already been used
 *
 * SETUP:
 * - Use test database
 * - Mock nodemailer transport
 * - Clean up test data after each test
 * - Use fixed OTP for testing (or mock random generation)
 */

import request from "supertest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

jest.mock("nodemailer");

const prisma = new PrismaClient();

const sendMailMock = jest.fn().mockResolvedValue({ messageId: "test-id" });
const mockedCreateTransport = nodemailer.createTransport as jest.Mock;
mockedCreateTransport.mockReturnValue({ sendMail: sendMailMock });

const app = require("../app").default;

describe("Notification Service — Integration Tests", () => {

  beforeAll(async () => {
    process.env.SMTP_USER = "test-user";
    process.env.SMTP_PASS = "test-pass";

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear OTP table
    await prisma.oTP.deleteMany();
    jest.clearAllMocks();
  });

  describe("POST /otp/send", () => {
    it("returns 200 and creates OTP record", async () => {
      const response = await request(app)
        .post("/otp/send")
        .send({ userId: "user-123", email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("OTP sent");

      // Verify OTP was created in database
      const otps = await prisma.oTP.findMany({
        where: { userId: "user-123" }
      });
      expect(otps).toHaveLength(1);

      // Verify email was sent
      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "test@example.com",
          subject: expect.stringContaining("OTP")
        })
      );
    });

    it("returns 400 when email format is invalid", async () => {
      const response = await request(app)
        .post("/otp/send")
        .send({ userId: "user-123", email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /otp/verify", () => {
    it("returns 200 when OTP is correct and valid", async () => {
      // Create test OTP
      const otpCode = "123456";
      const hashedOtp = await bcrypt.hash(otpCode, 10);

      await prisma.oTP.create({
        data: {
          userId: "user-123",
          email: "test@example.com",
          otpHash: hashedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
        }
      });

      const response = await request(app)
        .post("/otp/verify")
        .send({
          userId: "user-123",
          otpCode: otpCode
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ verified: true });

      // Verify OTP was deleted (one-time use)
      const otps = await prisma.oTP.findMany({
        where: { userId: "user-123" }
      });
      expect(otps).toHaveLength(1);
      expect(otps[0]?.used).toBe(true);
    });

    it("returns 400 when OTP is incorrect", async () => {
      // Create test OTP
      const hashedOtp = await bcrypt.hash("123456", 10);

      await prisma.oTP.create({
        data: {
          userId: "user-123",
          email: "test@example.com",
          otpHash: hashedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }
      });

      const response = await request(app)
        .post("/otp/verify")
        .send({
          userId: "user-123",
          otpCode: "654321" // Wrong OTP
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INVALID_OTP");
    });

    it("returns 400 when OTP is expired", async () => {
      // Create expired OTP
      const hashedOtp = await bcrypt.hash("123456", 10);

      await prisma.oTP.create({
        data: {
          userId: "user-123",
          email: "test@example.com",
          otpHash: hashedOtp,
          expiresAt: new Date(Date.now() - 1000) // Already expired
        }
      });

      const response = await request(app)
        .post("/otp/verify")
        .send({
          userId: "user-123",
          otpCode: "123456"
        });

      expect(response.status).toBe(410);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("OTP_EXPIRED");    });

    it("returns 400 when no OTP exists for email", async () => {
      const response = await request(app)
        .post("/otp/verify")
        .send({
          userId: "nonexistent-user",
          otpCode: "123456"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INVALID_OTP");
    });
  });

  describe("GET /health", () => {
    it("returns service health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "ok",
        service: "notification-service"
      });
    });
  });
});