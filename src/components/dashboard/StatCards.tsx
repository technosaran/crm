"use client";

import React from 'react';
import {
    TrendingUp,
    Users,
    Target,
    DollarSign,
    Zap,
    ArrowUpRight,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';
import { useGlobalStore } from '@/store/useGlobalStore';

export function StatCards() {
    const { currency, locale } = useGlobalStore();

    const stats = [
        {
            label: 'Total Revenue (YTD)',
            value: 0,
            trend: '0%',
            isPositive: true,
            icon: DollarSign,
            color: 'text-[#0176D3]',
            bg: 'bg-blue-50',
            description: 'Awaiting data sync...'
        },
        {
            label: 'Open Opportunities',
            value: 0,
            trend: '0',
            isPositive: true,
            icon: Target,
            color: 'text-[#54698d]',
            bg: 'bg-slate-50',
            description: 'No active deals'
        },
        {
            label: 'Active Leads',
            value: 0,
            trend: '0%',
            isPositive: true,
            icon: Users,
            color: 'text-[#f2672a]',
            bg: 'bg-orange-50',
            description: 'List views empty'
        },
        {
            label: 'SLA Performance',
            value: '0%',
            trend: '0%',
            isPositive: true,
            icon: Zap,
            color: 'text-[#2E844A]',
            bg: 'bg-emerald-50',
            description: 'No service cases'
        }
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group sf-card p-6 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-sf-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative flex items-center justify-between mb-4">
                        <div className={cn("p-2 rounded-lg shadow-sm transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={cn(
                                "text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                                "bg-slate-50 text-slate-400"
                            )}>
                                {stat.trend}
                            </span>
                            <button className="p-1 hover:bg-sf-gray rounded text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-[22px] font-bold text-slate-800 tracking-tight">
                                {typeof stat.value === 'number' ? formatCurrency(stat.value, currency, locale) : stat.value}
                            </h3>
                            <ArrowUpRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">{stat.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
