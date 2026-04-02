import type { Transaction, TransactionsResponse, PaymentMethod, WithdrawalStatus } from '../types';
import { updateBalance, mockBalance } from './accountService';

const mockTransactions: Transaction[] = [
    { id: 'tx_8f7d9a1b', type: 'DEPOSIT', amount: 5000, fee: 0, method: 'bank_transfer', paymentLabel: 'Bank Transfer', date: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date(Date.now() - 86400000).toISOString(), balanceAfter: 25000, description: 'Monthly salary deposit' },
    { id: 'tx_2c3a4b5d', type: 'WITHDRAW', amount: 350.50, fee: 5, method: 'bank_transfer', paymentLabel: 'HNB ••••1234', withdrawalStatus: 'completed', destination: 'HNB ••••1234', date: new Date(Date.now() - 172800000).toISOString(), createdAt: new Date(Date.now() - 172800000).toISOString(), balanceAfter: 20000, description: 'Withdrawal to HNB' },
    { id: 'tx_9e8d7c6b', type: 'DEPOSIT', amount: 1200, fee: 30, method: 'card', paymentLabel: 'Visa ••••4242', date: new Date(Date.now() - 432000000).toISOString(), createdAt: new Date(Date.now() - 432000000).toISOString(), balanceAfter: 20355.50, description: 'Top-up via Visa card' },
    { id: 'tx_1a2b3c4d', type: 'WITHDRAW', amount: 50, fee: 0, method: 'mobile_wallet', paymentLabel: 'Google Pay', withdrawalStatus: 'completed', destination: 'Google Pay', date: new Date(Date.now() - 604800000).toISOString(), createdAt: new Date(Date.now() - 604800000).toISOString(), balanceAfter: 19155.50, description: 'Mobile wallet transfer' },
];

// Simulated saved accounts for the "saved destinations" feature
// Made it a let so we can easily mutate/reassign or just use push
export const savedAccounts: {
    id: string;
    method: PaymentMethod;
    label: string;
    details: Record<string, string>;
}[] = [
    { id: 'acc_1', method: 'bank_transfer', label: 'HNB ••••1234', details: { accountNumber: '12345678901234', bankName: 'Hatton National Bank', branch: 'Colombo Main' } },
    { id: 'acc_2', method: 'card', label: 'Visa ••••4242', details: { lastFour: '4242' } },
];

export const transactionService = {
    getRecent: async () => {
        return new Promise<Transaction[]>((resolve) => {
            setTimeout(() => resolve(mockTransactions.slice(0, 5)), 500);
        });
    },

    deposit: async (data: { amount: number; fee: number; method: PaymentMethod; paymentLabel: string }) => {
        return new Promise<{ success: boolean; transaction: Transaction }>((resolve) => {
            setTimeout(() => {
                const newTx: Transaction = {
                    id: `tx_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'DEPOSIT',
                    amount: data.amount,
                    fee: data.fee,
                    method: data.method,
                    paymentLabel: data.paymentLabel,
                    date: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    balanceAfter: mockBalance + data.amount - data.fee,
                    description: `Deposit via ${data.paymentLabel}`,
                };
                mockTransactions.unshift(newTx);
                updateBalance(data.amount);
                resolve({ success: true, transaction: newTx });
            }, 1200);
        });
    },

    withdraw: async (data: { amount: number; fee: number; method: PaymentMethod; paymentLabel: string; destination: string }) => {
        return new Promise<{ success: boolean; transaction: Transaction }>((resolve, reject) => {
            setTimeout(() => {
                // Check sufficient balance (uses module-level mockBalance)
                if (data.amount + data.fee > mockBalance) {
                    reject(new Error('Insufficient balance'));
                    return;
                }

                const estimatedArrival = data.method === 'bank_transfer'
                    ? '1–3 business days'
                    : data.method === 'crypto'
                        ? '10–30 minutes'
                        : 'Instant';

                const initialStatus: WithdrawalStatus = data.method === 'bank_transfer' ? 'pending' : 'completed';

                const newTx: Transaction = {
                    id: `tx_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'WITHDRAW',
                    amount: data.amount,
                    fee: data.fee,
                    method: data.method,
                    paymentLabel: data.paymentLabel,
                    withdrawalStatus: initialStatus,
                    estimatedArrival,
                    destination: data.destination,
                    date: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    balanceAfter: mockBalance - data.amount - data.fee,
                    description: `Withdrawal to ${data.destination}`,
                };
                mockTransactions.unshift(newTx);
                updateBalance(-(data.amount + data.fee));
                resolve({ success: true, transaction: newTx });
            }, 1500);
        });
    },

    saveAccount: (method: PaymentMethod, label: string, details: Record<string, string>) => {
        const id = `acc_${Math.random().toString(36).substr(2, 9)}`;
        savedAccounts.push({ id, method, label, details });
    },

    deleteAccount: (id: string) => {
        const index = savedAccounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
            savedAccounts.splice(index, 1);
        }
    },

    cancelWithdrawal: async (txId: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const tx = mockTransactions.find(t => t.id === txId);
                if (tx && tx.withdrawalStatus === 'pending') {
                    tx.withdrawalStatus = 'failed';
                    // Refund the amount + fee
                    updateBalance((tx.amount || 0) + (tx.fee || 0));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 600);
        });
    },

    getHistory: async (page = 1) => {
        return new Promise<TransactionsResponse>((resolve) => {
            setTimeout(() => {
                const limit = 10;
                const start = (page - 1) * limit;
                const paginated = mockTransactions.slice(start, start + limit);
                resolve({
                    transactions: paginated,
                    total: mockTransactions.length,
                    page,
                    totalPages: Math.ceil(mockTransactions.length / limit),
                });
            }, 500);
        });
    },
};
