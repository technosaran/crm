import { create } from 'zustand';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    href?: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substring(7),
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        };
    }),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
    })),

    clearNotifications: () => set({
        notifications: [],
        unreadCount: 0,
    }),
}));
