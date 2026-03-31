import { useEffect, useRef } from 'react';
import { useNotification } from '../hooks/useNotification';
import { AlertCircle, CheckCircle, TrendingUp, X } from 'lucide-react';
import type { Notification } from '../types';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'TRANSACTION':
            return <TrendingUp className="w-4 h-4 text-blue-400" />;
        case 'LOW_BALANCE':
            return <AlertCircle className="w-4 h-4 text-yellow-400" />;
        case 'SUCCESS':
            return <CheckCircle className="w-4 h-4 text-green-400" />;
        case 'WARNING':
            return <AlertCircle className="w-4 h-4 text-red-400" />;
        default:
            return <TrendingUp className="w-4 h-4" />;
    }
};

const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
        case 'TRANSACTION':
            return 'bg-blue-500/10 border-blue-500/20';
        case 'LOW_BALANCE':
            return 'bg-yellow-500/10 border-yellow-500/20';
        case 'SUCCESS':
            return 'bg-green-500/10 border-green-500/20';
        case 'WARNING':
            return 'bg-red-500/10 border-red-500/20';
        default:
            return 'bg-white/5 border-white/10';
    }
};

export const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
    const { notifications, markAsRead, removeNotification, clearAll } = useNotification();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop: blurred + darkened dashboard behind the modal */}
            <div
                className="fixed inset-0 z-40 bg-neutral-950/50 backdrop-blur-[20px]"
                aria-hidden="true"
            />

            <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-96 rounded-2xl border border-white/10 shadow-[0_0_90px_rgba(0,255,180,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 backdrop-blur-[20px] bg-gradient-to-b from-neutral-900/95 to-neutral-800/90"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-neutral-900/80 backdrop-blur-[20px] flex items-center justify-between">
                    <h3 className="font-semibold text-white tracking-wide">Notifications</h3>
                    {notifications.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-gray-300 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-banking-green/25 via-cyan-500/10 to-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_40px_rgba(0,255,180,0.12)]">
                                <AlertCircle className="w-7 h-7 text-gray-300" />
                            </div>
                            <p className="text-sm text-gray-300">No notifications yet</p>
                            <p className="text-xs text-gray-500 mt-2">You're all caught up.</p>
                        </div>
                    ) : (
                        <div className="space-y-1 p-2">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`relative overflow-hidden p-4 border-l-4 border-transparent hover:bg-neutral-900/25 backdrop-blur-xl transition-all cursor-pointer ${
                                        !notification.read ? 'bg-neutral-900/55' : 'bg-neutral-900/35'
                                    } ${getNotificationColor(notification.type)} hover:shadow-[0_0_35px_rgba(0,255,180,0.08)]`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div
                                        aria-hidden="true"
                                        className={`absolute inset-0 bg-gradient-to-r ${
                                            notification.type === 'SUCCESS'
                                                ? 'from-green-500/10 to-transparent'
                                                : notification.type === 'LOW_BALANCE'
                                                ? 'from-yellow-400/10 to-transparent'
                                                : notification.type === 'WARNING'
                                                ? 'from-red-500/10 to-transparent'
                                                : notification.type === 'TRANSACTION'
                                                ? 'from-blue-500/10 to-transparent'
                                                : 'from-white/5 to-transparent'
                                        } opacity-0 hover:opacity-100 transition-opacity`}
                                    />
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`text-sm font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                                    {notification.title}
                                                </h4>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {getTimeAgo(notification.timestamp)}
                                            </p>
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeNotification(notification.id);
                                            }}
                                            className="p-1 hover:bg-white/10 rounded transition-colors mt-1 relative z-10"
                                        >
                                            <X className="w-3 h-3 text-gray-500 hover:text-white" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-3 border-t border-white/10 bg-neutral-900/80 backdrop-blur-[20px] text-center">
                        <p className="text-xs text-gray-400">
                            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

function getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}
