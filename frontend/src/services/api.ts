/**
 * API Service Layer — Axios Instance & Request Functions
 * OWNER: Muditha (Frontend Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file is the ONLY place the frontend makes HTTP calls. All requests go through
 * the API Gateway at /api (proxied via Vite in dev, nginx in production).
 *
 * IMPLEMENTATION REQUIREMENTS:
 *
 * 1. AXIOS INSTANCE:
 *    - baseURL: "/api" (gateway handles routing to correct backend service)
 *    - Request interceptor: read accessToken from localStorage, attach as
 *      Authorization: Bearer <token> header on every request
 *    - Response interceptor: on 401, attempt to refresh the token by calling
 *      POST /api/auth/refresh with the stored refreshToken. If refresh succeeds,
 *      retry the original request with the new token. If refresh also fails (401),
 *      clear tokens from localStorage and redirect to /login.
 *
 * 2. AUTH FUNCTIONS (calls to Auth Service via Gateway):
 *    - registerUser({ email, password, fullName, phone? }) → POST /api/auth/register
 *    - loginUser({ email, password }) → POST /api/auth/login
 *    - verifyOTP({ userId, otpCode }) → POST /api/otp/verify
 *    - refreshToken(refreshToken) → POST /api/auth/refresh
 *    - logoutUser(refreshToken) → POST /api/auth/logout
 *    - getMe() → GET /api/auth/me (protected)
 *
 * 3. ACCOUNT FUNCTIONS (calls to Account Service via Gateway):
 *    - getAccount() → GET /api/accounts/me (protected)
 *    - getBalance() → GET /api/accounts/me/balance (protected)
 *    - deposit({ amount, description? }) → POST /api/accounts/me/deposit (protected)
 *    - withdraw({ amount, description? }) → POST /api/accounts/me/withdraw (protected)
 *    - getTransactions(page?, limit?) → GET /api/accounts/me/transactions (protected)
 *
 * 4. ERROR HANDLING:
 *    - All functions should return typed responses using the types from ../types
 *    - Catch axios errors and throw typed ApiError objects
 *    - Log errors in development mode (console.error)
 *
 * TOKEN STORAGE:
 *    - accessToken → localStorage.getItem("accessToken")
 *    - refreshToken → localStorage.getItem("refreshToken")
 *    - user → localStorage.getItem("user") (JSON stringified)
 *
 * TODO (Muditha):
 * - Implement the axios instance with interceptors
 * - Implement all API functions listed above
 * - Add proper TypeScript return types from ../types/index.ts
 */
import axios from "axios";
import type {
  AuthResponse,
  OTPVerifyResponse,
  DepositWithdrawResponse,
  TransactionListResponse,
} from "../types";
// TODO (Muditha): Import Account from "../types" when you implement getAccount()

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO (Muditha): Add request interceptor to attach JWT token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// TODO (Muditha): Add response interceptor for 401 token refresh logic
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true;
//       try {
//         const rt = localStorage.getItem("refreshToken");
//         const { data } = await axios.post("/api/auth/refresh", { refreshToken: rt });
//         localStorage.setItem("accessToken", data.accessToken);
//         localStorage.setItem("refreshToken", data.refreshToken);
//         error.config.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(error.config);
//       } catch {
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// --- Auth API Functions ---
// TODO (Muditha): Implement each function

export const registerUser = async (data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}): Promise<AuthResponse> => {
  throw new Error("TODO: implement registerUser — POST /api/auth/register");
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  throw new Error("TODO: implement loginUser — POST /api/auth/login");
};

export const verifyOTP = async (data: {
  userId: string;
  otpCode: string;
}): Promise<OTPVerifyResponse> => {
  throw new Error("TODO: implement verifyOTP — POST /api/otp/verify");
};

// --- Account API Functions ---

export const getBalance = async (): Promise<{
  balance: number;
  currency: string;
}> => {
  throw new Error(
    "TODO: implement getBalance — GET /api/accounts/me/balance"
  );
};

export const deposit = async (data: {
  amount: number;
  description?: string;
}): Promise<DepositWithdrawResponse> => {
  throw new Error(
    "TODO: implement deposit — POST /api/accounts/me/deposit"
  );
};

export const withdraw = async (data: {
  amount: number;
  description?: string;
}): Promise<DepositWithdrawResponse> => {
  throw new Error(
    "TODO: implement withdraw — POST /api/accounts/me/withdraw"
  );
};

export const getTransactions = async (
  page?: number,
  limit?: number
): Promise<TransactionListResponse> => {
  throw new Error(
    "TODO: implement getTransactions — GET /api/accounts/me/transactions"
  );
};

export default api;
