import { useNavigate } from 'react-router-dom';
import { ArrowDownCircle, ArrowUpCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BalanceCardProps {
    balance: number;
    currency: string;
    accountType?: string;
    accountNumber?: string;
    showQuickActions?: boolean;
}

export const BalanceCard = ({
    balance,
    currency,
    accountType = 'Savings',
    accountNumber = '4532',
    showQuickActions = true
}: BalanceCardProps) => {
    const navigate = useNavigate();
    const [trendData, setTrendData] = useState<number[]>([]);
    const [balanceChange, setBalanceChange] = useState<number>(0);

    // Show flat trend (no real transaction data available in this context)
    useEffect(() => {
        setTrendData(new Array(7).fill(balance));
        setBalanceChange(0);
    }, [balance]);

    const maskAccountNumber = (num: string) => {
        if (num.length <= 4) return num;
        return '*'.repeat(num.length - 4) + num.slice(-4);
    };

    const getMaxBalance = () => Math.max(...trendData, balance);
    const getMinBalance = () => Math.min(...trendData, balance);
    const balanceRange = getMaxBalance() - getMinBalance();

    // Normalize balance data for chart (0-100 scale)
    const normalizeBalance = (val: number) => {
        if (balanceRange === 0) return 50;
        return ((val - getMinBalance()) / balanceRange) * 100;
    };

    return (
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-white/10">
            {/* Animated gradient background */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-banking-green/40 via-cyan-500/20 to-transparent rounded-full blur-3xl -mt-20 -mr-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl -mb-20 -ml-20"></div>

            <div className="relative z-10">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Available Balance</p>
                        <h1 className="text-5xl font-bold tracking-tight text-white">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(balance)}
                        </h1>
                    </div>
                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${balanceChange >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {balanceChange >= 0 ? '↑' : '↓'} {isFinite(balanceChange) ? Math.abs(balanceChange).toFixed(1) : '0.0'}%
                    </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Account Type</p>
                        <p className="text-white font-semibold">{accountType}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Account Number</p>
                        <p className="text-white font-mono font-semibold">{maskAccountNumber(accountNumber)}</p>
                    </div>
                </div>

                {/* 7-Day Trend Chart */}
                <div className={`${showQuickActions ? 'mb-8' : 'mb-4'}`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                            Balance Trend (7 Days)
                        </p>
                        <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-banking-green/20 to-cyan-500/20 text-banking-light border border-banking-green/30 flex items-center gap-2 whitespace-nowrap">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Active Account
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-1 h-20 bg-white/5 rounded-lg p-2">
                        {trendData.map((value, index) => (
                            <div
                                key={index}
                                className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500 to-banking-green transition-all hover:opacity-80 hover:shadow-lg hover:shadow-banking-green/50"
                                style={{
                                    height: `${normalizeBalance(value)}%`,
                                    minHeight: '4px',
                                    opacity: index === 6 ? 1 : 0.7
                                }}
                                title={new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>7 days ago</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                {showQuickActions && (
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => navigate('/deposit')}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 hover:border-green-400/60 hover:bg-green-500/30 transition-all group"
                        >
                            <ArrowDownCircle className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">Deposit</span>
                        </button>

                        <button
                            onClick={() => navigate('/withdraw')}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 hover:border-orange-400/60 hover:bg-orange-500/30 transition-all group"
                        >
                            <ArrowUpCircle className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">Withdraw</span>
                        </button>

                        <button
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-500/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                            title="Transfer feature coming soon"
                        >
                            <Send className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">Transfer</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
