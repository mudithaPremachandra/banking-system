import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { TransactionTable } from '../components/TransactionTable';
import { transactionService } from '../services/transactionService';
import type { Transaction } from '../types';
import { Loader2 } from 'lucide-react';

export const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchHistory = async (p: number) => {
        setLoading(true);
        try {
            const data = await transactionService.getHistory(p);
            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Failed to load transaction history', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(page);
    }, [page]);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>

                {loading && transactions.length === 0 ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-banking-green" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <TransactionTable transactions={transactions} />

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl glass-card border-none">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-400">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
