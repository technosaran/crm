"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    Plus,
    Search,
    Filter,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const initialTasks: any[] = [];

export default function TasksPage() {
    const [tasks, setTasks] = useState(initialTasks);

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#4BC076] h-12 w-12 rounded flex items-center justify-center text-white shadow-md">
                            <CheckCircle2 size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Activities</p>
                            <h1 className="text-[24px] font-bold tracking-tight text-slate-900 leading-none">Task Management</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral flex items-center gap-2">
                            <Calendar size={14} /> View Calendar
                        </button>
                        <button className="sf-btn-primary flex items-center gap-2">
                            <Plus size={14} /> New Task
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-4 border-b border-sf-border flex items-center justify-between bg-sf-gray/20 font-bold text-slate-500">
                        <div className="flex items-center gap-4">
                            <button className="text-[13px] font-bold text-sf-blue border-b-2 border-sf-blue pb-1">All Open</button>
                            <button className="text-[13px] font-medium text-slate-500 hover:text-sf-blue">Completed</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input placeholder="Search tasks..." className="bg-white border border-sf-border rounded h-8 pl-8 pr-4 text-[12px] w-48 focus:border-sf-blue outline-none transition-all" />
                            </div>
                            <button className="p-1.5 border border-sf-border rounded hover:bg-sf-gray transition-all"><Filter size={14} /></button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="max-w-xs space-y-1">
                            <h3 className="text-[16px] font-bold text-slate-800">You're all caught up!</h3>
                            <p className="text-[12px] text-slate-500">No pending tasks found for the current filter. Take a moment to plan your next strategic move.</p>
                        </div>
                        <button className="sf-btn-primary scale-90">Assign New Task</button>
                    </div>
                </div>

                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    <div className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm">
                        <h3 className="text-[14px] font-bold text-slate-800 mb-4 pb-2 border-b border-sf-border">Productivity Insights</h3>
                        <div className="space-y-4">
                            <div className="text-center py-6">
                                <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-[11px] text-slate-500 font-medium italic">Insights will appear as you complete tasks.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#001639] to-[#0176D3] rounded-[4px] p-5 text-white shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12" />
                        <h4 className="text-[14px] font-bold mb-2">Smart Reminders</h4>
                        <p className="text-[11px] text-blue-100 leading-relaxed mb-4">Zenith Intelligence can auto-remind you of stale deals. Enable in settings.</p>
                        <button className="text-[11px] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Configure AI Rules <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
