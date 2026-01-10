'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNotificationStore } from '@/store/notificationStore';
import { X, Check, Bell, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NotificationPanelProps {
    onClose: () => void;
}

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
    const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-[100] overflow-hidden"
        >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
                        Notifications
                    </h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-indigo-500"
                        title="Mark all as read"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Bell className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">No Notifications</p>
                        <p className="text-xs text-slate-500 mt-1">We'll notify you when something important happens.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative",
                                    !n.isRead && "bg-indigo-50/30 dark:bg-indigo-500/5"
                                )}
                            >
                                {!n.isRead && (
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full" />
                                )}

                                <div className="flex gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border border-white dark:border-slate-700 shadow-sm",
                                        n.type === 'error' ? "bg-rose-50 text-rose-500" :
                                            n.type === 'warning' ? "bg-amber-50 text-amber-500" :
                                                "bg-indigo-50 text-indigo-500"
                                    )}>
                                        <Bell className="h-4 w-4" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate">
                                                {n.title}
                                            </p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight shrink-0 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {n.message}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between">
                                            {n.href && (
                                                <Link
                                                    href={n.href}
                                                    onClick={onClose}
                                                    className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"
                                                >
                                                    View Details <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            )}
                                            {!n.isRead && (
                                                <button
                                                    onClick={() => markAsRead(n.id)}
                                                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-tighter"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={clearNotifications}
                        className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                    >
                        Clear All History
                    </button>
                </div>
            )}
        </motion.div>
    );
};
