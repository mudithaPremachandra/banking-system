import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

export const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        setErrorMsg('');
        try {
            const { userId, email } = await login(data);
            navigate('/otp-verification', { state: { email, userId }, replace: true });
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Changed: h-screen → min-h-screen, added pt-20 to push content below header
        <div className="min-h-screen flex justify-center items-center p-4 pt-20 relative overflow-hidden">
            <div className="fixed inset-0 liquid-sheen opacity-10 z-0 pointer-events-none"></div>

            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-banking-green/10 rounded-full blur-[100px] pointer-events-none" style={{ zIndex: -5 }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" style={{ zIndex: -5 }}></div>

            <div className="glass-panel w-full max-w-sm p-6 rounded-[2rem] z-10 shadow-[0_0_40px_rgba(0,0,0,0.4)]">

                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 shadow-md overflow-hidden">
                        <img src="/logo.png" alt="Chamber Bank Logo" className="w-full h-full object-cover" />
                    </div>

                    <h1 className="text-[22px] font-bold tracking-tight text-white">
                        Welcome to Chamber 
                    </h1>

                    <p className="text-gray-400 mt-2 text-sm text-center">
                        Enter your credentials to access your account.
                    </p>
                </div>

                {/* Error */}
                {errorMsg && (
                    <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2 ml-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                {...register('email', { required: 'Email is required' })}
                                type="email"
                                placeholder="your-email@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-banking-green/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1.5 ml-1">
                                {errors.email.message as string}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                {...register('password', { required: 'Password is required' })}
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-banking-green/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1.5 ml-1">
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="pt-2">
                        <div className="h-px w-full bg-white/10"></div>
                    </div>

                    {/* Button */}
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-banking-green hover:bg-banking-light text-background font-semibold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-md shadow-banking-green/20 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-5 text-center text-sm text-gray-400">
                    Contact your bank administrator to create an account.
                </p>
            </div>
        </div>
    );
};