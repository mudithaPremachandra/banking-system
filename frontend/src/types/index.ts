/**
 * Shared TypeScript Types for Frontend
 * OWNER: Muditha (Frontend Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * These types must stay in sync with the backend API response shapes.
 * The backend uses the error envelope: { success: false, error: { code, message } }
 * The backend uses the success envelope: { success: true, data: { ... } }
 *
 * TODO (Muditha):
 * - Keep these types updated as backend developers finalize their response shapes
 * - Coordinate with Sandun (Auth), Disaan (Account), and Sanjaya (Gateway)
 */

// --- User & Auth ---

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface OTPVerifyResponse {
  verified: boolean;
}

// --- Account & Transactions ---

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description?: string;
  createdAt: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
}

export interface DepositWithdrawResponse {
  transaction: Transaction;
  newBalance: number;
}

// --- API Error ---

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
