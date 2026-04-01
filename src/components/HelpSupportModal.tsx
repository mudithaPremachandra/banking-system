import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, MessageSquare, Phone, Mail, ExternalLink } from 'lucide-react';

interface HelpSupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpSupportModal = ({ isOpen, onClose }: HelpSupportModalProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const faqCategories = [
        {
            name: 'Account',
            icon: '👤',
            faqs: [
                { q: 'How do I verify my account?', a: 'Visit Account Settings > Security & Authentication to complete verification.' },
                { q: 'Can I change my email address?', a: 'Contact our support team at support@chamberbank.com to change your email.' },
                { q: 'How do I delete my account?', a: 'You can request account deletion in Account Settings or email support.' },
            ]
        },
        {
            name: 'Deposits',
            icon: '📥',
            faqs: [
                { q: 'How long do deposits take?', a: 'Most deposits are processed within 1-3 business days.' },
                { q: 'What\'s the maximum deposit amount?', a: 'There is no limit on deposits, but may vary based on payment method.' },
                { q: 'Which payment methods are supported?', a: 'We support bank transfers, cards, and mobile wallets.' },
            ]
        },
        {
            name: 'Withdrawals',
            icon: '📤',
            faqs: [
                { q: 'When will I receive my withdrawal?', a: 'Withdrawals typically process within 1-5 business days.' },
                { q: 'Are there withdrawal fees?', a: 'Withdrawal fees vary by payment method. See the fee schedule for details.' },
                { q: 'Can I cancel a withdrawal?', a: 'You can cancel pending withdrawals from the Transactions page.' },
            ]
        },
        {
            name: 'Security',
            icon: '🔒',
            faqs: [
                { q: 'Is my data safe?', a: 'Yes, we use bank-level encryption and security protocols.' },
                { q: 'How do I enable 2FA?', a: 'Go to Security & Authentication and enable Two-Factor Authentication.' },
                { q: 'What if my account is compromised?', a: 'Contact support immediately at support@chamberbank.com or call our hotline.' },
            ]
        },
    ];

    const contactInfo = [
        { icon: Mail, label: 'Email', value: 'support@chamberbank.com', action: 'mailto:support@chamberbank.com' },
        { icon: Phone, label: 'Phone', value: '+1 (800) 555-0123', action: 'tel:+18005550123' },
        { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7', action: '#' },
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
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Help & Support</h2>
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
                            {!selectedCategory ? (
                                <>
                                    {/* FAQ Categories */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Topics</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {faqCategories.map(cat => (
                                                <button
                                                    key={cat.name}
                                                    onClick={() => setSelectedCategory(cat.name)}
                                                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-left"
                                                >
                                                    <p className="text-lg mb-1">{cat.icon}</p>
                                                    <p className="text-xs font-medium text-white">{cat.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Contact Options */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact Us</h4>
                                        <div className="space-y-2">
                                            {contactInfo.map((contact, idx) => {
                                                const Icon = contact.icon;
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={contact.action}
                                                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                                                    >
                                                        <Icon className="w-4 h-4 text-banking-light flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-gray-400">{contact.label}</p>
                                                            <p className="text-sm text-white truncate">{contact.value}</p>
                                                        </div>
                                                        {contact.label !== 'Live Chat' && <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Back Button */}
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="text-sm text-banking-light hover:text-banking-green transition-colors mb-3"
                                    >
                                        ← Back to Topics
                                    </button>

                                    {/* FAQs for Category */}
                                    <div className="space-y-3">
                                        {faqCategories
                                            .find(cat => cat.name === selectedCategory)
                                            ?.faqs.map((faq, idx) => (
                                                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                                                    <p className="text-sm font-semibold text-white mb-2">{faq.q}</p>
                                                    <p className="text-xs text-gray-300">{faq.a}</p>
                                                </div>
                                            ))}
                                    </div>
                                </>
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
