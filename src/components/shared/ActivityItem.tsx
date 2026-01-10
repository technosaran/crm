'use client';

import React from 'react';
import {
    Plus,
    Settings,
    Trash2,
    Edit,
    User,
    Clock,
    Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
    log: any;
    isLast?: boolean;
}

const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
        case 'CREATE': return <Plus className="h-4 w-4 text-emerald-600" />;
        case 'UPDATE': return <Edit className="h-4 w-4 text-amber-600" />;
        case 'DELETE': return <Trash2 className="h-4 w-4 text-rose-600" />;
        case 'VIEW': return <Eye className="h-4 w-4 text-blue-600" />;
        default: return <Settings className="h-4 w-4 text-slate-600" />;
    }
};

const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
        case 'CREATE': return 'bg-emerald-50 border-emerald-100';
        case 'UPDATE': return 'bg-amber-50 border-amber-100';
        case 'DELETE': return 'bg-rose-50 border-rose-100';
        case 'VIEW': return 'bg-blue-50 border-blue-100';
        default: return 'bg-slate-50 border-slate-100';
    }
};

export const ActivityItem = ({ log, isLast }: ActivityItemProps) => {
    const timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true });

    return (
        <div className="relative flex gap-4">
            {!isLast && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />
            )}

            <div className={cn(
                "z-10 h-10 w-10 shrink-0 rounded-2xl border flex items-center justify-center shadow-sm",
                getActionColor(log.action)
            )}>
                {getActionIcon(log.action)}
            </div>

            <div className="flex-1 pb-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-800 dark:text-slate-200">
                            <span className="font-bold">{log.user_profile?.name || 'Unknown User'}</span>
                            {' '}
                            <span className="text-slate-500 font-medium">{log.action.toLowerCase()}d</span>
                            {' '}
                            <span className="font-bold text-slate-900 dark:text-white capitalize">{log.entity_type}</span>
                        </p>

                        {log.new_values && log.action === 'UPDATE' && (
                            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] font-mono leading-relaxed">
                                {Object.entries(log.new_values).map(([key, val]: [string, any]) => (
                                    <div key={key}>
                                        <span className="text-slate-400">{key}:</span> {JSON.stringify(val)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-1 rounded-lg">
                        <Clock className="h-3 w-3" />
                        {timeAgo}
                    </div>
                </div>
            </div>
        </div>
    );
};
