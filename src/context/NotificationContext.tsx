import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Notification, NotificationType } from '../types';

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (
        type: NotificationType,
        title: string,
        message: string,
        data?: Notification['data']
    ) => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback(
        (type: NotificationType, title: string, message: string, data?: Notification['data']) => {
            const id = Date.now().toString();
            const notification: Notification = {
                id,
                type,
                title,
                message,
                timestamp: new Date(),
                read: false,
                data,
            };

            setNotifications((prev) => [notification, ...prev]);

            // Auto-remove after 5 seconds (if not a warning or low balance)
            if (type !== 'WARNING' && type !== 'LOW_BALANCE') {
                setTimeout(() => {
                    removeNotification(id);
                }, 5000);
            }
        },
        []
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};
