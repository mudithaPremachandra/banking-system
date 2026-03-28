/**
 * Gateway — Zod Validation Tests
 * OWNER: Kawindi (Testing)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Write tests for the Gateway's Zod validation middleware.
 * Use Supertest to make HTTP requests to the Express app.
 * Mock outbound axios calls to backend services using jest.mock("axios").
 *
 * TEST CASES TO IMPLEMENT:
 *
 * POST /api/auth/register
 *   ✓ 400 when email is missing
 *   ✓ 400 when email format is invalid
 *   ✓ 400 when password is less than 8 characters
 *   ✓ 400 when fullName is less than 2 characters
 *   ✓ forwards valid request to Auth Service (mock axios)
 *
 * POST /api/auth/login
 *   ✓ 400 when email is missing
 *   ✓ 400 when password is missing
 *   ✓ forwards valid request to Auth Service
 *
 * POST /api/otp/verify
 *   ✓ 400 when otpCode is not exactly 6 digits
 *   ✓ 400 when userId is not a valid UUID
 *
 * POST /api/accounts/me/deposit
 *   ✓ 400 when amount is negative
 *   ✓ 400 when amount is zero
 *   ✓ 400 when amount is missing
 *   ✓ 401 when no Authorization header
 *
 * MOCKING PATTERN:
 * import request from "supertest";
 * import app from "../app";
 * jest.mock("axios");
 * const mockedAxios = jest.mocked(axios);
 * mockedAxios.post.mockResolvedValue({ status: 200, data: { ... } });
 *
 * TODO (Kawindi): Implement all test cases
 * Add supertest to gateway package.json devDependencies: "supertest": "^6.3.0"
 */
describe("Gateway — POST /api/auth/register validation", () => {
  it.todo("400 when email is missing");
  it.todo("400 when email format is invalid");
  it.todo("400 when password is less than 8 characters");
  it.todo("400 when fullName is less than 2 characters");
  it.todo("forwards valid request to Auth Service");
});

describe("Gateway — POST /api/auth/login validation", () => {
  it.todo("400 when email is missing");
  it.todo("400 when password is missing");
  it.todo("forwards valid request to Auth Service");
});

describe("Gateway — POST /api/otp/verify validation", () => {
  it.todo("400 when otpCode is not exactly 6 characters");
  it.todo("400 when userId is not a valid UUID");
});

describe("Gateway — POST /api/accounts/me/deposit validation", () => {
  it.todo("400 when amount is negative");
  it.todo("400 when amount is zero");
  it.todo("401 when no Authorization header provided");
});
