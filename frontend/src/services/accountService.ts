import api from './api';
import type { AccountBalance } from '../types';

export const accountService = {
    getBalance: async (): Promise<AccountBalance> => {
        const { data } = await api.get('/accounts/me/balance');
        return data;
    },

    getAccount: async () => {
        const { data } = await api.get('/accounts/me');
        return data.account;
    },

    sendOTP: async (userId: string, email: string): Promise<void> => {
        await api.post('/otp/send', { userId, email });
    },

    verifyOTP: async (userId: string, otpCode: string): Promise<boolean> => {
        try {
            const { data } = await api.post('/otp/verify', { userId, otpCode });
            return data.verified === true;
        } catch {
            return false;
        }
    },
};
