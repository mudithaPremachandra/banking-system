/**
 * Authentication Context — Global Auth State Management
 * OWNER: Muditha (Frontend Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This React Context manages ALL authentication state for the entire SPA.
 * Every page component accesses auth state through this context.
 *
 * IMPLEMENTATION REQUIREMENTS:
 *
 * 1. STATE:
 *    - user: User | null — the logged-in user object (id, email, fullName)
 *    - accessToken: string | null — JWT access token (short-lived, ~15 min)
 *    - refreshToken: string | null — JWT refresh token (long-lived, ~7 days)
 *    - isAuthenticated: boolean — derived from whether user + accessToken exist
 *    - isLoading: boolean — true during initial load and async operations
 *
 * 2. ACTIONS (exposed via context):
 *    - login(email, password): Call api.loginUser(), store tokens + user in state
 *      and localStorage. After login, the user must verify OTP before accessing
 *      protected routes. Navigate to /otp after successful login.
 *    - verifyOTP(userId, otpCode): Call api.verifyOTP(). On success, mark user
 *      as fully authenticated (store tokens, navigate to /dashboard).
 *    - logout(): Call api.logoutUser() with refreshToken, clear all state and
 *      localStorage, navigate to /login.
 *    - refreshAccessToken(): Called automatically when access token expires.
 *      Uses refreshToken to get a new accessToken via api.refreshToken().
 *
 * 3. PERSISTENCE:
 *    - On mount, check localStorage for existing tokens and user data
 *    - If found, restore auth state (set isAuthenticated = true)
 *    - Consider validating the token by calling GET /api/auth/me on mount
 *    - Store tokens in localStorage: "accessToken", "refreshToken", "user"
 *
 * 4. AUTH FLOW:
 *    User logs in → receives tokens → redirected to /otp →
 *    enters OTP code → OTP verified → fully authenticated → /dashboard
 *
 * TODO (Muditha):
 * - Create the AuthContext with React.createContext
 * - Create the AuthProvider component with all state and actions
 * - Export useAuth() custom hook for consuming components
 * - Implement localStorage persistence
 * - Handle token refresh logic (auto-refresh before expiry)
 */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verifyOTP: (userId: string, otpCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!accessToken;

  // TODO (Muditha): On mount, check localStorage for existing session
  useEffect(() => {
    // const storedUser = localStorage.getItem("user");
    // const storedToken = localStorage.getItem("accessToken");
    // if (storedUser && storedToken) {
    //   setUser(JSON.parse(storedUser));
    //   setAccessToken(storedToken);
    // }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // TODO (Muditha): Call api.loginUser({ email, password })
    // Store user + tokens in state and localStorage
    // Navigate to /otp for OTP verification
    throw new Error("TODO: implement login");
  };

  const verifyOTP = async (
    userId: string,
    otpCode: string
  ): Promise<void> => {
    // TODO (Muditha): Call api.verifyOTP({ userId, otpCode })
    // On success, user is fully authenticated
    // Navigate to /dashboard
    throw new Error("TODO: implement verifyOTP");
  };

  const logout = async (): Promise<void> => {
    // TODO (Muditha): Call api.logoutUser() with refreshToken
    // Clear state and localStorage
    // Navigate to /login
    setUser(null);
    setAccessToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
