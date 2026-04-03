import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { BalanceCard } from '../components/BalanceCard';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../hooks/useAuth';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Step = 'form' | 'otp' | 'processing' | 'success';

export const TransferPage = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [step, setStep] = useState<Step>('form');
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState<{ newBalance: number } | null>(null);

    const fetchBalance = async () => {
        try {
            const data = await accountService.getBalance();
            setBalance(data.balance);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const numAmount = parseFloat(amount) || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!toAccountNumber.trim()) {
            setError('Recipient account number is required');
            return;
        }
        if (numAmount <= 0) {
            setError('Amount must be greater than zero');
            return;
        }
        if (numAmount > balance) {
            setError('Insufficient balance');
            return;
        }

        // Send OTP for verification
        try {
            if (user?.id && user?.email) {
                await accountService.sendOTP(user.id, user.email);
            }
            setStep('otp');
        } catch {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user?.id) return;

        const valid = await accountService.verifyOTP(user.id, otpCode);
        if (!valid) {
            setError('Invalid OTP code. Please try again.');
            return;
        }

        setStep('processing');
        try {
            const res = await transactionService.transfer(
                toAccountNumber.trim(),
                numAmount,
                description || undefined
            );
            setResult(res);
            setStep('success');
            fetchBalance();
        } catch (err: any) {
            const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Transfer failed';
            setError(msg);
            setStep('form');
        }
    };

    const handleReset = () => {
        setStep('form');
        setToAccountNumber('');
        setAmount('');
        setDescription('');
        setOtpCode('');
        setError('');
        setResult(null);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-2xl font-bold tracking-tight">Transfer</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Transfer Form */}
                    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/8 rounded-full blur-3xl -mt-10 -mr-10 pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <Send className="w-6 h-6 text-purple-400" />
                            <h2 className="text-xl font-semibold">Send Funds</h2>
                        </div>

                        {error && (
                            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {step === 'form' && (
                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Recipient Account Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ACC1234567890"
                                        value={toAccountNumber}
                                        onChange={e => setToAccountNumber(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all font-mono text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount (LKR)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">Rs</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={e => setAmount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-xl font-medium placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5">Available: LKR {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Description (optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Rent payment"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all text-sm"
                                    />
                                </div>

                                {numAmount > 0 && (
                                    <div className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-2.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Transfer Amount</span>
                                            <span className="text-white">LKR {numAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Fee</span>
                                            <span className="text-green-400 text-xs font-medium">FREE</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-2.5 flex justify-between">
                                            <span className="font-semibold text-sm text-white">Total</span>
                                            <span className="font-bold text-purple-400">LKR {numAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-purple-500 hover:bg-purple-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                                >
                                    <Send className="w-4 h-4" /> Send Money
                                </button>
                            </form>
                        )}

                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-5 relative z-10">
                                <p className="text-sm text-gray-400 text-center">
                                    We've sent a 6-digit code to <span className="text-white font-medium">{user?.email}</span>
                                </p>
                                <div>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={otpCode}
                                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-3xl tracking-[1em] text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-mono"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={otpCode.length !== 6}
                                    className="w-full bg-purple-500 hover:bg-purple-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-40"
                                >
                                    Verify & Transfer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep('form'); setOtpCode(''); setError(''); }}
                                    className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
                                >
                                    Back
                                </button>
                            </form>
                        )}

                        {step === 'processing' && (
                            <div className="flex flex-col items-center justify-center gap-5 min-h-[200px] relative z-10">
                                <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                                <p className="text-lg font-semibold">Processing transfer...</p>
                                <p className="text-sm text-gray-400">Please do not close this window</p>
                            </div>
                        )}

                        {step === 'success' && result && (
                            <div className="flex flex-col items-center justify-center gap-5 min-h-[200px] relative z-10">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-white">Transfer Successful</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        LKR {numAmount.toFixed(2)} sent to {toAccountNumber}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        New balance: LKR {result.newBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-all"
                                >
                                    Make Another Transfer
                                </button>
                            </div>
                        )}
                    </div>

                    <BalanceCard balance={balance} currency="LKR" showQuickActions={false} />
                </div>
            </div>
        </DashboardLayout>
    );
};
