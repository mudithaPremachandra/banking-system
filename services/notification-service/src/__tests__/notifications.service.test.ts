import * as notificationsService from "../services/notifications.service";
import * as notificationsRepository from "../repositories/notifications.repository";
import * as emailService from "../services/email.service";
import bcrypt from "bcryptjs";

jest.mock("../repositories/notifications.repository");
jest.mock("../services/email.service");

const mockedRepository = notificationsRepository as jest.Mocked<
  typeof notificationsRepository
>;
const mockedEmailService = emailService as jest.Mocked<typeof emailService>;

describe("notifications.service — sendOTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRepository.invalidateExistingOTPs.mockResolvedValue({ count: 1 });
    mockedRepository.createOTP.mockResolvedValue({
      id: "otp-1",
      userId: "user-1",
      email: "user@test.com",
      otpHash: "hashed-otp",
      used: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    mockedEmailService.sendOTPEmail.mockResolvedValue();
  });

  it("generates a 6-digit OTP, stores hash, and returns otpId", async () => {
    const result = await notificationsService.sendOTP("user-1", "user@test.com");

    expect(mockedRepository.createOTP).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        email: "user@test.com",
        otpHash: expect.any(String),
        expiresAt: expect.any(Date),
      })
    );
    expect(mockedEmailService.sendOTPEmail).toHaveBeenCalledWith(
      "user@test.com",
      expect.any(String)
    );
    expect(result).toEqual({ otpId: "otp-1" });
  });

  it("stores OTP with roughly 5-minute expiry", async () => {
    const start = Date.now();

    await notificationsService.sendOTP("user-1", "user@test.com");

    const createArg = mockedRepository.createOTP.mock.calls[0][0];
    const expiryDeltaMs = createArg.expiresAt.getTime() - start;
    expect(expiryDeltaMs).toBeGreaterThanOrEqual(5 * 60 * 1000 - 1500);
    expect(expiryDeltaMs).toBeLessThanOrEqual(5 * 60 * 1000 + 1500);
  });

  it("invalidates previous OTPs before creating a new OTP", async () => {
    await notificationsService.sendOTP("user-1", "user@test.com");

    expect(mockedRepository.invalidateExistingOTPs).toHaveBeenCalledWith("user-1");
    expect(mockedRepository.invalidateExistingOTPs.mock.invocationCallOrder[0]).toBeLessThan(
      mockedRepository.createOTP.mock.invocationCallOrder[0]
    );
  });
});

describe("notifications.service — verifyOTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns valid: false when no OTP record exists", async () => {
    mockedRepository.findLatestUnusedOTP.mockResolvedValue(null);

    const result = await notificationsService.verifyOTP("user-1", "123456");

    expect(result).toEqual({
      valid: false,
      expired: false,
    });
    expect(mockedRepository.markAsUsed).not.toHaveBeenCalled();
  });

  it("returns expired: true for expired OTP", async () => {
    mockedRepository.findLatestUnusedOTP.mockResolvedValue({
      id: "otp-1",
      userId: "user-1",
      email: "user@test.com",
      otpHash: "hashed-otp",
      used: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 1000),
    });

    const result = await notificationsService.verifyOTP("user-1", "123456");

    expect(result).toEqual({
      valid: false,
      expired: true,
    });
    expect(mockedRepository.markAsUsed).not.toHaveBeenCalled();
  });

  it("returns valid: false for wrong OTP code", async () => {
    mockedRepository.findLatestUnusedOTP.mockResolvedValue({
      id: "otp-1",
      userId: "user-1",
      email: "user@test.com",
      otpHash: "hashed-otp",
      used: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const result = await notificationsService.verifyOTP("user-1", "wrong-code");

    expect(result).toEqual({
      valid: false,
      expired: false,
    });
    expect(mockedRepository.markAsUsed).not.toHaveBeenCalled();
  });

  it("returns valid: true and marks OTP as used for correct OTP code", async () => {
    const testOtp = "123456";
    const hash = await bcrypt.hash(testOtp, 10);

    const mockOTP = {
      id: "otp-1",
      userId: "user-1",
      email: "user@test.com",
      otpHash: hash,
      used: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    mockedRepository.findLatestUnusedOTP.mockResolvedValue(mockOTP);
    mockedRepository.markAsUsed.mockResolvedValue({
      ...mockOTP,
      used: true,
    });

    const result = await notificationsService.verifyOTP("user-1", testOtp);

    expect(result).toEqual({
      valid: true,
      expired: false,
    });
    expect(mockedRepository.markAsUsed).toHaveBeenCalledWith("otp-1");
  });

  it("rejects replay when OTP is already used", async () => {
    mockedRepository.findLatestUnusedOTP.mockResolvedValue(null);

    const result = await notificationsService.verifyOTP("user-1", "123456");

    expect(result).toEqual({
      valid: false,
      expired: false,
    });
  });
});
