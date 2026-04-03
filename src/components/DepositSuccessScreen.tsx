import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw, CreditCard, Building2, Smartphone, Bitcoin } from 'lucide-react';
import type { PaymentMethod } from '../types';
import { useNavigate } from 'react-router-dom';

interface DepositSuccessScreenProps {
    transactionId: string;
    amount: number;
    fee: number;
    method: PaymentMethod;
    paymentLabel: string;
    previousBalance: number;
    newBalance: number;
    onDepositAgain: () => void;
}

const METHOD_ICONS: Record<PaymentMethod, typeof CreditCard> = {
    card: CreditCard,
    bank_transfer: Building2,
    mobile_wallet: Smartphone,
    crypto: Bitcoin,
};

function useCountUp(target: number, duration: number = 1400) {
    const [current, setCurrent] = useState(target - 0); // start close to avoid large jumps
    useEffect(() => {
        const start = performance.now();
        const from = target - Math.abs(target * 0.12); // animate from ~88% of final value
        const frame = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            setCurrent(from + (target - from) * eased);
            if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }, [target, duration]);
    return current;
}

export const DepositSuccessScreen = ({
    transactionId,
    amount,
    fee,
    method,
    paymentLabel,
    newBalance,
    onDepositAgain,
}: DepositSuccessScreenProps) => {
    const navigate = useNavigate();
    const animatedBalance = useCountUp(newBalance);
    const Icon = METHOD_ICONS[method];

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-banking-green/10 rounded-full blur-3xl -mt-20 pointer-events-none" />

            {/* Animated checkmark */}
            <motion.div
                className="w-20 h-20 bg-banking-green/15 border-2 border-banking-green/40 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.35, type: 'spring', damping: 10, stiffness: 300 }}
                >
                    <CheckCircle2 className="w-10 h-10 text-banking-green" />
                </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="text-2xl font-bold mb-1">Deposit Successful!</h2>
                <p className="text-gray-400 text-sm mb-6">Your funds have been added to your account</p>

                {/* Amount */}
                <div className="text-5xl font-bold text-banking-green mb-6">
                    +${amount.toFixed(2)}
                </div>

                {/* Details card */}
                <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-6 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Transaction ID</span>
                        <span className="text-white font-mono text-xs">{transactionId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Date & Time</span>
                        <span className="text-white text-xs">{dateStr} at {timeStr}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-400">Payment Method</span>
                        <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-banking-green" />
                            <span className="text-white text-xs">{paymentLabel}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Processing Fee</span>
                        <span className={fee > 0 ? 'text-amber-400 text-xs' : 'text-gray-300 text-xs'}>{fee > 0 ? `$${fee.toFixed(2)}` : 'Free'}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-sm font-semibold text-white">New Balance</span>
                        <span className="text-banking-green font-bold">
                            ${animatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onDepositAgain}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Deposit Again
                    </button>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="flex-1 py-3 rounded-xl bg-banking-green hover:bg-banking-light text-background font-semibold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-banking-green/20"
                    >
                        View History
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
