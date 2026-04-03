import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';

interface WithdrawOTPModalProps {
    isOpen: boolean;
    email: string;
    onVerify: (code: string) => Promise<boolean>;
    onResend: () => Promise<void>;
    onClose: () => void;
}

export const WithdrawOTPModal = ({ isOpen, email, onVerify, onResend, onClose }: WithdrawOTPModalProps) => {
    const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setDigits(Array(6).fill(''));
            setError('');
            setCountdown(60);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown, isOpen]);

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...digits];
        next[index] = value;
        setDigits(next);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) { setDigits(pasted.split('')); inputRefs.current[5]?.focus(); }
    };

    const handleVerify = async () => {
        const code = digits.join('');
        if (code.length < 6) { setError('Please enter the full 6-digit code'); return; }
        setIsVerifying(true);
        setError('');
        const valid = await onVerify(code);
        if (!valid) {
            setError('Invalid OTP. Please check the code and try again.');
            setDigits(Array(6).fill(''));
            inputRefs.current[0]?.focus();
        }
        setIsVerifying(false);
    };

    const handleResend = async () => {
        setIsResending(true);
        setError('');
        await onResend();
        setCountdown(60);
        setDigits(Array(6).fill(''));
        inputRefs.current[0]?.focus();
        setIsResending(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

                    <motion.div
                        className="relative w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    >
                        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-14 h-14 bg-orange-500/15 border border-orange-500/30 rounded-3xl flex items-center justify-center mb-4">
                                <ShieldCheck className="w-7 h-7 text-orange-400" />
                            </div>
                            <h2 className="text-xl font-bold mb-1">Verify Withdrawal</h2>
                            <p className="text-sm text-gray-400 text-center">
                                We sent a 6-digit code to<br />
                                <span className="text-white font-medium">{email}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">(Check your browser console for the code)</p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                            {digits.map((d, i) => (
                                <input key={i}
                                    ref={el => { inputRefs.current[i] = el; }}
                                    type="text" inputMode="numeric" maxLength={1} value={d}
                                    onChange={e => handleDigitChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    className={`w-11 h-14 text-center text-xl font-bold bg-white/5 border rounded-xl text-white outline-none transition-all font-mono
                                        ${d ? 'border-orange-500/60 bg-orange-500/5' : 'border-white/10'}
                                        focus:border-orange-500/80 focus:bg-white/10`}
                                />
                            ))}
                        </div>

                        <div className="text-center mb-6">
                            {countdown > 0 ? (
                                <p className="text-sm text-gray-500">Resend code in <span className="text-orange-400 font-medium">{countdown}s</span></p>
                            ) : (
                                <button onClick={handleResend} disabled={isResending}
                                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 mx-auto disabled:opacity-50">
                                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <button onClick={handleVerify}
                            disabled={isVerifying || digits.join('').length < 6}
                            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed">
                            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Withdraw'}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
