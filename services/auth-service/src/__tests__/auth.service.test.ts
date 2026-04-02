/**
 * Auth Service — Unit Tests
 * OWNER: Kawindi (Testing)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Write unit tests for the auth service business logic.
 * Mock the repository layer (Prisma) and notification client using jest.mock().
 * Do NOT hit a real database in unit tests.
 *
 * TEST CASES TO IMPLEMENT:
 *
 * login()
 *   ✓ returns user and tokens when credentials are valid
 *   ✓ throws 404 USER_NOT_FOUND when email doesn't exist
 *   ✓ throws 401 INVALID_CREDENTIALS when password is wrong
 *   ✓ calls notificationClient.sendOTP after successful login
 *
 * refreshAccessToken()
 *   ✓ returns new tokens when refresh token is valid
 *   ✓ throws 401 when token is revoked
 *   ✓ throws 401 when token is expired
 *   ✓ rotates refresh token (old token is revoked, new one created)
 *
 * logout()
 *   ✓ revokes the refresh token
 *   ✓ does not throw when token is already revoked
 *
 * MOCKING PATTERN:
 * jest.mock("../repositories/auth.repository");
 * jest.mock("../services/notification.client");
 * import * as authRepo from "../repositories/auth.repository";
 * const mockFindUserByEmail = jest.mocked(authRepo.findUserByEmail);
 * mockFindUserByEmail.mockResolvedValue(null); // no user found
 *
 * TODO (Kawindi): Implement all test cases above
 * Coordinate with Sandun as he finishes implementing auth.service.ts
 */
import bcrypt from "bcryptjs";
import * as authRepository from "../repositories/auth.repository";
import * as tokenService from "../services/token.service";
import * as notificationClient from "../services/notification.client";
import { login, refreshToken, logout } from "../services/auth.service";

jest.mock("bcryptjs");
jest.mock("../repositories/auth.repository");
jest.mock("../services/token.service");
jest.mock("../services/notification.client");

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("returns user and tokens when credentials are valid", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        fullName: "Test User",
        phone: "0712345678",
        passwordHash: "hashed-password",
      };

      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (tokenService.generateAccessToken as jest.Mock).mockReturnValue("access-token");
      (tokenService.generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");
      (tokenService.getRefreshTokenExpiry as jest.Mock).mockReturnValue(new Date("2030-01-01"));
      (authRepository.createToken as jest.Mock).mockResolvedValue(undefined);
      (notificationClient.sendOTP as jest.Mock).mockResolvedValue(undefined);

      const result = await login({
        email: "test@example.com",
        password: "plain-password",
      });

      expect(authRepository.findUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("plain-password", "hashed-password");
      expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
        userId: "user-1",
        email: "test@example.com",
      });
      expect(tokenService.generateRefreshToken).toHaveBeenCalledWith({
        userId: "user-1",
      });
      expect(authRepository.createToken).toHaveBeenCalledWith({
        userId: "user-1",
        refreshToken: "refresh-token",
        expiresAt: new Date("2030-01-01"),
      });
      expect(notificationClient.sendOTP).toHaveBeenCalledWith({
        userId: "user-1",
        email: "test@example.com",
      });

      expect(result).toEqual({
        user: {
          id: "user-1",
          email: "test@example.com",
          fullName: "Test User",
          phone: "0712345678",
        },
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("throws 404 when email not found", async () => {
      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        login({
          email: "missing@example.com",
          password: "plain-password",
        })
      ).rejects.toEqual({
        statusCode: 404,
        message: "User not found",
      });

      expect(authRepository.findUserByEmail).toHaveBeenCalledWith("missing@example.com");
    });

    it("throws 401 when password is wrong", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        fullName: "Test User",
        phone: "0712345678",
        passwordHash: "hashed-password",
      };

      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        login({
          email: "test@example.com",
          password: "wrong-password",
        })
      ).rejects.toEqual({
        statusCode: 401,
        message: "Invalid credentials",
      });

      expect(bcrypt.compare).toHaveBeenCalledWith("wrong-password", "hashed-password");
    });

    it("calls notificationClient.sendOTP on success", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        fullName: "Test User",
        phone: "0712345678",
        passwordHash: "hashed-password",
      };

      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (tokenService.generateAccessToken as jest.Mock).mockReturnValue("access-token");
      (tokenService.generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");
      (tokenService.getRefreshTokenExpiry as jest.Mock).mockReturnValue(new Date("2030-01-01"));
      (authRepository.createToken as jest.Mock).mockResolvedValue(undefined);
      (notificationClient.sendOTP as jest.Mock).mockResolvedValue(undefined);

      await login({
        email: "test@example.com",
        password: "plain-password",
      });

      expect(notificationClient.sendOTP).toHaveBeenCalledTimes(1);
      expect(notificationClient.sendOTP).toHaveBeenCalledWith({
        userId: "user-1",
        email: "test@example.com",
      });
    });
  });

  describe("refreshToken", () => {
    it("returns new tokens when refresh token is valid", async () => {
      const mockTokenRecord = {
        id: "token-1",
        userId: "user-1",
        refreshToken: "old-refresh-token",
        revoked: false,
        expiresAt: new Date("2030-01-01"),
      };

      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        fullName: "Test User",
        phone: "0712345678",
      };

      (authRepository.findTokenByRefreshToken as jest.Mock).mockResolvedValue(mockTokenRecord);
      (tokenService.verifyRefreshToken as jest.Mock).mockReturnValue({ userId: "user-1" });
      (authRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (authRepository.revokeToken as jest.Mock).mockResolvedValue(undefined);
      (tokenService.generateAccessToken as jest.Mock).mockReturnValue("new-access-token");
      (tokenService.generateRefreshToken as jest.Mock).mockReturnValue("new-refresh-token");
      (tokenService.getRefreshTokenExpiry as jest.Mock).mockReturnValue(new Date("2031-01-01"));
      (authRepository.createToken as jest.Mock).mockResolvedValue(undefined);

      const result = await refreshToken("old-refresh-token");

      expect(authRepository.findTokenByRefreshToken).toHaveBeenCalledWith("old-refresh-token");
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith("old-refresh-token");
      expect(authRepository.findUserById).toHaveBeenCalledWith("user-1");
      expect(authRepository.revokeToken).toHaveBeenCalledWith("token-1");
      expect(authRepository.createToken).toHaveBeenCalledWith({
        userId: "user-1",
        refreshToken: "new-refresh-token",
        expiresAt: new Date("2031-01-01"),
      });

      expect(result).toEqual({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
    });

    it("throws 401 when token is revoked", async () => {
      (authRepository.findTokenByRefreshToken as jest.Mock).mockResolvedValue({
        id: "token-1",
        revoked: true,
        expiresAt: new Date("2030-01-01"),
      });

      await expect(refreshToken("revoked-token")).rejects.toEqual({
        statusCode: 401,
        message: "Token revoked",
      });
    });

    it("throws 401 when token is expired", async () => {
      (authRepository.findTokenByRefreshToken as jest.Mock).mockResolvedValue({
        id: "token-1",
        revoked: false,
        expiresAt: new Date("2020-01-01"),
      });

      await expect(refreshToken("expired-token")).rejects.toEqual({
        statusCode: 401,
        message: "Token expired",
      });
    });

    it("rotates refresh token (old token is revoked, new one created)", async () => {
      const mockTokenRecord = {
        id: "token-1",
        userId: "user-1",
        refreshToken: "old-refresh-token",
        revoked: false,
        expiresAt: new Date("2030-01-01"),
      };

      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        fullName: "Test User",
        phone: "0712345678",
      };

      (authRepository.findTokenByRefreshToken as jest.Mock).mockResolvedValue(mockTokenRecord);
      (tokenService.verifyRefreshToken as jest.Mock).mockReturnValue({ userId: "user-1" });
      (authRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (authRepository.revokeToken as jest.Mock).mockResolvedValue(undefined);
      (tokenService.generateAccessToken as jest.Mock).mockReturnValue("new-access-token");
      (tokenService.generateRefreshToken as jest.Mock).mockReturnValue("rotated-refresh-token");
      (tokenService.getRefreshTokenExpiry as jest.Mock).mockReturnValue(new Date("2031-01-01"));
      (authRepository.createToken as jest.Mock).mockResolvedValue(undefined);

      await refreshToken("old-refresh-token");

      expect(authRepository.revokeToken).toHaveBeenCalledWith("token-1");
      expect(authRepository.createToken).toHaveBeenCalledWith({
        userId: "user-1",
        refreshToken: "rotated-refresh-token",
        expiresAt: new Date("2031-01-01"),
      });
    });
  });

  describe("logout", () => {
    it("revokes the refresh token", async () => {
      (authRepository.findTokenByRefreshToken as jest.Mock).mockResolvedValue({
        id: "token-1",
        refreshToken: "refresh-token",
      });
      (authRepository.revokeToken as jest.Mock).mockResolvedValue(undefined);

      const result = await logout("refresh-token");

      expect(authRepository.findTokenByRefreshToken).toHaveBeenCalledWith("refresh-token");
      expect(authRepository.revokeToken).toHaveBeenCalledWith("token-1");
      expect(result).toEqual({ message: "Logged out successfully" });
    });

    it("throws when token is invalid", async () => {
      (authRepository.findTokenByRefreshToken as jest.Mock).mockResolvedValue(null);

      await expect(logout("invalid-token")).rejects.toEqual({
        statusCode: 401,
        message: "Invalid token",
      });
    });
  });
});