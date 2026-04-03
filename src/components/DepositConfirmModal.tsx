import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Building2, Smartphone, Bitcoin, ShieldAlert } from 'lucide-react';
import type { PaymentMethod } from '../types';

interface DepositConfirmModalProps {
    isOpen: boolean;
    amount: number;
    fee: number;
    method: PaymentMethod;
    paymentLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const METHOD_ICONS: Record<PaymentMethod, typeof CreditCard> = {
    card: CreditCard,
    bank_transfer: Building2,
    mobile_wallet: Smartphone,
    crypto: Bitcoin,
};

const METHOD_LABELS: Record<PaymentMethod, string> = {
    card: 'Credit / Debit Card',
    bank_transfer: 'Bank Transfer',
    mobile_wallet: 'Mobile Wallet',
    crypto: 'Cryptocurrency',
};

export const DepositConfirmModal = ({
    isOpen,
    amount,
    fee,
    method,
    paymentLabel,
    onConfirm,
    onCancel,
}: DepositConfirmModalProps) => {
    const total = amount + fee;
    const Icon = METHOD_ICONS[method];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onCancel}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    >
                        <button
                            onClick={onCancel}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-banking-green/20 border border-banking-green/30 flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-banking-green" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Confirm Deposit</h2>
                                <p className="text-xs text-gray-400">Please review before confirming</p>
                            </div>
                        </div>

                        {/* Payment Method Badge */}
                        <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-white/5 border border-white/8">
                            <Icon className="w-4 h-4 text-banking-green" />
                            <span className="text-sm text-gray-300">{METHOD_LABELS[method]}</span>
                            <span className="ml-auto text-sm font-medium text-white">{paymentLabel}</span>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Deposit Amount</span>
                                <span className="text-white font-medium">${amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Processing Fee</span>
                                <span className={fee > 0 ? 'text-amber-400 font-medium' : 'text-gray-300'}>{fee > 0 ? `$${fee.toFixed(2)}` : 'Free'}</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="font-semibold text-white">Total Charged</span>
                                <span className="font-bold text-banking-green text-lg">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mb-5 text-center">
                            After confirming, you'll receive an OTP to verify this transaction.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-3 rounded-xl bg-banking-green hover:bg-banking-light text-background font-semibold transition-all text-sm shadow-lg shadow-banking-green/20"
                            >
                                Confirm & Get OTP
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
