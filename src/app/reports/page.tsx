"use client";

import React, { useState } from 'react';
import {
    BarChart4,
    Search,
    Plus,
    Folder,
    Star,
    Clock,
    ChevronDown,
    FileText,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useGlobalStore } from '@/store/useGlobalStore';

const initialReports: any[] = [];

export default function ReportsPage() {
    const { stats, loading: analyticsLoading } = useAnalytics();
    const { currency, locale } = useGlobalStore();

    if (analyticsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <RefreshCw size={24} className="animate-spin mb-2" />
                <p className="text-sm font-bold">Generating report data...</p>
            </div>
        );
    }

    const standardReports = [
        { name: 'Monthly Revenue Pipeline', category: 'Opportunities', description: 'Cross-stage opportunity value analysis.', value: formatCurrency(stats?.pipelineValue || 0, currency, locale), count: stats?.dataCounts.opportunities },
        { name: 'Lead Conversion Insights', category: 'Leads', description: 'Conversion rate from new to qualified leads.', value: `${Math.round(stats?.conversionRate || 0)}%`, count: stats?.dataCounts.leads },
        { name: 'Average Sales Cycle', category: 'Opportunities', description: 'Days to close won from creation.', value: `${Math.round(stats?.avgSalesCycle || 0)} Days`, count: stats?.dataCounts.opportunities },
        { name: 'Win/Loss Ratio', category: 'Opportunities', description: 'Comparative analysis of closed deals.', value: `${Math.round(stats?.winRate || 0)}% Win`, count: stats?.dataCounts.opportunities },
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#54698d] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white">
                            <BarChart4 size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Analytics Intelligence</p>
                            <h2 className="text-[20px] font-bold text-slate-900 leading-tight flex items-center gap-2">
                                All Reports <ChevronDown size={14} className="text-slate-400" />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral flex items-center gap-2"><Folder size={14} /> Folders</button>
                        <button className="sf-btn-primary flex items-center gap-2">
                            <Plus size={14} /> New Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-64 shrink-0 space-y-2">
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-sf-border bg-sf-gray/20 font-bold text-[13px]">Collections</div>
                        <div className="p-2 space-y-1">
                            {[
                                { label: 'Recent', icon: Clock, active: true },
                                { label: 'Pinned', icon: Star, active: false },
                                { label: 'Standard Reports', icon: FileText, active: false },
                                { label: 'Public Reports', icon: Folder, active: false },
                            ].map((nav, i) => (
                                <button key={i} className={cn("w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded transition-all", nav.active ? "bg-sf-blue/10 text-sf-blue font-bold" : "text-slate-600 hover:bg-sf-gray")}>
                                    <nav.icon size={16} /> {nav.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-4 border-b border-sf-border bg-sf-gray/20 flex items-center justify-between">
                            <div className="text-[13px] text-slate-500 font-bold">Standard Intelligence Reports</div>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 focus-within:text-sf-blue transition-colors" />
                                <input placeholder="Search reports..." className="bg-white border border-sf-border rounded h-8 pl-10 pr-4 text-sm focus:border-sf-blue outline-none w-64 transition-all" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-sf-border">
                                        <th className="px-6 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Report Name</th>
                                        <th className="px-6 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Category</th>
                                        <th className="px-6 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Summary Info</th>
                                        <th className="px-6 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Records</th>
                                        <th className="px-6 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standardReports.map((report, i) => (
                                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-sf-gray rounded flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        <BarChart4 size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-sf-blue cursor-pointer hover:underline">{report.name}</p>
                                                        <p className="text-[11px] text-slate-500">{report.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{report.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[14px] font-black text-slate-900">{report.value}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[13px] text-slate-600 font-medium">{report.count || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-sf-blue">
                                                    <ChevronDown size={14} className="-rotate-90" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
