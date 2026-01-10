'use client';

import React from 'react';
import {
    Phone,
    Mail,
    Calendar,
    CheckSquare,
    FileText,
    User,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
    type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
    subject: string;
    user: string;
    time: string;
    isLast?: boolean;
}

const activityIcons = {
    CALL: Phone,
    EMAIL: Mail,
    MEETING: Calendar,
    TASK: CheckSquare,
    NOTE: FileText,
};

const activityColors = {
    CALL: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    EMAIL: 'bg-blue-50 text-blue-600 border-blue-100',
    MEETING: 'bg-purple-50 text-purple-600 border-purple-100',
    TASK: 'bg-amber-50 text-amber-600 border-amber-100',
    NOTE: 'bg-slate-50 text-slate-600 border-slate-100',
};

const ActivityItem = ({ type, subject, user, time, isLast }: ActivityItemProps) => {
    const Icon = activityIcons[type];

    return (
        <div className="flex gap-4 group relative">
            {!isLast && (
                <div className="absolute left-[19px] top-[40px] bottom-[-10px] w-0.5 bg-slate-100 dark:bg-slate-800" />
            )}

            <div className={cn(
                "h-10 w-10 flex items-center justify-center rounded-2xl border shrink-0 z-10 transition-transform group-hover:scale-110",
                activityColors[type]
            )}>
                <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 pb-6 min-w-0">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                            {subject}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            {time}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="h-3 w-3 text-slate-400" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">{user}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ActivityFeed = () => {
    // Mock activity data
    const activities: ActivityItemProps[] = [
        { type: 'CALL', subject: 'Discovery call with SpaceX', user: 'Alex Thompson', time: '10m ago' },
        { type: 'EMAIL', subject: 'Sent proposal to Tesla Inc.', user: 'Sarah Chen', time: '2h ago' },
        { type: 'MEETING', subject: 'Product demo for NASA', user: 'Michael Ross', time: '5h ago' },
        { type: 'TASK', subject: 'Follow up with Stark Industries', user: 'Admin', time: '1d ago' },
        { type: 'NOTE', subject: 'Internal brainstorming session', user: 'Elena Rodriguez', time: '1d ago' },
    ];

    return (
        <div className="mt-2 pr-2">
            {activities.map((activity, index) => (
                <ActivityItem
                    key={index}
                    {...activity}
                    isLast={index === activities.length - 1}
                />
            ))}
        </div>
    );
};
