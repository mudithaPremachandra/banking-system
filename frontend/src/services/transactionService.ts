import api from './api';
import type { Transaction, TransactionsResponse } from '../types';

// Prisma Decimal fields are serialized as strings in JSON — convert to numbers
function normalizeTransaction(tx: any): Transaction {
    return {
        ...tx,
        amount: Number(tx.amount),
        balanceAfter: Number(tx.balanceAfter),
    };
}

export const transactionService = {
    getRecent: async (): Promise<Transaction[]> => {
        const { data } = await api.get('/accounts/me/transactions', {
            params: { page: 1, limit: 5 },
        });
        return (data.transactions || []).map(normalizeTransaction);
    },

    deposit: async (amount: number, description?: string): Promise<{ transaction: Transaction; newBalance: number }> => {
        const { data } = await api.post('/accounts/me/deposit', { amount, description });
        return { transaction: normalizeTransaction(data.transaction), newBalance: Number(data.newBalance) };
    },

    withdraw: async (amount: number, description?: string): Promise<{ transaction: Transaction; newBalance: number }> => {
        const { data } = await api.post('/accounts/me/withdraw', { amount, description });
        return { transaction: normalizeTransaction(data.transaction), newBalance: Number(data.newBalance) };
    },

    transfer: async (toAccountNumber: string, amount: number, description?: string): Promise<{ transaction: Transaction; newBalance: number }> => {
        const { data } = await api.post('/accounts/me/transfer', { toAccountNumber, amount, description });
        return { transaction: normalizeTransaction(data.transaction), newBalance: Number(data.newBalance) };
    },

    getHistory: async (page = 1, limit = 10): Promise<TransactionsResponse> => {
        const { data } = await api.get('/accounts/me/transactions', {
            params: { page, limit },
        });
        return {
            transactions: (data.transactions || []).map(normalizeTransaction),
            total: data.total || 0,
            page: data.page || page,
            totalPages: Math.ceil((data.total || 0) / limit),
        };
    },
};
