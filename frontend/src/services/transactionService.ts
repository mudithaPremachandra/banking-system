import api from './api';
import type { Transaction, TransactionsResponse } from '../types';

export const transactionService = {
    getRecent: async (): Promise<Transaction[]> => {
        const { data } = await api.get('/accounts/me/transactions', {
            params: { page: 1, limit: 5 },
        });
        return data.transactions || [];
    },

    deposit: async (amount: number, description?: string): Promise<{ transaction: Transaction; newBalance: number }> => {
        const { data } = await api.post('/accounts/me/deposit', { amount, description });
        return data;
    },

    withdraw: async (amount: number, description?: string): Promise<{ transaction: Transaction; newBalance: number }> => {
        const { data } = await api.post('/accounts/me/withdraw', { amount, description });
        return data;
    },

    transfer: async (toAccountNumber: string, amount: number, description?: string): Promise<{ transaction: Transaction; newBalance: number }> => {
        const { data } = await api.post('/accounts/me/transfer', { toAccountNumber, amount, description });
        return data;
    },

    getHistory: async (page = 1, limit = 10): Promise<TransactionsResponse> => {
        const { data } = await api.get('/accounts/me/transactions', {
            params: { page, limit },
        });
        return {
            transactions: data.transactions || [],
            total: data.total || 0,
            page: data.page || page,
            totalPages: Math.ceil((data.total || 0) / limit),
        };
    },
};
