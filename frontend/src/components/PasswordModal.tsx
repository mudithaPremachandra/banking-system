import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PasswordModal = ({ isOpen, onClose }: PasswordModalProps) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;
        setPasswordStrength(strength);
        return strength;
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pwd = e.target.value;
        setNewPassword(pwd);
        checkPasswordStrength(pwd);
    };

    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onClose();
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 1000);
    };

    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

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
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Change Password</h2>
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
                            {/* Current Password */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter your current password"
                                        className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-banking-light transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">New Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        placeholder="Enter a new password"
                                        className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-banking-light transition-colors"
                                    />
                                </div>
                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/10'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Strength: <span className={strengthColors[passwordStrength - 1]?.replace('bg-', 'text-')}>{strengthLabels[passwordStrength - 1]}</span></p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-banking-light transition-colors"
                                    />
                                </div>
                                {confirmPassword && newPassword === confirmPassword && (
                                    <p className="text-xs text-green-400 mt-1">✓ Passwords match</p>
                                )}
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-400 mt-1">✗ Passwords do not match</p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                <p className="text-xs font-semibold text-gray-300 mb-2">Password Requirements:</p>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    <li>• At least 8 characters long</li>
                                    <li>• Include uppercase letters (A-Z)</li>
                                    <li>• Include numbers (0-9)</li>
                                    <li>• Include special characters (!@#$%)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-white/10 bg-white/5">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                                className="flex-1 px-4 py-2 bg-banking-light hover:bg-banking-green text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
