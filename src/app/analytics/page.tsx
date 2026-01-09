"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Users,
    CreditCard,
    Clock,
    Download,
    Calendar,
    Filter,
    BarChart3,
    Sparkles,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store/useGlobalStore';

export default function AnalyticsPage() {
    const { currency, locale } = useGlobalStore();

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#4BC076] h-12 w-12 rounded flex items-center justify-center text-white shadow-md">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Analytics</p>
                            <h1 className="text-[24px] font-bold tracking-tight text-slate-900 leading-none">
                                Performance Insights
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral flex items-center gap-2">
                            <Calendar size={14} />
                            All Time
                        </button>
                        <button className="sf-btn-neutral" disabled>
                            <Filter size={14} />
                        </button>
                        <button className="sf-btn-primary flex items-center gap-2" disabled>
                            <Download size={14} />
                            Export Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty Context Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Customer LTV', icon: Users, color: 'text-sf-blue', bg: 'bg-sf-blue/10' },
                    { label: 'Avg. CAC', icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Retention Rate', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Sales Cycle', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm opacity-60">
                        <div className="flex items-center justify-between mb-3">
                            <div className={cn("p-2 rounded", stat.bg, stat.color)}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-[20px] font-bold mt-1 text-slate-300">No Data</h3>
                    </div>
                ))}
            </div>

            {/* Empty State Centerpiece */}
            <div className="bg-white border border-sf-border rounded-[4px] p-20 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                    <div className="h-24 w-24 bg-sf-gray rounded-full flex items-center justify-center text-slate-200">
                        <BarChart3 size={48} />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-1 -right-1 h-10 w-10 bg-[#001639] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    >
                        <Search size={16} />
                    </motion.div>
                </div>

                <div className="max-w-md space-y-2">
                    <h2 className="text-[20px] font-black text-slate-800 tracking-tight">Analytics Engine Offline</h2>
                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        To visualize revenue trends and pipeline velocity, connect your Zenith CRM instance to a live database or import historical records.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="sf-btn-primary px-8">Connect Data Source</button>
                    <button className="sf-btn-neutral px-8">Import Mock Dataset</button>
                </div>
            </div>

            {/* Intelligence Card (Preserved Aesthetic) */}
            <div className="bg-gradient-to-r from-sf-blue to-indigo-600 rounded-[4px] p-6 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Sparkles size={120} />
                </div>
                <div className="flex items-start gap-5 relative z-10">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                        <Sparkles size={24} className="text-amber-300 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[16px] font-extrabold tracking-tight">Zenith Intelligence is Ready</h4>
                        <p className="text-[13px] text-blue-50/80 max-w-2xl leading-relaxed">
                            Once data begins flowing, ZI will automatically identify churn patterns, predict deal closure dates, and suggest optimal follow-up times for your SDR team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
