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
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const initialReports: any[] = [];

export default function ReportsPage() {
    const [reports] = useState(initialReports);

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#54698d] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white">
                            <BarChart4 size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Analytics</p>
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
                                { label: 'Created by Me', icon: FileText, active: false },
                                { label: 'Public Reports', icon: Folder, active: false },
                            ].map((nav, i) => (
                                <button key={i} className={cn("w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded transition-all", nav.active ? "bg-sf-blue/10 text-sf-blue font-bold" : "text-slate-600 hover:bg-sf-gray")}>
                                    <nav.icon size={16} /> {nav.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-sf-border bg-sf-gray/20 flex items-center justify-between">
                        <div className="text-[13px] text-slate-500 font-bold">No reports in this collection</div>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 focus-within:text-sf-blue transition-colors" />
                            <input placeholder="Search reports..." className="bg-white border border-sf-border rounded h-8 pl-10 pr-4 text-sm focus:border-sf-blue outline-none w-64 transition-all" />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                        <div className="relative">
                            <div className="h-24 w-24 bg-sf-gray rounded-full flex items-center justify-center text-slate-200">
                                <BarChart4 size={48} />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="absolute -top-2 -right-2 h-10 w-10 bg-white border border-sf-border rounded-full flex items-center justify-center text-sf-blue shadow-sm"
                            >
                                <Star size={18} className="fill-sf-blue" />
                            </motion.div>
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="text-[16px] font-bold text-slate-800">Your insights engine is empty</h3>
                            <p className="text-[12px] text-slate-500 leading-relaxed">Connect your business data to generate real-time revenue velocity reports and conversion dashboards.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="sf-btn-primary">Create Your First Report</button>
                            <button className="sf-btn-neutral">Import Templates</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
