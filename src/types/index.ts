export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AccountBalance {
    balance: number;
    currency: string;
    accountType?: string;
    accountNumber?: string;
}

export type PaymentMethod = 'bank_transfer' | 'card' | 'mobile_wallet' | 'crypto';

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SavedAccount {
    id: string;
    method: PaymentMethod;
    label: string;       // e.g. "HNB ****1234"
    details: Record<string, string>;
}

export interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW';
    amount: number;
    date: string;
    createdAt: string;       // Add this
    balanceAfter: number;    // Add this
    description: string;     // Add this
    method?: PaymentMethod;
    fee?: number;
    paymentLabel?: string;
    // Withdrawal-specific
    withdrawalStatus?: WithdrawalStatus;
    estimatedArrival?: string;
    destination?: string;
}

export interface TransactionsResponse {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
}

export type NotificationType = 'TRANSACTION' | 'LOW_BALANCE' | 'SUCCESS' | 'WARNING';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    data?: {
        transactionId?: string;
        amount?: number;
        balance?: number;
    };
}
