import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { setAuthToken } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    verifyOTP: (data: any) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // In-memory token storage means we don't restore session on reload.
        // If we wanted to, we'd add an endpoint to fetch current user based on cookie/session
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        setLoading(true);
        try {
            const { token, user } = await authService.login(credentials);
            setAuthToken(token);
            setUser(user);
            // Store login timestamp for session tracking (as milliseconds since epoch)
            localStorage.setItem('loginTime', Date.now().toString());
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: any) => {
        setLoading(true);
        try {
            await authService.register(data);
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (data: any) => {
        setLoading(true);
        try {
            await authService.verifyOTP(data);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        // Clear session tracking data
        localStorage.removeItem('loginTime');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );

};
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};