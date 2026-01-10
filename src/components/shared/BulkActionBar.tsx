'use client';

import React from 'react';
import {
    Trash2,
    UserPlus,
    Tag,
    Download,
    Mail,
    X,
    CheckCircle2,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionBarProps {
    selectedCount: number;
    onClear: () => void;
    onDelete?: () => void;
    onUpdateStatus?: () => void;
    onAssign?: () => void;
    onExport?: () => void;
    onEmail?: () => void;
}

export const BulkActionBar = ({
    selectedCount,
    onClear,
    onDelete,
    onUpdateStatus,
    onAssign,
    onExport,
    onEmail
}: BulkActionBarProps) => {
    if (selectedCount === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
            >
                <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-2xl shadow-indigo-500/20 border border-white/10 p-2 flex items-center justify-between gap-4 backdrop-blur-xl">
                    <div className="flex items-center gap-4 pl-4">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white font-black text-xs">
                            {selectedCount}
                        </div>
                        <span className="text-sm font-bold tracking-tight">
                            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {onEmail && (
                            <button
                                onClick={onEmail}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all group"
                                title="Send Bulk Email"
                            >
                                <Mail className="h-5 w-5 text-slate-300 group-hover:text-white" />
                            </button>
                        )}
                        {onAssign && (
                            <button
                                onClick={onAssign}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all group"
                                title="Assign Owner"
                            >
                                <UserPlus className="h-5 w-5 text-slate-300 group-hover:text-white" />
                            </button>
                        )}
                        {onUpdateStatus && (
                            <button
                                onClick={onUpdateStatus}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all group"
                                title="Update Status"
                            >
                                <Tag className="h-5 w-5 text-slate-300 group-hover:text-white" />
                            </button>
                        )}
                        {onExport && (
                            <button
                                onClick={onExport}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all group"
                                title="Export CSV"
                            >
                                <Download className="h-5 w-5 text-slate-300 group-hover:text-white" />
                            </button>
                        )}
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-2.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-xl transition-all group text-rose-500"
                                title="Delete Selected"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            onClick={onClear}
                            className="ml-2 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                            title="Clear Selection"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
