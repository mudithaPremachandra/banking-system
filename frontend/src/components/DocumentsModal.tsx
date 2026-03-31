import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download } from 'lucide-react';

interface DocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DocumentsModal = ({ isOpen, onClose }: DocumentsModalProps) => {
    const [selectedMonth, setSelectedMonth] = useState('March');
    const [selectedYear, setSelectedYear] = useState('2026');

    const documents = [
        { name: 'March 2026 Statement', date: 'Mar 31, 2026', type: 'PDF', size: '2.4 MB' },
        { name: 'February 2026 Statement', date: 'Feb 28, 2026', type: 'PDF', size: '2.1 MB' },
        { name: 'January 2026 Statement', date: 'Jan 31, 2026', type: 'PDF', size: '1.9 MB' },
        { name: 'December 2025 Statement', date: 'Dec 31, 2025', type: 'PDF', size: '2.3 MB' },
        { name: 'Tax Document 2025', date: 'Dec 31, 2025', type: 'PDF', size: '356 KB' },
    ];

    const years = ['2026', '2025', '2024'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Statements & Documents</h2>
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
                            {/* Date Filter */}
                            <div className="flex gap-2">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-banking-light transition-colors"
                                >
                                    {months.map(month => (
                                        <option key={month} value={month} className="bg-gray-900">{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-banking-light transition-colors"
                                >
                                    {years.map(year => (
                                        <option key={year} value={year} className="bg-gray-900">{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Documents List */}
                            <div className="space-y-2">
                                {documents.map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                                                <p className="text-xs text-gray-400">{doc.date} • {doc.type} • {doc.size}</p>
                                            </div>
                                        </div>
                                        <button className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                                            <Download className="w-4 h-4 text-banking-light" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Info Box */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                <p className="text-xs text-gray-300">📋 <strong>Monthly statements</strong> are generated on the last day of each month and are available for download as PDF files for your records.</p>
                            </div>
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
