import type { AccountBalance } from '../types';

export let mockBalance = 15250.75;

export const updateBalance = (delta: number) => {
    mockBalance += delta;
};

// In-memory OTP store (simulated — replace with Nodemailer API call in production)
let _pendingOTP: string | null = null;

export const accountService = {
    getBalance: async () => {
        return new Promise<AccountBalance>((resolve) => {
            setTimeout(() => resolve({ balance: mockBalance, currency: 'USD' }), 400);
        });
    },

    /**
     * Simulates sending an OTP to the user's email.
     * In production: POST /api/otp/send  { email }  (Nodemailer on backend)
     */
    sendDepositOTP: async (email: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                _pendingOTP = String(Math.floor(100000 + Math.random() * 900000));
                // ── REPLACE WITH REAL API CALL ──────────────────────────────────────
                // await api.post('/otp/send', { email, otp: _pendingOTP });
                // ────────────────────────────────────────────────────────────────────
                console.info(`[OTP] Code for ${email}: ${_pendingOTP}`);
                resolve();
            }, 600);
        });
    },

    /**
     * Verifies the OTP entered by the user.
     * In production: POST /api/otp/verify  { email, code }
     */
    verifyDepositOTP: async (code: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const valid = code === _pendingOTP;
                if (valid) _pendingOTP = null;
                resolve(valid);
            }, 400);
        });
    },

    // Reuse same OTP service for withdrawals
    sendWithdrawOTP: async (email: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                _pendingOTP = String(Math.floor(100000 + Math.random() * 900000));
                console.info(`[OTP - Withdraw] Code for ${email}: ${_pendingOTP}`);
                resolve();
            }, 600);
        });
    },

    verifyWithdrawOTP: async (code: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const valid = code === _pendingOTP;
                if (valid) _pendingOTP = null;
                resolve(valid);
            }, 400);
        });
    },
};
