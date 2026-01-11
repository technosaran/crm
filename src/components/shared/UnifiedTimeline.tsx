'use client';

import React from 'react';
import {
    MessageSquare,
    History,
    Phone,
    Mail,
    Calendar,
    CheckSquare,
    FileText,
    Clock,
    User,
    Zap,
    ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUnifiedTimeline, TimelineItem } from '@/hooks/useUnifiedTimeline';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UnifiedTimelineProps {
    entityType: string;
    entityId: string;
}

const getIcon = (item: TimelineItem) => {
    if (item.type === 'COMMENT') return <MessageSquare className="h-4 w-4 text-indigo-500" />;
    if (item.type === 'LOG') return <History className="h-4 w-4 text-amber-500" />;

    const activityType = item.data.type;
    switch (activityType) {
        case 'CALL': return <Phone className="h-4 w-4 text-emerald-500" />;
        case 'EMAIL': return <Mail className="h-4 w-4 text-blue-500" />;
        case 'MEETING': return <Calendar className="h-4 w-4 text-purple-500" />;
        case 'TASK': return <CheckSquare className="h-4 w-4 text-rose-500" />;
        default: return <FileText className="h-4 w-4 text-slate-500" />;
    }
};

const getBgColor = (item: TimelineItem) => {
    if (item.type === 'COMMENT') return 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20';
    if (item.type === 'LOG') return 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
    return 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700';
};

export const UnifiedTimeline = ({ entityType, entityId }: UnifiedTimelineProps) => {
    const { timeline, loading } = useUnifiedTimeline(entityType, entityId);

    if (loading) {
        return (
            <div className="space-y-6 py-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
                            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-3xl w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (timeline.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                <Zap size={48} className="text-slate-200 mb-4" />
                <h3 className="text-lg font-black text-slate-800 dark:text-white font-outfit uppercase tracking-tighter">Timeline is Empty</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">No events have been logged for this record</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-0 pb-10">
            <div className="absolute left-[19px] top-6 bottom-0 w-px bg-slate-100 dark:bg-slate-800" />

            {timeline.map((item, i) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative flex gap-4 pb-8 group"
                >
                    <div className={cn(
                        "z-10 h-10 w-10 rounded-2xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                        getBgColor(item)
                    )}>
                        {getIcon(item)}
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    {item.type === 'LOG' ? 'System Update' : item.type === 'COMMENT' ? 'Team Note' : 'Activity'}
                                </span>
                                <span className="text-slate-200 dark:text-slate-800">•</span>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <User size={10} className="text-slate-400" />
                                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase">
                                    {item.data.user_profile?.full_name || 'System'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl rounded-tl-none shadow-sm group-hover:shadow-md group-hover:border-indigo-500/20 transition-all">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                {item.type === 'LOG' ? `${item.data.action} ${item.data.entity_type}` : item.data.subject || item.data.content}
                            </h4>

                            {item.type === 'LOG' && item.data.new_values && (
                                <div className="mt-2 space-y-1">
                                    {Object.entries(item.data.new_values).map(([key, val]: [string, any]) => (
                                        <div key={key} className="text-[11px] text-slate-500">
                                            <span className="font-bold text-indigo-500 uppercase tracking-tighter">{key}:</span> {JSON.stringify(val)}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {item.data.description && (
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {item.data.description}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
