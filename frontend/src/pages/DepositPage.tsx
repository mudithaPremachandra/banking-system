import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { DepositForm } from '../components/DepositForm';
import { BalanceCard } from '../components/BalanceCard';
import { accountService } from '../services/accountService';

export const DepositPage = () => {
    const [balance, setBalance] = useState(0);

    const fetchBalance = async () => {
        try {
            const data = await accountService.getBalance();
            setBalance(data.balance);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-2xl font-bold tracking-tight">Deposit</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <DepositForm onSuccess={fetchBalance} />
                    <BalanceCard balance={balance} currency="LKR" showQuickActions={false} />
                </div>
            </div>
        </DashboardLayout>
    );
};
