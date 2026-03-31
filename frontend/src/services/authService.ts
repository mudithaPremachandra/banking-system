// api removed
import type { AuthResponse } from '../types';

export const authService = {
    login: async (credentials: any) => {
        // Mock login
        return new Promise<AuthResponse>((resolve) => {
            setTimeout(() => resolve({
                token: 'mock-jwt-token-12345',
                user: { id: 'usr_1', email: credentials.email }
            }), 800);
        });
    },
    register: async (data: any) => {
        // Mock register
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
    },
    verifyOTP: async (data: { code: string; email?: string }) => {
        // Mock OTP verification
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.code === '123456') {
                    resolve({ success: true });
                } else {
                    reject({ response: { data: { message: 'Invalid OTP. Use 123456 for testing.' } } });
                }
            }, 800);
        });
    }
};
