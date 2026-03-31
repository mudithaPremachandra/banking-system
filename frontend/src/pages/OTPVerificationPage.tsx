import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const OTPVerificationPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If user accesses this page directly without an email in state
    if (!email) {
        return <Navigate to="/register" replace />;
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        setErrorMsg('');
        try {
            await verifyOTP({ code: data.otp, email });
            navigate('/login', { replace: true });
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Invalid OTP code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="fixed inset-0 liquid-sheen opacity-10 z-0 pointer-events-none"></div>

            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-banking-green/10 rounded-full blur-[100px] pointer-events-none z-0" style={{ zIndex: -5 }}></div>

            <div className="glass-panel w-full max-w-md p-10 rounded-[2.5rem] z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-banking-light/20 rounded-2xl flex items-center justify-center mb-4 border border-banking-green/30">
                        <ShieldCheck className="w-7 h-7 text-banking-green" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Verify Your Account</h1>
                    <p className="text-gray-400 mt-2 text-sm text-center">
                        We've sent a 6-digit code to <br /> <span className="text-white font-medium">{email}</span>
                    </p>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">Enter 6-digit code</label>
                        <input
                            {...register('otp', {
                                required: 'OTP is required',
                                pattern: { value: /^\d{6}$/, message: 'Must be exactly 6 digits' }
                            })}
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-3xl tracking-[1em] text-white placeholder-gray-600 outline-none focus:border-banking-green/50 focus:bg-white/10 transition-all font-mono"
                        />
                        {errors.otp && <p className="text-red-400 text-xs mt-2 text-center">{errors.otp.message as string}</p>}
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-banking-green hover:bg-banking-light text-background font-semibold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-banking-green/20 disabled:opacity-70"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                    </button>
                </form>
            </div>
        </div>
    );
};
