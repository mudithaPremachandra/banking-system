// import React removed
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { OTPVerificationPage } from '../pages/OTPVerificationPage';

import { DashboardPage } from '../pages/DashboardPage';
import { DepositPage } from '../pages/DepositPage';
import { WithdrawPage } from '../pages/WithdrawPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { PresentationLanding } from '../pages/PresentationLanding';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<PresentationLanding />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/otp-verification" element={<OTPVerificationPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};
