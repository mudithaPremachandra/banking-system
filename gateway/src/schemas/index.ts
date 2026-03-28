/**
 * Zod Validation Schemas — Request Body Validation
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * The gateway validates ALL incoming request bodies using Zod before
 * proxying to backend services. This provides a first line of defense
 * and returns clear validation errors to the frontend.
 *
 * These schemas match the API contract defined in the architecture doc.
 * Each schema validates the request body for a specific endpoint.
 *
 * TODO (Sanjaya):
 * - Review these schemas against the architecture doc (pages 9-10)
 * - Add any additional constraints (e.g., password complexity rules)
 * - Keep schemas in sync with backend service expectations
 * - Consider adding query parameter schemas for GET endpoints with pagination
 */
import { z } from "zod";

// --- Auth Schemas ---

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// --- OTP Schemas ---

export const otpSendSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  email: z.string().email("Invalid email format"),
});

export const otpVerifySchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  otpCode: z.string().length(6, "OTP must be exactly 6 digits"),
});

// --- Account Schemas ---

export const depositSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
});

export const withdrawSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
});

// --- Query Schemas ---

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
