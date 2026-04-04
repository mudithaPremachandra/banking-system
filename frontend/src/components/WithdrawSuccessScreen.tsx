import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw, CreditCard, Building2, Smartphone, Bitcoin, Clock, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import type { PaymentMethod, WithdrawalStatus, Transaction } from '../types';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/transactionService';

interface WithdrawSuccessScreenProps {
    transaction: Transaction;
    previousBalance: number;
    newBalance: number;
    onWithdrawAgain: () => void;
}

const METHOD_ICONS: Record<PaymentMethod, typeof CreditCard> = {
    card: CreditCard,
    bank_transfer: Building2,
    mobile_wallet: Smartphone,
    crypto: Bitcoin,
};

const STATUS_CONFIG: Record<WithdrawalStatus, { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock },
    processing: { label: 'Processing', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Loader2 },
    completed: { label: 'Completed', color: 'text-banking-green bg-banking-green/10 border-banking-green/20', icon: CheckCircle2 },
    failed: { label: 'Failed / Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
};

function useCountDown(from: number, to: number, duration: number = 1400) {
    const [current, setCurrent] = useState(from);
    useEffect(() => {
        const start = performance.now();
        const frame = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(from + (to - from) * eased);
            if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }, [from, to, duration]);
    return current;
}

export const WithdrawSuccessScreen = ({ transaction, previousBalance, newBalance, onWithdrawAgain }: WithdrawSuccessScreenProps) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<WithdrawalStatus>(transaction.withdrawalStatus || 'pending');
    const [isCancelling, setIsCancelling] = useState(false);
    const animatedBalance = useCountDown(previousBalance, newBalance);
    const Icon = transaction.method ? METHOD_ICONS[transaction.method] : CreditCard;
    const statusCfg = STATUS_CONFIG[status];
    const StatusIcon = statusCfg.icon;

    // Simulate processing → completed transition for card/wallet
    useEffect(() => {
        if (status === 'pending' && transaction.method !== 'bank_transfer') {
            const t = setTimeout(() => setStatus('completed'), 2500);
            return () => clearTimeout(t);
        }
    }, [status, transaction.method]);

    const handleCancel = async () => {
        setIsCancelling(true);
        // TODO: integrate with backend when cancellation API is available
        const cancelled = false;
        if (cancelled) setStatus('failed');
        setIsCancelling(false);
    };

    const now = new Date(transaction.date || transaction.createdAt || Date.now());
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Orange glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl -mt-20 pointer-events-none" />

            {/* Icon */}
            <motion.div
                className="w-20 h-20 bg-orange-500/10 border-2 border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.35, type: 'spring', damping: 10, stiffness: 300 }}>
                    <CheckCircle2 className="w-10 h-10 text-orange-400" />
                </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="text-2xl font-bold mb-1">Withdrawal Initiated!</h2>
                <p className="text-gray-400 text-sm mb-6">Your request has been submitted successfully</p>

                {/* Amount */}
                <div className="text-5xl font-bold text-orange-400 mb-2">
                    -Rs {transaction.amount.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Fee: {(transaction.fee || 0) > 0 ? `-Rs ${transaction.fee?.toFixed(2)}` : 'Free'} · You receive: <span className="text-white font-medium">Rs {(transaction.amount - (transaction.fee || 0)).toFixed(2)}</span>
                </p>

                {/* Status badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-5 ${statusCfg.color}`}>
                    <StatusIcon className={`w-4 h-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
                    {statusCfg.label}
                </div>

                {/* Details */}
                <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-5 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Transaction ID</span>
                        <span className="text-white font-mono text-xs">{transaction.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Date & Time</span>
                        <span className="text-white text-xs">{dateStr} at {timeStr}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-400">Destination</span>
                        <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-white text-xs">{transaction.destination || transaction.paymentLabel}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Estimated Arrival</span>
                        <span className="text-amber-400 text-xs font-medium">{transaction.estimatedArrival}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-sm font-semibold text-white">New Balance</span>
                        <span className="text-orange-400 font-bold">
                            Rs {animatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Cancel option for pending */}
                {status === 'pending' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            Cancel Withdrawal
                        </button>
                    </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button onClick={onWithdrawAgain}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Withdraw Again
                    </button>
                    <button onClick={() => navigate('/transactions')}
                        className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                        View History
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
