'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationPanel } from '@/components/shared/NotificationPanel';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = useNotificationStore((state) => state.unreadCount);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group",
                    isOpen && "bg-indigo-50 text-indigo-600"
                )}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <NotificationPanel onClose={() => setIsOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};
