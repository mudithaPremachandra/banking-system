// import React removed
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, LayoutDashboard, ArrowDownCircle, ArrowUpCircle, ListOrdered, ChevronDown, CreditCard, Settings, User, Lock, Bell, Shield, FileText, HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PaymentMethodsModal } from './PaymentMethodsModal';
import { ProfileModal } from './ProfileModal';
import { SecurityModal } from './SecurityModal';
import { NotificationModal } from './NotificationModal';
import { PasswordModal } from './PasswordModal';
import { DocumentsModal } from './DocumentsModal';
import { HelpSupportModal } from './HelpSupportModal';
import { NotificationBell } from './NotificationBell';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Deposit', path: '/deposit', icon: ArrowDownCircle },
        { name: 'Withdraw', path: '/withdraw', icon: ArrowUpCircle },
        { name: 'Transfer', path: '/transfer', icon: ArrowUpCircle },
        { name: 'History', path: '/transactions', icon: ListOrdered },
    ];

    return (
        <>
            <header className="fixed top-0 inset-x-0 h-20 glass-card border-b border-white/10 z-50 flex items-center justify-between px-6 lg:px-12 transition-all duration-300">
            {/* Brand */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img src="/logo.png" alt="Chamber Bank Logo" className="w-10 h-10 rounded-xl" />
                    <h1 className="text-xl font-display font-bold tracking-tight hidden sm:block">Chamber Bank</h1>
                </Link>
            </div>

            {/* Navigation Links */}
            {user && (
                <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${isActive
                                    ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-banking-light' : ''}`} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            )}

            {/* User Actions or Login/Register */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {/* Notification Bell */}
                        <div className="relative">
                            <NotificationBell onClick={() => setIsNotificationOpen(!isNotificationOpen)} />
                            <NotificationDropdown isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-white/10 hover:bg-white/5 transition-all outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold">{user.email[0].toUpperCase()}</span>
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-medium leading-tight">{user.email}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1d2e]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-white/10 mb-2">
                                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                    <p className="text-xs text-banking-light mt-0.5">Verified Tier 1</p>
                                </div>
                                
                                <button 
                                    onClick={() => { setIsMenuOpen(false); setShowProfileModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <User className="w-4 h-4 text-blue-400" />
                                    Profile Information
                                </button>

                                <button 
                                    onClick={() => { setIsMenuOpen(false); setShowPasswordModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <Lock className="w-4 h-4 text-orange-400" />
                                    Change Password
                                </button>

                                <button 
                                    onClick={() => { setIsMenuOpen(false); setShowSecurityModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <Shield className="w-4 h-4 text-green-400" />
                                    Security & Authentication
                                </button>

                                <button 
                                    onClick={() => { setIsMenuOpen(false); setShowNotificationModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <Bell className="w-4 h-4 text-yellow-400" />
                                    Notification Preferences
                                </button>
                                
                                <button 
                                    onClick={() => { setIsMenuOpen(false); setShowPaymentModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <CreditCard className="w-4 h-4 text-indigo-400" />
                                    Payment Methods
                                </button>
                                
                                <button 
                                    onClick={() => { setIsMenuOpen(false); setShowDocumentsModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <FileText className="w-4 h-4 text-purple-400" />
                                    Statements & Documents
                                </button>

                                <button 
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <Settings className="w-4 h-4 text-gray-400" />
                                    Account Settings
                                </button>

                                <button 
                                    onClick={() => { setIsMenuOpen(false); setShowHelpModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                                    Help & Support
                                </button>

                                <div className="h-px bg-white/10 my-2" />
                                
                                <button
                                    onClick={() => { setIsMenuOpen(false); logout(); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="px-5 py-2 text-sm font-medium bg-banking-green text-white rounded-lg hover:bg-banking-light shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                            Sign In
                        </Link>
                    </div>
                )}
            </div>
        </header>
            <PaymentMethodsModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
            <SecurityModal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
            <NotificationModal isOpen={showNotificationModal} onClose={() => setShowNotificationModal(false)} />
            <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
            <DocumentsModal isOpen={showDocumentsModal} onClose={() => setShowDocumentsModal(false)} />
            <HelpSupportModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
        </>
    );
};
