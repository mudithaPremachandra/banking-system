import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { setAuthToken, setRefreshToken, getAuthToken, getRefreshToken, clearTokens } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<{ userId: string; email: string }>;
    verifyOTP: (params: { userId: string; otpCode: string }) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Re-export useAuth hook for convenience
export { useAuth } from '../hooks/useAuth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Restore session on mount if tokens exist
    useEffect(() => {
        const restoreSession = async () => {
            const token = getAuthToken();
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const userData = await authService.getMe();
                setUser(userData);
            } catch {
                // Token invalid or expired — clear everything
                clearTokens();
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = useCallback(async (credentials: { email: string; password: string }) => {
        setLoading(true);
        try {
            const { user: userData, accessToken, refreshToken } = await authService.login(credentials);
            // Store tokens but DON'T set user yet — OTP verification required first
            setAuthToken(accessToken);
            setRefreshToken(refreshToken);
            localStorage.setItem('loginTime', Date.now().toString());
            // Return userId and email so the caller can navigate to OTP page
            return { userId: userData.id, email: userData.email };
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyOTP = useCallback(async (params: { userId: string; otpCode: string }) => {
        setLoading(true);
        try {
            await authService.verifyOTP(params);
            // OTP verified — now fetch and set user
            const userData = await authService.getMe();
            setUser(userData);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        const refresh = getRefreshToken();
        if (refresh) {
            authService.logout(refresh).catch(() => {});
        }
        clearTokens();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
