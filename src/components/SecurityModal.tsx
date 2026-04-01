import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Smartphone, Clock, CheckCircle } from 'lucide-react';

interface SecurityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SecurityModal = ({ isOpen, onClose }: SecurityModalProps) => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [lastLogin] = useState('Today at 2:30 PM');
    const [loginAttempts] = useState(0);

    const secureSessions = [
        { device: 'Chrome on Windows', lastActive: '2 minutes ago', location: 'New York, USA' },
        { device: 'Safari on iPhone', lastActive: '1 hour ago', location: 'New York, USA' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Security & Authentication</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5 max-h-96 overflow-y-auto">
                            {/* Last Login */}
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    Last Login
                                </div>
                                <p className="text-xs text-gray-300">{lastLogin}</p>
                            </div>

                            {/* Two-Factor Authentication */}
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-green-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-gray-400">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={twoFactorEnabled}
                                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                                    className="w-5 h-5 rounded cursor-pointer accent-banking-light"
                                />
                            </div>

                            {/* Biometric Authentication */}
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Biometric Login</p>
                                        <p className="text-xs text-gray-400">{biometricEnabled ? 'Enabled' : 'Disabled'}</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={biometricEnabled}
                                    onChange={(e) => setBiometricEnabled(e.target.checked)}
                                    className="w-5 h-5 rounded cursor-pointer accent-banking-light"
                                />
                            </div>

                            {/* Active Sessions */}
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-3">Active Sessions</h4>
                                <div className="space-y-2">
                                    {secureSessions.map((session, idx) => (
                                        <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{session.device}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{session.lastActive} • {session.location}</p>
                                                </div>
                                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Status */}
                            {loginAttempts === 0 && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div>
                                        <p className="text-xs font-semibold text-green-400">SECURE</p>
                                        <p className="text-xs text-green-300">No suspicious activity detected</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-white/10 bg-white/5">
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-2 bg-banking-light hover:bg-banking-green text-white rounded-lg transition-colors font-medium"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
