import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionTable } from '../components/TransactionTable';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import type { AccountBalance, Transaction } from '../types';
import { Loader2, Clock, LogIn, RefreshCw, ArrowDownCircle, ArrowUpCircle, Send } from 'lucide-react';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { addNotification } = useNotification();
    const [balance, setBalance] = useState<AccountBalance | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [lastBalanceUpdate, setLastBalanceUpdate] = useState<Date | null>(null);
    const [lastLogin, setLastLogin] = useState<string | null>(null);
    const [sessionDuration, setSessionDuration] = useState<number>(0);
    const [trendData, setTrendData] = useState<number[]>([]);
    const [balanceChange, setBalanceChange] = useState<number>(0);

    // Live clock update
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Track session duration
    useEffect(() => {
        // Fallback: if loginTime is not set, set it now
        let loginTime = localStorage.getItem('loginTime');
        if (!loginTime || loginTime === '0') {
            loginTime = Date.now().toString();
            localStorage.setItem('loginTime', loginTime);
        }
        
        const loginTimeMs = parseInt(loginTime, 10);
        
        // Validate timestamp is reasonable (not from 1970 and not in the future)
        if (loginTimeMs > 946684800000 && loginTimeMs <= Date.now()) {
            setLastLogin(new Date(loginTimeMs).toLocaleString());
            
            // Calculate initial elapsed time
            const initialElapsed = Math.floor((Date.now() - loginTimeMs) / 1000);
            setSessionDuration(initialElapsed);
            
            // Update session duration every second
            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - loginTimeMs) / 1000);
                setSessionDuration(elapsed);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, []);

    // Generate balance trend data
    useEffect(() => {
        if (balance) {
            const generateTrendData = () => {
                const data = [];
                for (let i = 0; i < 7; i++) {
                    const variation = Math.random() * 5000 - 2500; // ±$2500
                    data.push(Math.max(balance.balance - 10000 + variation, balance.balance * 0.7));
                }
                data[6] = balance.balance; // Last day is current balance
                setTrendData(data);
                
                // Calculate change from first to last day
                const change = ((balance.balance - data[0]) / data[0]) * 100;
                setBalanceChange(change);
            };
            generateTrendData();
        }
    }, [balance?.balance]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balanceData, txData] = await Promise.all([
                    accountService.getBalance(),
                    transactionService.getRecent()
                ]);
                setBalance(balanceData);
                setTransactions(txData);
                setLastBalanceUpdate(new Date());

                // Add notifications for recent transactions
                const now = new Date();
                txData.slice(0, 3).forEach((tx) => {
                    const txDate = new Date(tx.date);
                    const minutesAgo = (now.getTime() - txDate.getTime()) / 60000;

                    // Show notification if transaction is within last 5 minutes
                    if (minutesAgo < 5) {
                        if (tx.type === 'DEPOSIT') {
                            addNotification(
                                'SUCCESS',
                                'Deposit Received',
                                `You received ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}`,
                                { transactionId: tx.id, amount: tx.amount }
                            );
                        } else {
                            addNotification(
                                'TRANSACTION',
                                'Withdrawal Processed',
                                `You withdrew ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}`,
                                { transactionId: tx.id, amount: tx.amount }
                            );
                        }
                    }
                });

                // Check for low balance (threshold: $500)
                if (balanceData.balance < 500 && balanceData.balance > 0) {
                    addNotification(
                        'LOW_BALANCE',
                        'Low Balance Alert',
                        `Your account balance is ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balanceData.balance)}. Consider depositing funds.`,
                        { balance: balanceData.balance }
                    );
                }
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addNotification]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getTimeDifference = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const formatSessionDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    };

    const maskAccountNumber = (num: string) => {
        if (num.length <= 4) return num;
        return '*'.repeat(num.length - 4) + num.slice(-4);
    };

    const getMaxBalance = () => Math.max(...trendData, balance?.balance || 0);
    const getMinBalance = () => Math.min(...trendData, balance?.balance || 0);
    const balanceRange = getMaxBalance() - getMinBalance();

    const normalizeBalance = (val: number) => {
        return balanceRange > 0 ? ((val - getMinBalance()) / balanceRange) * 100 : 50;
    };

    // Financial Insights Calculations
    const calculateFinancialInsights = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        let todaySpending = 0;
        let thisMonthIncome = 0;
        let thisMonthExpenses = 0;
        let lastMonthIncome = 0;
        let lastMonthExpenses = 0;

        transactions.forEach((tx) => {
            const txDate = new Date(tx.date);
            const txMonth = txDate.getMonth();
            const txYear = txDate.getFullYear();
            const amount = tx.amount || 0;

            // Today's spending
            if (
                txDate.toDateString() === today.toDateString() &&
                tx.type === 'WITHDRAW'
            ) {
                todaySpending += amount;
            }

            // This month's income/expenses
            if (txMonth === currentMonth && txYear === currentYear) {
                if (tx.type === 'DEPOSIT') {
                    thisMonthIncome += amount;
                } else {
                    thisMonthExpenses += amount;
                }
            }

            // Last month's income/expenses
            if (txMonth === lastMonth && txYear === lastMonthYear) {
                if (tx.type === 'DEPOSIT') {
                    lastMonthIncome += amount;
                } else {
                    lastMonthExpenses += amount;
                }
            }
        });

        // Calculate percentage changes
        const incomeChange = lastMonthIncome > 0 
            ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
            : 0;
        const expenseChange = lastMonthExpenses > 0 
            ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
            : 0;

        return {
            todaySpending,
            thisMonthIncome,
            thisMonthExpenses,
            incomeChange,
            expenseChange,
            netIncome: thisMonthIncome - thisMonthExpenses
        };
    };

    const insights = calculateFinancialInsights();

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-banking-green" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Session & Financial Insights Combined Row */}
                <div className="glass-panel rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Left Side: Session Information */}
                        <div className="p-8 border-b lg:border-b-0 lg:border-r border-white/10">
                            {/* Main Time Display */}
                            <div className="mb-8 pb-8 border-b border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-6 h-6 text-banking-green" />
                                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">Current Session</span>
                                </div>
                                <div className="text-5xl font-bold text-white mb-2">{formatTime(currentDateTime)}</div>
                                <div className="text-lg text-gray-400">{formatDate(currentDateTime)}</div>
                            </div>

                            {/* Session Details Grid */}
                            <div className="grid grid-cols-1 gap-6">
                                {/* Last Login */}
                                {lastLogin && !lastLogin.includes('1970') && (
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Login Time</p>
                                        <p className="text-sm font-semibold text-white truncate">{lastLogin}</p>
                                    </div>
                                )}

                                {/* Session Duration */}
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Session Duration</p>
                                    <p className="text-sm font-semibold text-white">{formatSessionDuration(sessionDuration)}</p>
                                </div>

                                {/* Last Balance Update */}
                                {lastBalanceUpdate && (
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Data Updated</p>
                                        <p className="text-sm font-semibold text-white">{getTimeDifference(lastBalanceUpdate)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Account Overview */}
                        <div className="p-8 flex flex-col justify-between">
                            {/* Header Section */}
                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Available Balance</p>
                                        <h2 className="text-4xl font-bold tracking-tight text-white">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: balance?.currency || 'USD' }).format(balance?.balance || 0)}
                                        </h2>
                                    </div>
                                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${balanceChange >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {balanceChange >= 0 ? '↑' : '↓'} {Math.abs(balanceChange).toFixed(1)}%
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Account Type</p>
                                        <p className="text-white font-semibold">{balance?.accountType || 'Savings'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Account Number</p>
                                        <p className="text-white font-mono font-semibold">{maskAccountNumber(balance?.accountNumber || '4532')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 7-Day Trend Chart */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3 w-full">
                                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                        Balance Trend (7 Days)
                                    </p>
                                </div>
                                <div className="flex items-center w-full">
                                    <div className="flex items-end gap-1 h-12 bg-white/5 rounded-lg p-2 w-2/3 min-w-[120px] max-w-[220px]">
                                        {trendData.map((value, index) => (
                                            <div
                                                key={index}
                                                className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500 to-banking-green transition-all hover:opacity-80 hover:shadow-lg hover:shadow-banking-green/50"
                                                style={{
                                                    height: `${normalizeBalance(value)}%`,
                                                    minHeight: '3px',
                                                    opacity: index === 6 ? 1 : 0.7
                                                }}
                                                title={new Intl.NumberFormat('en-US', { style: 'currency', currency: balance?.currency || 'USD' }).format(value)}
                                            />
                                        ))}
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <div className="text-[11px] font-medium px-2 py-1 rounded-full bg-gradient-to-r from-banking-green/20 to-cyan-500/20 text-banking-light border border-banking-green/30 flex items-center gap-2 whitespace-nowrap">
                                            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                            Active Account
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500 w-2/3 min-w-[120px] max-w-[220px]">
                                    <span>7 days ago</span>
                                    <span>Today</span>
                                </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <button
                                    onClick={() => navigate('/deposit')}
                                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 hover:border-green-400/60 hover:bg-green-500/30 transition-all group"
                                >
                                    <ArrowDownCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">Deposit</span>
                                </button>

                                <button
                                    onClick={() => navigate('/withdraw')}
                                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 hover:border-orange-400/60 hover:bg-orange-500/30 transition-all group"
                                >
                                    <ArrowUpCircle className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">Withdraw</span>
                                </button>

                                <button
                                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-500/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled
                                    title="Transfer feature coming soon"
                                >
                                    <Send className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">Transfer</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div>
                    <TransactionTable transactions={transactions} />
                </div>
            </div>
        </DashboardLayout>
    );
};
