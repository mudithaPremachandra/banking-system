import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        const { data } = await api.post('/auth/login', credentials);
        // Backend wraps in { success, data: { user, accessToken, refreshToken } }
        return data.data || data;
    },

    verifyOTP: async (params: { userId: string; otpCode: string }): Promise<{ verified: boolean }> => {
        const { data } = await api.post('/otp/verify', params);
        return data;
    },

    getMe: async () => {
        const { data } = await api.get('/auth/me');
        return data.data || data;
    },

    logout: async (refreshToken: string): Promise<void> => {
        await api.post('/auth/logout', { refreshToken });
    },
};
