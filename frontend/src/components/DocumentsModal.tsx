import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Loader2 } from 'lucide-react';
import { transactionService } from '../services/transactionService';

interface DocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DocumentsModal = ({ isOpen, onClose }: DocumentsModalProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateStatement = async (format: 'csv' | 'txt') => {
        setIsGenerating(true);
        try {
            const data = await transactionService.getHistory(1, 100);
            const txs = data.transactions;

            if (format === 'csv') {
                const headers = ['Transaction ID', 'Type', 'Amount (LKR)', 'Balance After', 'Description', 'Date'];
                const rows = txs.map((tx) => [
                    tx.id,
                    tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal',
                    tx.amount,
                    tx.balanceAfter,
                    tx.description || '',
                    new Date(tx.date || tx.createdAt).toLocaleString(),
                ]);
                const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
                downloadFile(csvContent, `statement_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
            } else {
                let content = `ACCOUNT STATEMENT\nGenerated: ${new Date().toLocaleString()}\n\n`;
                content += '='.repeat(60) + '\n\n';
                if (txs.length === 0) {
                    content += 'No transactions found.\n';
                } else {
                    txs.forEach((tx) => {
                        const type = tx.type === 'DEPOSIT' ? 'DEPOSIT' : 'WITHDRAWAL';
                        const sign = tx.type === 'DEPOSIT' ? '+' : '-';
                        const date = new Date(tx.date || tx.createdAt).toLocaleString();
                        content += `ID: ${tx.id}\nType: ${type}\nAmount: ${sign}Rs ${Number(tx.amount).toFixed(2)}\nBalance After: Rs ${Number(tx.balanceAfter).toFixed(2)}\nDescription: ${tx.description || '-'}\nDate: ${date}\n\n`;
                    });
                }
                content += '='.repeat(60) + '\n';
                content += `Total Transactions: ${txs.length}\n`;
                downloadFile(content, `statement_${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
            }
        } catch (err) {
            console.error('Failed to generate statement', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
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
                            <p className="text-sm text-gray-300">
                                Generate and download your account statement with all transaction history.
                            </p>

                            {/* Download Options */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => generateStatement('csv')}
                                    disabled={isGenerating}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-green-400" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white">CSV Statement</p>
                                            <p className="text-xs text-gray-400">Spreadsheet-compatible format</p>
                                        </div>
                                    </div>
                                    {isGenerating ? (
                                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                    ) : (
                                        <Download className="w-5 h-5 text-banking-light" />
                                    )}
                                </button>

                                <button
                                    onClick={() => generateStatement('txt')}
                                    disabled={isGenerating}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white">Text Statement</p>
                                            <p className="text-xs text-gray-400">Plain text report format</p>
                                        </div>
                                    </div>
                                    {isGenerating ? (
                                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                    ) : (
                                        <Download className="w-5 h-5 text-banking-light" />
                                    )}
                                </button>
                            </div>

                            {/* Info Box */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                <p className="text-xs text-gray-300">Statements include your full transaction history (up to 100 most recent transactions). For a complete record, use the CSV export from the Transactions page.</p>
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
