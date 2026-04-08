import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from "../services/token.service";

describe("token.service", () => {

  const accessPayload = {
    userId: "user-1",
    email: "test@example.com",
  };

  const refreshPayload = {
    userId: "user-1",
  };

  describe("generateAccessToken", () => {

    it("returns a signed JWT string", () => {
      const token = generateAccessToken(accessPayload);

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("generated access token can be verified back to same payload", () => {
      const token = generateAccessToken(accessPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(accessPayload.userId);
      expect(decoded.email).toBe(accessPayload.email);
    });

  });

  describe("generateRefreshToken", () => {

    it("returns a signed refresh token string", () => {
      const token = generateRefreshToken(refreshPayload);

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("generated refresh token can be verified back to same payload", () => {
      const token = generateRefreshToken(refreshPayload);
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(refreshPayload.userId);
    });

  });

  describe("verifyAccessToken", () => {

    it("returns decoded payload for valid access token", () => {
      const token = generateAccessToken(accessPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded).toHaveProperty("userId");
      expect(decoded).toHaveProperty("email");
    });

    it("throws error for invalid access token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyAccessToken(invalidToken)).toThrow();
    });

  });

  describe("verifyRefreshToken", () => {

    it("returns decoded payload for valid refresh token", () => {
      const token = generateRefreshToken(refreshPayload);
      const decoded = verifyRefreshToken(token);

      expect(decoded).toHaveProperty("userId");
    });

    it("throws error for invalid refresh token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyRefreshToken(invalidToken)).toThrow();
    });

  });

  describe("getRefreshTokenExpiry", () => {

    it("returns a future Date object", () => {
      const expiryDate = getRefreshTokenExpiry();

      expect(expiryDate).toBeInstanceOf(Date);
      expect(expiryDate.getTime()).toBeGreaterThan(Date.now());
    });

  });

});