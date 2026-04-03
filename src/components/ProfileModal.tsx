import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Edit2, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState('John Doe');
    const [phoneNumber, setPhoneNumber] = useState('+1 234 567 8900');
    const [address, setAddress] = useState('123 Banking Street, Finance City, FC 12345');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setIsEditing(false);
        }, 1000);
    };

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
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Profile Information</h2>
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
                            {/* Profile Avatar */}
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <span className="text-3xl font-bold">{user?.email[0].toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-banking-light transition-colors"
                                    />
                                ) : (
                                    <p className="mt-2 text-white">{fullName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Mail className="w-3 h-3" />
                                    Email Address
                                </label>
                                <p className="mt-2 text-white break-all">{user?.email}</p>
                                <span className="text-xs text-banking-light mt-1 inline-block">✓ Verified</span>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-banking-light transition-colors"
                                    />
                                ) : (
                                    <p className="mt-2 text-white">{phoneNumber}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</label>
                                {isEditing ? (
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        rows={3}
                                        className="w-full mt-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-banking-light transition-colors resize-none"
                                    />
                                ) : (
                                    <p className="mt-2 text-white text-sm">{address}</p>
                                )}
                            </div>

                            {/* Account Status */}
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <div className="flex items-center gap-2 text-xs font-semibold text-banking-light uppercase">
                                    <Shield className="w-4 h-4" />
                                    Account Status
                                </div>
                                <p className="text-sm text-white mt-2">✓ Verified Tier 1 • Member since March 2026</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-white/10 bg-white/5">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-2 bg-banking-light hover:bg-banking-green text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full px-4 py-2 bg-banking-light hover:bg-banking-green text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
