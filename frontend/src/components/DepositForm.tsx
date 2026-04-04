import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowDownCircle, CreditCard, Building2, Smartphone, Bitcoin,
    AlertCircle, ChevronRight, ChevronLeft, Loader2, Lock
} from 'lucide-react';
import type { PaymentMethod, Transaction } from '../types';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { DepositConfirmModal } from './DepositConfirmModal';
import { DepositOTPModal } from './DepositOTPModal';
import { DepositSuccessScreen } from './DepositSuccessScreen';
import { useAuth } from '../hooks/useAuth';

interface DepositFormProps {
    onSuccess: () => void;
}

type Step = 'method' | 'details' | 'amount' | 'processing' | 'success';

interface PaymentMethodConfig {
    id: PaymentMethod;
    label: string;
    icon: typeof CreditCard;
    description: string;
    feeRate: number; // percentage (card=2.5) or flat (bank=0)
    feeType: 'percent' | 'flat';
}

const PAYMENT_METHODS: PaymentMethodConfig[] = [
    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2, description: 'Direct from your bank account', feeRate: 0, feeType: 'flat' },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex', feeRate: 2.5, feeType: 'percent' },
    { id: 'mobile_wallet', label: 'Mobile Wallet', icon: Smartphone, description: 'Apple Pay / Google Pay', feeRate: 1, feeType: 'percent' },
    { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin, description: 'BTC, ETH, USDT', feeRate: 0.5, feeType: 'percent' },
];

const QUICK_AMOUNTS = [50, 100, 500];
const MIN_AMOUNT = 10;
const MAX_AMOUNT = 10000;

function calcFee(amount: number, cfg: PaymentMethodConfig): number {
    if (cfg.feeType === 'flat') return cfg.feeRate;
    return parseFloat(((amount * cfg.feeRate) / 100).toFixed(2));
}

function buildPaymentLabel(method: PaymentMethod, details: Record<string, string>): string {
    switch (method) {
        case 'card': return details.cardNumber ? `•••• ${details.cardNumber.replace(/\s/g, '').slice(-4)}` : 'Card';
        case 'bank_transfer': return details.accountNumber ? `Account •••${details.accountNumber.slice(-4)}` : 'Bank Transfer';
        case 'mobile_wallet': return details.walletType || 'Mobile Wallet';
        case 'crypto': return details.walletAddress ? `${details.walletAddress.slice(0, 6)}...${details.walletAddress.slice(-4)}` : 'Wallet';
        default: return method;
    }
}

export const DepositForm = ({ onSuccess }: DepositFormProps) => {
    const { user } = useAuth();
    const [step, setStep] = useState<Step>('method');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<Record<string, string>>({});
    const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [successData, setSuccessData] = useState<{ transaction: Transaction; prevBalance: number; newBalance: number } | null>(null);

    const methodConfig = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    const numAmount = parseFloat(amount) || 0;
    const fee = methodConfig ? calcFee(numAmount, methodConfig) : 0;
    const total = numAmount + fee;

    // ── Step 1: Method selection ─────────────────────────────────────────────
    const handleSelectMethod = (m: PaymentMethod) => {
        setSelectedMethod(m);
        setPaymentDetails({});
        setDetailErrors({});
    };

    // ── Step 2: Payment detail validation ───────────────────────────────────
    const validateDetails = (): boolean => {
        const errs: Record<string, string> = {};
        if (!selectedMethod) return false;
        if (selectedMethod === 'card') {
            if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16)
                errs.cardNumber = 'Enter a valid 16-digit card number';
            if (!paymentDetails.expiry || !/^\d{2}\/\d{2}$/.test(paymentDetails.expiry))
                errs.expiry = 'Enter expiry as MM/YY';
            if (!paymentDetails.cvv || paymentDetails.cvv.length < 3)
                errs.cvv = 'Enter a valid CVV';
        } else if (selectedMethod === 'bank_transfer') {
            if (!paymentDetails.accountNumber || paymentDetails.accountNumber.length < 8)
                errs.accountNumber = 'Enter a valid account number (min 8 digits)';
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

    // ── Step 3: Amount validation ────────────────────────────────────────────
    const validateAmount = (): boolean => {
        if (!amount || numAmount <= 0) { setAmountError('Please enter an amount'); return false; }
        if (numAmount < MIN_AMOUNT) { setAmountError(`Minimum deposit is Rs ${MIN_AMOUNT}`); return false; }
        if (numAmount > MAX_AMOUNT) { setAmountError(`Maximum deposit is Rs ${MAX_AMOUNT.toLocaleString()}`); return false; }
        setAmountError('');
        return true;
    };

    const handleDepositClick = () => {
        if (!validateAmount()) return;
        setShowConfirm(true);
    };

    // ── OTP flow ─────────────────────────────────────────────────────────────
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
            await processDeposit();
        }
        return valid;
    };

    const handleResendOTP = async () => {
        if (user?.id && user?.email) {
            await accountService.sendOTP(user.id, user.email);
        }
    };

    // ── Process ──────────────────────────────────────────────────────────────
    const processDeposit = useCallback(async () => {
        setStep('processing');
        try {
            const balanceBefore = await accountService.getBalance();
            const prevBal = balanceBefore.balance;
            const result = await transactionService.deposit(numAmount, `Deposit via ${buildPaymentLabel(selectedMethod!, paymentDetails)}`);
            onSuccess();
            setSuccessData({ transaction: result.transaction, prevBalance: prevBal, newBalance: result.newBalance });
            setStep('success');
        } catch (err) {
            console.error('Deposit failed', err);
            setStep('amount');
        }
    }, [numAmount, selectedMethod, paymentDetails, onSuccess]);

    // ── Reset ────────────────────────────────────────────────────────────────
    const handleReset = () => {
        setStep('method');
        setSelectedMethod(null);
        setPaymentDetails({});
        setAmount('');
        setAmountError('');
        setSuccessData(null);
    };

    // ── Format card number with spaces ───────────────────────────────────────
    const formatCardNumber = (v: string) =>
        v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

    const formatExpiry = (v: string) => {
        const digits = v.replace(/\D/g, '').slice(0, 4);
        return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    };

    // ── Rendering ─────────────────────────────────────────────────────────────

    if (step === 'success' && successData) {
        return (
            <DepositSuccessScreen
                transactionId={successData.transaction.id}
                amount={numAmount}
                fee={fee}
                method={selectedMethod!}
                paymentLabel={buildPaymentLabel(selectedMethod!, paymentDetails)}
                previousBalance={successData.prevBalance}
                newBalance={successData.newBalance}
                onDepositAgain={handleReset}
            />
        );
    }

    if (step === 'processing') {
        return (
            <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center gap-5 min-h-[360px]">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-banking-green/20 border-t-banking-green animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full bg-banking-green/5 blur-xl" />
                </div>
                <p className="text-lg font-semibold">Processing your deposit...</p>
                <p className="text-sm text-gray-400">Please do not close this window</p>
            </div>
        );
    }

    const stepIndex = { method: 0, details: 1, amount: 2 }[step as 'method' | 'details' | 'amount'] ?? 0;

    return (
        <>
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-banking-green/8 rounded-full blur-3xl -mt-10 -mr-10 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <ArrowDownCircle className="w-6 h-6 text-Chamber-400" />
                    <h2 className="text-xl font-semibold">Deposit Funds</h2>
                    <div className="ml-auto flex items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === stepIndex ? 'w-6 bg-banking-green' : i < stepIndex ? 'w-3 bg-banking-green/50' : 'w-3 bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Step label */}
                <p className="text-xs text-gray-500 mb-5 relative z-10">
                    Step {stepIndex + 1} of 3 —{' '}
                    <span className="text-gray-300">
                        {step === 'method' ? 'Choose payment method' : step === 'details' ? 'Enter payment details' : 'Enter amount'}
                    </span>
                </p>

                <AnimatePresence mode="wait">
                    {/* ── STEP 1: PAYMENT METHOD ── */}
                    {step === 'method' && (
                        <motion.div key="method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {PAYMENT_METHODS.map(m => {
                                    const Icon = m.icon;
                                    const selected = selectedMethod === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => handleSelectMethod(m.id)}
                                            className={`p-4 rounded-2xl border text-left transition-all duration-200 group
                                                ${selected
                                                    ? 'border-banking-green/60 bg-banking-green/10 shadow-lg shadow-banking-green/10'
                                                    : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors
                                                ${selected ? 'bg-banking-green/20' : 'bg-white/8 group-hover:bg-white/12'}`}>
                                                <Icon className={`w-4.5 h-4.5 ${selected ? 'text-banking-green' : 'text-gray-300'}`} />
                                            </div>
                                            <p className={`text-sm font-semibold leading-tight mb-0.5 ${selected ? 'text-white' : 'text-gray-200'}`}>{m.label}</p>
                                            <p className="text-xs text-gray-500">{m.description}</p>
                                            <p className={`text-xs mt-1.5 font-medium ${selected ? 'text-banking-green' : 'text-gray-500'}`}>
                                                {m.feeRate === 0 ? 'No fee' : m.feeType === 'percent' ? `${m.feeRate}% fee` : `Rs ${m.feeRate} fee`}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                disabled={!selectedMethod}
                                onClick={() => setStep('details')}
                                className="w-full bg-banking-green hover:bg-banking-light text-background font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-banking-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Continue <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* ── STEP 2: PAYMENT DETAILS ── */}
                    {step === 'details' && selectedMethod && (
                        <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10 space-y-4">

                            {selectedMethod === 'card' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            value={paymentDetails.cardNumber || ''}
                                            onChange={e => setPaymentDetails(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                                            className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all font-mono tracking-wider text-sm ${detailErrors.cardNumber ? 'border-red-500/60' : 'border-white/10 focus:border-banking-green/50'}`}
                                        />
                                        {detailErrors.cardNumber && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.cardNumber}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                value={paymentDetails.expiry || ''}
                                                onChange={e => setPaymentDetails(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                                                className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all text-sm ${detailErrors.expiry ? 'border-red-500/60' : 'border-white/10 focus:border-banking-green/50'}`}
                                            />
                                            {detailErrors.expiry && <p className="text-red-400 text-xs mt-1">{detailErrors.expiry}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5">CVV</label>
                                            <input
                                                type="password"
                                                placeholder="•••"
                                                maxLength={4}
                                                value={paymentDetails.cvv || ''}
                                                onChange={e => setPaymentDetails(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                                                className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all text-sm ${detailErrors.cvv ? 'border-red-500/60' : 'border-white/10 focus:border-banking-green/50'}`}
                                            />
                                            {detailErrors.cvv && <p className="text-red-400 text-xs mt-1">{detailErrors.cvv}</p>}
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedMethod === 'bank_transfer' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Account Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 12345678901"
                                            value={paymentDetails.accountNumber || ''}
                                            onChange={e => setPaymentDetails(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '') }))}
                                            className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all font-mono text-sm ${detailErrors.accountNumber ? 'border-red-500/60' : 'border-white/10 focus:border-banking-green/50'}`}
                                        />
                                        {detailErrors.accountNumber && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.accountNumber}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Reference (optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Payment reference"
                                            value={paymentDetails.reference || ''}
                                            onChange={e => setPaymentDetails(p => ({ ...p, reference: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:border-banking-green/50 focus:bg-white/8 transition-all text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {selectedMethod === 'mobile_wallet' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">Select Wallet</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Apple Pay', 'Google Pay'].map(w => (
                                            <button
                                                key={w}
                                                onClick={() => setPaymentDetails(p => ({ ...p, walletType: w }))}
                                                className={`p-4 rounded-xl border text-sm font-medium transition-all
                                                    ${paymentDetails.walletType === w
                                                        ? 'border-banking-green/60 bg-banking-green/10 text-white'
                                                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25'}`}
                                            >
                                                {w}
                                            </button>
                                        ))}
                                    </div>
                                    {detailErrors.walletType && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.walletType}</p>}
                                    {paymentDetails.walletType && (
                                        <div className="mt-4 p-4 rounded-xl bg-white/3 border border-white/8 text-center text-sm text-gray-400">
                                            You'll be redirected to {paymentDetails.walletType} after confirmation.
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedMethod === 'crypto' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Wallet Address</label>
                                    <input
                                        type="text"
                                        placeholder="0x... or bc1..."
                                        value={paymentDetails.walletAddress || ''}
                                        onChange={e => setPaymentDetails(p => ({ ...p, walletAddress: e.target.value }))}
                                        className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all font-mono text-xs ${detailErrors.walletAddress ? 'border-red-500/60' : 'border-white/10 focus:border-banking-green/50'}`}
                                    />
                                    {detailErrors.walletAddress && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{detailErrors.walletAddress}</p>}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setStep('method')}
                                    className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    onClick={() => { if (validateDetails()) setStep('amount'); }}
                                    className="flex-1 bg-banking-green hover:bg-banking-light text-background font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-banking-green/20 text-sm"
                                >
                                    Continue <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: AMOUNT ── */}
                    {step === 'amount' && (
                        <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10 space-y-5">

                            {/* Quick amount buttons */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Quick Select</label>
                                <div className="flex gap-2">
                                    {QUICK_AMOUNTS.map(q => (
                                        <button
                                            key={q}
                                            onClick={() => { setAmount(String(q)); setAmountError(''); }}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                                                ${parseFloat(amount) === q
                                                    ? 'border-banking-green/60 bg-banking-green/10 text-banking-green'
                                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25 hover:text-white'}`}
                                        >
                                            +Rs {q}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { setAmount(String(MAX_AMOUNT)); setAmountError(''); }}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                                            ${parseFloat(amount) === MAX_AMOUNT
                                                ? 'border-banking-green/60 bg-banking-green/10 text-banking-green'
                                                : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25 hover:text-white'}`}
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            {/* Amount input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount (LKR)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">Rs</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={e => { setAmount(e.target.value); setAmountError(''); }}
                                        className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white text-xl font-medium placeholder-gray-600 outline-none focus:bg-white/8 transition-all
                                            ${amountError ? 'border-red-500/60' : 'border-white/10 focus:border-banking-green/50'}`}
                                    />
                                </div>
                                <div className="flex justify-between mt-1.5">
                                    {amountError ? (
                                        <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{amountError}</p>
                                    ) : (
                                        <p className="text-xs text-gray-500">Min: Rs {MIN_AMOUNT} | Max: Rs {MAX_AMOUNT.toLocaleString()}</p>
                                    )}
                                </div>
                            </div>

                            {/* Fee breakdown */}
                            {numAmount > 0 && (
                                <motion.div
                                    className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-2.5"
                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Deposit Amount</span>
                                        <span className="text-white">Rs {numAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Processing Fee
                                            {methodConfig && methodConfig.feeRate > 0 && (
                                                <span className="text-gray-600 ml-1">({methodConfig.feeRate}{methodConfig.feeType === 'percent' ? '%' : ' flat'})</span>
                                            )}
                                        </span>
                                        <span className={fee > 0 ? 'text-amber-400' : 'text-Chamber-400 text-xs font-medium mt-0.5'}>
                                            {fee > 0 ? `Rs ${fee.toFixed(2)}` : 'FREE'}
                                        </span>
                                    </div>
                                    <div className="border-t border-white/10 pt-2.5 flex justify-between">
                                        <span className="font-semibold text-sm text-white">Total Charged</span>
                                        <span className="font-bold text-banking-green">Rs {total.toFixed(2)}</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('details')}
                                    className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    onClick={handleDepositClick}
                                    className="flex-1 bg-banking-green hover:bg-banking-light text-background font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-banking-green/20 text-sm"
                                >
                                    <Lock className="w-4 h-4" /> Deposit Securely
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            {methodConfig && (
                <>
                    <DepositConfirmModal
                        isOpen={showConfirm}
                        amount={numAmount}
                        fee={fee}
                        method={selectedMethod!}
                        paymentLabel={buildPaymentLabel(selectedMethod!, paymentDetails)}
                        onConfirm={handleConfirm}
                        onCancel={() => setShowConfirm(false)}
                    />
                    <DepositOTPModal
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
