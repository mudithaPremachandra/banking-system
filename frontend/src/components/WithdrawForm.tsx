import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpCircle, CreditCard, Building2, Smartphone, Bitcoin,
    AlertCircle, ChevronRight, ChevronLeft, Lock, Star
} from 'lucide-react';
import type { PaymentMethod, Transaction } from '../types';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { WithdrawConfirmModal } from './WithdrawConfirmModal';
import { WithdrawOTPModal } from './WithdrawOTPModal';
import { WithdrawSuccessScreen } from './WithdrawSuccessScreen';
import { useAuth } from '../hooks/useAuth';

interface WithdrawFormProps {
    onSuccess: () => void;
    currentBalance: number;
}

type Step = 'method' | 'details' | 'amount' | 'processing' | 'success';

interface WithdrawMethodConfig {
    id: PaymentMethod;
    label: string;
    icon: typeof CreditCard;
    description: string;
    feeFlat: number;     // flat fee per withdrawal
    instant: boolean;
}

const WITHDRAW_METHODS: WithdrawMethodConfig[] = [
    { id: 'bank_transfer', label: 'Bank Account', icon: Building2, description: 'Direct to your bank (1–3 days)', feeFlat: 5, instant: false },
    { id: 'card', label: 'Debit Card', icon: CreditCard, description: 'To your card — instant', feeFlat: 0, instant: true },
    { id: 'mobile_wallet', label: 'Mobile Wallet', icon: Smartphone, description: 'Apple Pay / Google Pay', feeFlat: 0, instant: true },
    { id: 'crypto', label: 'Crypto Wallet', icon: Bitcoin, description: 'BTC, ETH, USDT (10–30 min)', feeFlat: 2, instant: false },
];

const MIN_AMOUNT = 20;
const MAX_AMOUNT = 5000; // daily limit

function buildDestination(method: PaymentMethod, details: Record<string, string>): string {
    switch (method) {
        case 'bank_transfer': return details.accountNumber ? `••••${details.accountNumber.slice(-4)} · ${details.bankName || 'Bank'}` : 'Bank Account';
        case 'card': return details.cardNumber ? `Visa •••• ${details.cardNumber.replace(/\s/g, '').slice(-4)}` : details.savedLabel || 'Debit Card';
        case 'mobile_wallet': return details.walletType || 'Mobile Wallet';
        case 'crypto': return details.walletAddress ? `${details.walletAddress.slice(0, 6)}...${details.walletAddress.slice(-4)}` : 'Wallet';
        default: return method;
    }
}

const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

// Saved accounts feature — placeholder for future backend integration
const savedAccounts: { id: string; method: PaymentMethod; label: string; details: Record<string, string> }[] = [];

export const WithdrawForm = ({ onSuccess, currentBalance }: WithdrawFormProps) => {
    const { user } = useAuth();
    const [step, setStep] = useState<Step>('method');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<Record<string, string>>({});
    const [saveAccount, setSaveAccount] = useState(false);
    const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [successData, setSuccessData] = useState<{ transaction: Transaction; prevBalance: number; newBalance: number } | null>(null);

    const methodConfig = WITHDRAW_METHODS.find(m => m.id === selectedMethod);
    const numAmount = parseFloat(amount) || 0;
    const fee = methodConfig ? methodConfig.feeFlat : 0;
    const youReceive = numAmount - fee;

    // Quick amount percentages
    const quickPercentages = [
        { label: '25%', value: parseFloat((currentBalance * 0.25).toFixed(2)) },
        { label: '50%', value: parseFloat((currentBalance * 0.5).toFixed(2)) },
        { label: '75%', value: parseFloat((currentBalance * 0.75).toFixed(2)) },
        { label: 'Max', value: Math.min(currentBalance, MAX_AMOUNT) },
    ];

    const handleSelectMethod = (m: PaymentMethod) => {
        setSelectedMethod(m);
        setPaymentDetails({});
        setDetailErrors({});
    };

    const handleUseSavedAccount = (acc: typeof savedAccounts[0]) => {
        setSelectedMethod(acc.method);
        // Filter out undefined values to satisfy Record<string, string>
        const cleanDetails: Record<string, string> = Object.fromEntries(
            Object.entries({ ...acc.details, savedLabel: acc.label }).filter(([, v]) => v !== undefined)
        ) as Record<string, string>;
        setPaymentDetails(cleanDetails);
        setStep('amount');
    };

    const validateDetails = (): boolean => {
        const errs: Record<string, string> = {};
        if (!selectedMethod) return false;
        if (selectedMethod === 'bank_transfer') {
            if (!paymentDetails.accountNumber || paymentDetails.accountNumber.length < 8)
                errs.accountNumber = 'Enter a valid account number (min 8 digits)';
            if (!paymentDetails.bankName)
                errs.bankName = 'Enter your bank name';
        } else if (selectedMethod === 'card') {
            if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16)
                errs.cardNumber = 'Enter a valid 16-digit card number';
        } else if (selectedMethod === 'mobile_wallet') {
            if (!paymentDetails.walletType)
                errs.walletType = 'Please select a wallet type';
        } else if (selectedMethod === 'crypto') {
            if (!paymentDetails.walletAddress || paymentDetails.walletAddress.length < 10)
                errs.walletAddress = 'Enter a valid wallet address';
        }
        setDetailErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateAmount = (): boolean => {
        if (!amount || numAmount <= 0) { setAmountError('Please enter an amount'); return false; }
        if (numAmount < MIN_AMOUNT) { setAmountError(`Minimum withdrawal is Rs ${MIN_AMOUNT}`); return false; }
        if (numAmount > MAX_AMOUNT) { setAmountError(`Daily limit is Rs ${MAX_AMOUNT.toLocaleString()}`); return false; }
        if (numAmount + fee > currentBalance) { setAmountError('Insufficient balance for this withdrawal + fee'); return false; }
        setAmountError('');
        return true;
    };

    const handleWithdrawClick = () => {
        if (!validateAmount()) return;
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        if (user?.id && user?.email) {
            await accountService.sendOTP(user.id, user.email);
        }
        setShowOTP(true);
    };

    const handleVerifyOTP = async (code: string): Promise<boolean> => {
        if (!user?.id) return false;
        const valid = await accountService.verifyOTP(user.id, code);
        if (valid) {
            setShowOTP(false);
            await processWithdrawal();
        }
        return valid;
    };

    const handleResendOTP = async () => {
        if (user?.id && user?.email) {
            await accountService.sendOTP(user.id, user.email);
        }
    };

    const processWithdrawal = useCallback(async () => {
        setStep('processing');
        try {
            const balanceBefore = await accountService.getBalance();
            const prevBal = balanceBefore.balance;

            const destLabel = buildDestination(selectedMethod!, paymentDetails);
            const result = await transactionService.withdraw(numAmount, `Withdrawal to ${destLabel}`);

            onSuccess();
            // Enrich API transaction with frontend-only fields the success screen needs
            const enrichedTransaction: Transaction = {
                ...result.transaction,
                date: result.transaction.date || result.transaction.createdAt || new Date().toISOString(),
                method: selectedMethod!,
                fee: fee,
                destination: destLabel,
                withdrawalStatus: methodConfig?.instant ? 'completed' : 'pending',
                estimatedArrival: methodConfig?.instant ? 'Instant' : '1–3 business days',
            };
            setSuccessData({ transaction: enrichedTransaction, prevBalance: prevBal, newBalance: result.newBalance });
            setStep('success');
        } catch (err) {
            console.error('Withdrawal failed', err);
            setStep('amount');
        }
    }, [numAmount, selectedMethod, paymentDetails, onSuccess]);

    const handleReset = () => {
        setStep('method');
        setSelectedMethod(null);
        setPaymentDetails({});
        setAmount('');
        setAmountError('');
        setSuccessData(null);
        setSaveAccount(false);
    };

    // ── Success ───────────────────────────────────────────────────────────────
    if (step === 'success' && successData) {
        return (
            <WithdrawSuccessScreen
                transaction={successData.transaction}
                previousBalance={successData.prevBalance}
                newBalance={successData.newBalance}
                onWithdrawAgain={handleReset}
            />
        );
    }

    // ── Processing ────────────────────────────────────────────────────────────
    if (step === 'processing') {
        return (
            <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center gap-5 min-h-[360px]">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full bg-orange-500/5 blur-xl" />
                </div>
                <p className="text-lg font-semibold">Processing withdrawal...</p>
                <p className="text-sm text-gray-400">Please do not close this window</p>
                {methodConfig && !methodConfig.instant && (
                    <p className="text-xs text-amber-400/80 text-center max-w-xs">
                        💡 Bank transfers may take 1–3 business days to complete
                    </p>
                )}
            </div>
        );
    }

    const stepIndex = { method: 0, details: 1, amount: 2 }[step as 'method' | 'details' | 'amount'] ?? 0;

    return (
        <>
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                {/* Orange glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/8 rounded-full blur-3xl -mt-10 -mr-10 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <ArrowUpCircle className="w-6 h-6 text-orange-400" />
                    <h2 className="text-xl font-semibold">Withdraw Funds</h2>
                    <div className="ml-auto flex items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                            <div key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === stepIndex ? 'w-6 bg-orange-500' : i < stepIndex ? 'w-3 bg-orange-500/50' : 'w-3 bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Step label */}
                <p className="text-xs text-gray-500 mb-5 relative z-10">
                    Step {stepIndex + 1} of 3 —{' '}
                    <span className="text-gray-300">
                        {step === 'method' ? 'Choose withdrawal method' : step === 'details' ? 'Enter destination details' : 'Enter amount'}
                    </span>
                </p>

                <AnimatePresence mode="wait">
                    {/* ── STEP 1: METHOD ─────────────────────────────────────────────── */}
                    {step === 'method' && (
                        <motion.div key="method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">

                            {/* Saved accounts */}
                            {savedAccounts.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                                        <Star className="w-3 h-3 text-amber-400" /> Saved Accounts
                                    </p>
                                    <div className="space-y-2">
                                        {savedAccounts.map(acc => {
                                            const Ic = acc.method === 'bank_transfer' ? Building2 : CreditCard;
                                            return (
                                                <button key={acc.id} onClick={() => handleUseSavedAccount(acc)}
                                                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/8 bg-white/3 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all text-left">
                                                    <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                                                        <Ic className="w-4 h-4 text-gray-300" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{acc.label}</p>
                                                        <p className="text-xs text-gray-500">Tap to use</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 mb-2">
                                        <div className="flex-1 h-px bg-white/8" />
                                        <span className="text-xs text-gray-500">or add new</span>
                                        <div className="flex-1 h-px bg-white/8" />
                                    </div>
                                </div>
                            )}

                            {/* Method cards */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {WITHDRAW_METHODS.map(m => {
                                    const Icon = m.icon;
                                    const selected = selectedMethod === m.id;
                                    return (
                                        <button key={m.id} onClick={() => handleSelectMethod(m.id)}
                                            className={`p-4 rounded-2xl border text-left transition-all duration-200 group
                                                ${selected
                                                    ? 'border-orange-500/60 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                                                    : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors
                                                ${selected ? 'bg-orange-500/20' : 'bg-white/8 group-hover:bg-white/12'}`}>
                                                <Icon className={`w-4.5 h-4.5 ${selected ? 'text-orange-400' : 'text-gray-300'}`} />
                                            </div>
                                            <p className={`text-sm font-semibold leading-tight mb-0.5 ${selected ? 'text-white' : 'text-gray-200'}`}>{m.label}</p>
                                            <p className="text-xs text-gray-500">{m.description}</p>
                                            <p className={`text-xs mt-1.5 font-medium ${selected ? 'text-orange-400' : 'text-gray-500'}`}>
                                                {m.feeFlat === 0 ? 'No fee' : `Rs ${m.feeFlat} fee`}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            <button disabled={!selectedMethod} onClick={() => setStep('details')}
                                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                                Continue <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* ── STEP 2: DETAILS ─────────────────────────────────────────────── */}
                    {step === 'details' && selectedMethod && (
                        <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10 space-y-4">

                            {selectedMethod === 'bank_transfer' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Account Number</label>
                                        <input type="text" placeholder="e.g. 12345678901"
                                            value={paymentDetails.accountNumber || ''}
                                            onChange={e => setPaymentDetails(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '') }))}
                                            className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all font-mono text-sm ${detailErrors.accountNumber ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/50'}`}
                                        />
                                        {detailErrors.accountNumber && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.accountNumber}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Bank Name</label>
                                        <input type="text" placeholder="e.g. Hatton National Bank"
                                            value={paymentDetails.bankName || ''}
                                            onChange={e => setPaymentDetails(p => ({ ...p, bankName: e.target.value }))}
                                            className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all text-sm ${detailErrors.bankName ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/50'}`}
                                        />
                                        {detailErrors.bankName && <p className="text-red-400 text-xs mt-1">{detailErrors.bankName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Branch (optional)</label>
                                        <input type="text" placeholder="e.g. Colombo Main"
                                            value={paymentDetails.branch || ''}
                                            onChange={e => setPaymentDetails(p => ({ ...p, branch: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {selectedMethod === 'card' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000"
                                        value={paymentDetails.cardNumber || ''}
                                        onChange={e => setPaymentDetails(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                                        className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all font-mono tracking-wider text-sm ${detailErrors.cardNumber ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/50'}`}
                                    />
                                    {detailErrors.cardNumber && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.cardNumber}</p>}
                                </div>
                            )}

                            {selectedMethod === 'mobile_wallet' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">Select Wallet</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Apple Pay', 'Google Pay'].map(w => (
                                            <button key={w}
                                                onClick={() => setPaymentDetails(p => ({ ...p, walletType: w }))}
                                                className={`p-4 rounded-xl border text-sm font-medium transition-all
                                                    ${paymentDetails.walletType === w
                                                        ? 'border-orange-500/60 bg-orange-500/10 text-white'
                                                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25'}`}
                                            >
                                                {w}
                                            </button>
                                        ))}
                                    </div>
                                    {detailErrors.walletType && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.walletType}</p>}
                                </div>
                            )}

                            {selectedMethod === 'crypto' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Wallet Address</label>
                                    <input type="text" placeholder="0x... or bc1..."
                                        value={paymentDetails.walletAddress || ''}
                                        onChange={e => setPaymentDetails(p => ({ ...p, walletAddress: e.target.value }))}
                                        className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all font-mono text-xs ${detailErrors.walletAddress ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/50'}`}
                                    />
                                    {detailErrors.walletAddress && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.walletAddress}</p>}
                                </div>
                            )}

                            {/* Save for later */}
                            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl hover:bg-white/3 transition-colors">
                                <input type="checkbox" checked={saveAccount} onChange={e => setSaveAccount(e.target.checked)}
                                    className="w-4 h-4 rounded accent-orange-500" />
                                <span className="text-sm text-gray-300">Save this account for future withdrawals</span>
                            </label>

                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setStep('method')}
                                    className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <button onClick={() => { if (validateDetails()) setStep('amount'); }}
                                    className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 text-sm">
                                    Continue <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: AMOUNT ─────────────────────────────────────────────── */}
                    {step === 'amount' && (
                        <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10 space-y-5">

                            {/* Available balance hint */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/3 border border-white/8">
                                <span className="text-xs text-gray-400">Available Balance</span>
                                <span className="text-sm font-bold text-white">Rs {currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>

                            {/* Quick % buttons */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Quick Select</label>
                                <div className="flex gap-2">
                                    {quickPercentages.map(q => (
                                        <button key={q.label}
                                            onClick={() => { setAmount(String(q.value)); setAmountError(''); }}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                                                ${parseFloat(amount) === q.value
                                                    ? 'border-orange-500/60 bg-orange-500/10 text-orange-400'
                                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25 hover:text-white'}`}
                                        >
                                            {q.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount (LKR)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">Rs</span>
                                    <input
                                        type="number" step="0.01" placeholder="0.00"
                                        value={amount}
                                        onChange={e => {
                                            // Prevent exceeding balance
                                            const val = parseFloat(e.target.value);
                                            if (!isNaN(val) && val > currentBalance) return;
                                            setAmount(e.target.value);
                                            setAmountError('');
                                        }}
                                        className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white text-xl font-medium placeholder-gray-600 outline-none focus:bg-white/8 transition-all
                                            ${amountError ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/50'}`}
                                    />
                                </div>
                                <div className="flex justify-between mt-1.5">
                                    {amountError ? (
                                        <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{amountError}</p>
                                    ) : (
                                        <p className="text-xs text-gray-500">Min: Rs {MIN_AMOUNT} | Daily Limit: Rs {MAX_AMOUNT.toLocaleString()}</p>
                                    )}
                                </div>
                            </div>

                            {/* Fee + net breakdown */}
                            {numAmount > 0 && (
                                <motion.div
                                    className={`border rounded-2xl p-4 space-y-2.5 ${youReceive < 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-white/3 border-white/8'}`}
                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Withdrawal Amount</span>
                                        <span className="text-white">Rs {numAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Processing Fee</span>
                                        <span className={fee > 0 ? 'text-amber-400' : 'text-Chamber-400 text-xs font-medium mt-0.5'}>
                                            {fee > 0 ? `-Rs ${fee.toFixed(2)}` : 'FREE'}
                                        </span>
                                    </div>
                                    <div className="border-t border-white/10 pt-2.5 flex justify-between">
                                        <span className="font-semibold text-sm text-white">You Receive</span>
                                        <span className={`font-bold ${youReceive < 0 ? 'text-red-400' : 'text-banking-green'}`}>
                                            Rs {Math.max(youReceive, 0).toFixed(2)}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => setStep('details')}
                                    className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <button onClick={handleWithdrawClick}
                                    className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 text-sm">
                                    <Lock className="w-4 h-4" /> Withdraw Securely
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            {methodConfig && (
                <>
                    <WithdrawConfirmModal
                        isOpen={showConfirm}
                        amount={numAmount}
                        fee={fee}
                        method={selectedMethod!}
                        destination={buildDestination(selectedMethod!, paymentDetails)}
                        onConfirm={handleConfirm}
                        onCancel={() => setShowConfirm(false)}
                    />
                    <WithdrawOTPModal
                        isOpen={showOTP}
                        email={user?.email || 'your email'}
                        onVerify={handleVerifyOTP}
                        onResend={handleResendOTP}
                        onClose={() => setShowOTP(false)}
                    />
                </>
            )}
        </>
    );
};
