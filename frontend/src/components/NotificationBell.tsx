import { Bell } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

interface NotificationBellProps {
    onClick: () => void;
}

export const NotificationBell = ({ onClick }: NotificationBellProps) => {
    const { notifications } = useNotification();
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-lg hover:bg-white/10 transition-all outline-none group"
            title="Notifications"
        >
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            
            {/* Badge Counter */}
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </div>
            )}
        </button>
    );
};
