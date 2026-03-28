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
 * register()
 *   ✓ creates user and returns tokens when email is new
 *   ✓ throws 409 CONFLICT when email already exists
 *   ✓ hashes password with bcrypt (never stores plain text)
 *   ✓ calls notificationClient.sendOTP after creating user
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
describe("auth.service", () => {
  // TODO (Kawindi): implement tests
  it.todo("register — creates user when email is new");
  it.todo("register — throws 409 when email already exists");
  it.todo("register — hashes password, never stores plain text");
  it.todo("register — calls notificationClient.sendOTP");
  it.todo("login — returns tokens when credentials are valid");
  it.todo("login — throws 404 when email not found");
  it.todo("login — throws 401 when password is wrong");
  it.todo("login — calls notificationClient.sendOTP on success");
  it.todo("refreshAccessToken — returns new tokens for valid refresh token");
  it.todo("refreshAccessToken — throws 401 for revoked token");
  it.todo("refreshAccessToken — throws 401 for expired token");
  it.todo("logout — revokes the refresh token");
});
