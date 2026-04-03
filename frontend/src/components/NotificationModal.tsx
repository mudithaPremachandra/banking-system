import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Mail, Smartphone, CheckCircle } from 'lucide-react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STORAGE_KEY = 'banking_notification_prefs';

const defaultPrefs = {
    transactionAlerts: true,
    lowBalance: true,
    securityUpdates: true,
    promotions: false,
    weeklyReport: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
};

const loadPrefs = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return { ...defaultPrefs, ...JSON.parse(stored) };
    } catch {}
    return defaultPrefs;
};

export const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
    const [notifications, setNotifications] = useState(defaultPrefs);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNotifications(loadPrefs());
            setSaved(false);
        }
    }, [isOpen]);

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        setSaved(true);
        setTimeout(() => onClose(), 1000);
    };

    const notificationOptions = [
        { id: 'transactionAlerts', label: 'Transaction Alerts', description: 'Get notified for every deposit and withdrawal', icon: Bell },
        { id: 'lowBalance', label: 'Low Balance Warning', description: 'Alert when balance drops below threshold', icon: Bell },
        { id: 'securityUpdates', label: 'Security Updates', description: 'Important security and account changes', icon: Bell },
        { id: 'promotions', label: 'Promotions & Offers', description: 'Special deals and promotional offers', icon: Bell },
        { id: 'weeklyReport', label: 'Weekly Report', description: 'Summary of your account activity', icon: Bell },
    ];

    const channelOptions = [
        { id: 'emailNotifications', label: 'Email Notifications', icon: Mail },
        { id: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone },
        { id: 'pushNotifications', label: 'Push Notifications', icon: Bell },
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
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
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
                            {/* Notification Types */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Notification Types</h4>
                                <div className="space-y-2">
                                    {notificationOptions.map(option => (
                                        <div key={option.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                            <div>
                                                <p className="text-sm font-medium text-white">{option.label}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{option.description}</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notifications[option.id as keyof typeof notifications]}
                                                onChange={() => handleToggle(option.id as keyof typeof notifications)}
                                                className="w-5 h-5 rounded cursor-pointer accent-banking-light"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notification Channels */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Notification Channels</h4>
                                <div className="space-y-2">
                                    {channelOptions.map(channel => {
                                        const Icon = channel.id === 'emailNotifications' ? Mail : channel.id === 'smsNotifications' ? Smartphone : Bell;
                                        return (
                                            <div key={channel.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4 text-banking-light" />
                                                    <p className="text-sm font-medium text-white">{channel.label}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={notifications[channel.id as keyof typeof notifications]}
                                                    onChange={() => handleToggle(channel.id as keyof typeof notifications)}
                                                    className="w-5 h-5 rounded cursor-pointer accent-banking-light"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quiet Hours Info */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                <p className="text-xs text-gray-300">💡 Quiet hours can be set in your phone/email settings to prevent disturbances during sleep.</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-white/10 bg-white/5">
                            {saved ? (
                                <div className="w-full flex items-center justify-center gap-2 text-green-400 py-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Preferences saved!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    className="w-full px-4 py-2 bg-banking-light hover:bg-banking-green text-white rounded-lg transition-colors font-medium"
                                >
                                    Save Preferences
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
