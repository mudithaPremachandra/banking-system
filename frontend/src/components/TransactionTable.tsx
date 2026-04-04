import { useState, useMemo } from 'react';
import type { Transaction } from '../types';
import { ArrowDownCircle, ArrowUpCircle, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionTableProps {
    transactions: Transaction[];
}

type FilterType = 'ALL' | 'DEPOSIT' | 'WITHDRAWAL';

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
    const [filterType, setFilterType] = useState<FilterType>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter transactions based on type, search, and date range
    const filteredTransactions = useMemo(() => {
        let result = transactions;

        // Filter by type
        if (filterType !== 'ALL') {
            result = result.filter((tx) => tx.type === filterType);
        }

        // Filter by search query (ID or amount)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (tx) =>
                    tx.id.toLowerCase().includes(query) ||
                    tx.amount.toString().includes(query)
            );
        }

        // Filter by date range
        if (startDate) {
            const start = new Date(startDate);
            result = result.filter((tx) => new Date(tx.date || tx.createdAt) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter((tx) => new Date(tx.date || tx.createdAt) <= end);
        }

        return result;
    }, [transactions, filterType, searchQuery, startDate, endDate]);

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Reset to first page when filters change
    const handleFilterChange = (type: FilterType) => {
        setFilterType(type);
        setCurrentPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        if (type === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
        setCurrentPage(1);
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Transaction ID', 'Type', 'Amount', 'Date'];
        const rows = filteredTransactions.map((tx) => [
            tx.id,
            tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal',
            tx.amount,
            new Date(tx.date || tx.createdAt).toLocaleDateString(),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `statement_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
    };

    // Export to PDF (text-based)
    const exportToPDF = () => {
        const title = 'Transaction Statement';
        const date = new Date().toLocaleDateString();
        
        let content = `${title}\nGenerated: ${date}\n\n`;
        content += `Period: ${startDate ? new Date(startDate).toLocaleDateString() : 'All dates'} to ${endDate ? new Date(endDate).toLocaleDateString() : 'Today'}\n\n`;
        
        content += 'TRANSACTIONS\n';
        content += '='.repeat(80) + '\n\n';
        
        filteredTransactions.forEach((tx) => {
            const typeLabel = tx.type === 'DEPOSIT' ? 'DEPOSIT' : 'WITHDRAWAL';
            const sign = tx.type === 'DEPOSIT' ? '+' : '-';
            const date = new Date(tx.date || tx.createdAt).toLocaleDateString();
            content += `ID: ${tx.id}\nType: ${typeLabel}\nAmount: ${sign}LKR ${Number(tx.amount).toFixed(2)}\nDate: ${date}\n\n`;
        });

        content += '='.repeat(80) + '\n';
        content += `Total Transactions: ${filteredTransactions.length}\n`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `statement_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
    };

    return (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Transactions</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm transition-colors"
                            title="Export to CSV"
                        >
                            <Download className="w-4 h-4" />
                            CSV
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm transition-colors"
                            title="Export to TXT"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="space-y-4">
                    {/* Type Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {(['ALL', 'DEPOSIT', 'WITHDRAWAL'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => handleFilterChange(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filterType === type
                                        ? 'bg-banking-green text-white shadow-lg'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                }`}
                            >
                                {type === 'ALL' ? 'All' : type === 'DEPOSIT' ? 'Income' : 'Expenses'}
                            </button>
                        ))}
                    </div>

                    {/* Search and Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by ID or amount..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-banking-green focus:bg-white/15 transition-all"
                            />
                        </div>

                        {/* Start Date */}
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-banking-green focus:bg-white/15 transition-all"
                        />

                        {/* End Date */}
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-banking-green focus:bg-white/15 transition-all"
                        />
                    </div>

                    {/* Results Count */}
                    {(filterType !== 'ALL' || searchQuery || startDate || endDate) && (
                        <p className="text-xs text-gray-400">
                            Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
                        </p>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-sm text-gray-400">
                            <th className="px-6 py-4 font-medium">Transaction ID</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {paginatedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                    {filteredTransactions.length === 0 ? 'No transactions found.' : 'No results on this page.'}
                                </td>
                            </tr>
                        ) : (
                            paginatedTransactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="border-b border-white/5 hover:bg-white/10 transition-all cursor-default group hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <td className="px-6 py-4 font-mono text-xs text-gray-300 group-hover:text-white transition-colors">
                                        {tx.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {tx.type === 'DEPOSIT' ? (
                                                <ArrowDownCircle className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                                            ) : (
                                                <ArrowUpCircle className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                                            )}
                                            <span className={tx.type === 'DEPOSIT' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                                                {tx.type === 'DEPOSIT' ? 'Income' : 'Expense'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">
                                        <span className={tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(tx.amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 group-hover:text-gray-300 transition-colors">
                                        {new Date(tx.date || tx.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages} ({filteredTransactions.length} total)
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-all"
                            title="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                    page === currentPage
                                        ? 'bg-banking-green text-white'
                                        : 'bg-white/10 hover:bg-white/20 text-gray-400'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-all"
                            title="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
