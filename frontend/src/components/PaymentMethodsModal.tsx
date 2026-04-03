import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, Zap } from 'lucide-react';
interface PaymentMethodsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// ── Card Preview Component ──────────────────────────────────────────────────
const VisualCard = ({ number, name, expiry, cvc }: { number: string; name: string; expiry: string; cvc: string }) => {
    // Basic formatting
    const displayNum = number.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
    const displayExp = expiry.padEnd(4, '•').replace(/(.{2})(.{2})/, '$1/$2');
    
    return (
        <div className="w-full relative rounded-2xl p-5 text-white overflow-hidden shadow-2xl transition-all duration-300 bg-gradient-to-br from-indigo-900 to-slate-900 border border-white/10 mt-1 mb-4 group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mb-10 -ml-10 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <CreditCard className="w-8 h-8 text-white/50" />
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-multiply" />
                    <div className="w-8 h-8 rounded-full bg-yellow-500/80 mix-blend-multiply" />
                </div>
            </div>
            
            <div className="relative z-10 mb-3">
                <p className="font-mono text-xl tracking-widest text-white/90 drop-shadow-md">
                    {displayNum}
                </p>
            </div>
            
            <div className="flex justify-between text-xs text-white/60 font-medium relative z-10">
                <div>
                    <p className="uppercase text-[10px] mb-1">Card Holder</p>
                    <p className="text-sm text-white uppercase tracking-wider">{name || 'YOUR NAME'}</p>
                </div>
                <div className="text-right">
                    <p className="uppercase text-[10px] mb-1">Expires</p>
                    <p className="text-sm text-white">{displayExp}</p>
                </div>
                <div className="text-right">
                    <p className="uppercase text-[10px] mb-1">CVC</p>
                    <p className="text-sm text-white">{cvc.padEnd(3, '•')}</p>
                </div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 w-[200%] translate-x-[-100%] group-hover:translate-x-[50%] transition-transform duration-1000 ease-in-out pointer-events-none" />
        </div>
    );
};

export const PaymentMethodsModal = ({ isOpen, onClose }: PaymentMethodsModalProps) => {
    // Card Form State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Reset form on open
    useEffect(() => {
        if (isOpen) {
            setCardNumber('');
            setCardName('');
            setCardExpiry('');
            setCardCVC('');
        }
    }, [isOpen]);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 16);
        setCardNumber(val);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
        setCardExpiry(val);
    };

    const handleSave = () => {
        if (cardNumber.length < 16 || cardExpiry.length < 4 || cardCVC.length < 3) return;
        setIsSaving(true);
        setTimeout(() => {
            // TODO: integrate with backend when saved payment methods API is available
            console.log('Saved card:', cardNumber.slice(-4));
            setIsSaving(false);
            onClose(); // Close modal on success
        }, 1200);
    };

    const isFormValid = cardNumber.length === 16 && cardExpiry.length === 4 && cardCVC.length >= 3;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        onClick={onClose} 
                    />

                    <motion.div
                        className="relative w-full max-w-4xl glass-panel rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col"
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                Payment Methods
                            </h2>
                            <button onClick={onClose} className="p-2 -mr-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Left Side: Visual Card Preview */}
                            <div className="w-full lg:w-[400px] flex-shrink-0 animate-in fade-in slide-in-from-left duration-700">
                                <div className="sticky top-0">
                                    <p className="text-xs font-bold text-indigo-400/80 uppercase tracking-[0.2em] mb-4">Card Preview</p>
                                    <VisualCard number={cardNumber} name={cardName} expiry={cardExpiry} cvc={cardCVC} />
                                    
                                    <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-Chamber-400/70" />
                                            <span>Secure 256-bit SSL encrypted connection</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-400/70" />
                                            <span>Instant verification for all major cards</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div className="flex-1 w-full space-y-5 animate-in fade-in slide-in-from-right duration-700 delay-100">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Card Details</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Card Number</label>
                                            <input type="text" 
                                                value={cardNumber.replace(/(.{4})/g, '$1 ').trim()} 
                                                onChange={handleCardNumberChange}
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Cardholder Name</label>
                                            <input type="text" 
                                                value={cardName} 
                                                onChange={e => setCardName(e.target.value)}
                                                placeholder="e.g. John Doe"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                                            />
                                        </div>
                

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Expiry Date</label>
                                                <input type="text" 
                                                    value={cardExpiry.replace(/(.{2})(?=\d)/g, '$1/')} 
                                                    onChange={handleExpiryChange}
                                                    placeholder="MM/YY"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">CVC</label>
                                                <input type="text" 
                                                    value={cardCVC} 
                                                    onChange={e => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                    placeholder="123"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleSave}
                                            disabled={!isFormValid || isSaving}
                                            className="w-full py-4 mt-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-indigo-500/30 active:scale-[0.98]"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-5 h-5" />
                                                    Save Card Security
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
