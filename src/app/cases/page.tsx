"use client";

import React, { useState } from 'react';
import {
    LifeBuoy,
    Search,
    Plus,
    ChevronDown,
    MoreVertical,
    Filter,
    MessageSquare,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const initialCases: any[] = [];

export default function CasesPage() {
    const [cases] = useState(initialCases);

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#00a1e0] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white">
                            <LifeBuoy size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Service Cloud: Cases</p>
                            <h2 className="text-[20px] font-bold text-slate-900 leading-tight flex items-center gap-2">
                                All Open Cases <ChevronDown size={14} className="text-slate-400" />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral"><MessageSquare size={14} className="mr-2" /> Chatter</button>
                        <button className="sf-btn-primary">
                            <Plus size={14} className="mr-2" />
                            New Case
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden min-h-[400px]">
                        <div className="p-3 border-b border-sf-border bg-sf-gray/20 flex items-center justify-between">
                            <div className="text-[12px] text-slate-500 font-bold">{cases.length} cases • Sync Status: Active</div>
                            <div className="flex items-center gap-2">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <input placeholder="Search cases..." className="bg-white border border-sf-border rounded h-7 pl-9 pr-4 text-[12px] w-48 focus:border-sf-blue outline-none transition-all" />
                                </div>
                                <button className="p-1 px-2 border border-sf-border rounded hover:bg-white text-slate-500"><Filter size={14} /></button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px] border-collapse">
                                <thead className="bg-[#f8f9fb] border-b border-sf-border">
                                    <tr>
                                        <th className="p-3 w-12 text-center"><input type="checkbox" className="rounded" /></th>
                                        {['Case ID', 'Subject', 'Priority', 'Status', 'Contact', 'Created'].map(h => (
                                            <th key={h} className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">{h}</th>
                                        ))}
                                        <th className="p-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sf-border/50">
                                    {cases.length > 0 ? (
                                        cases.map((c, idx) => (
                                            // ... mapping logic remains but is unused as cases is empty
                                            <tr key={idx} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="p-20 text-center">
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="h-16 w-16 bg-sf-gray rounded-full flex items-center justify-center text-slate-300">
                                                        <LifeBuoy size={32} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[14px] font-bold text-slate-800">No active cases</h3>
                                                        <p className="text-[12px] text-slate-500">Your customer support queue is clear. New cases will appear here as they are filed.</p>
                                                    </div>
                                                    <button className="sf-btn-primary">Create Support Ticket</button>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="sf-card p-5 border-t-4 border-t-[#00a1e0]">
                        <h3 className="text-[14px] font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Clock size={16} className="text-[#00a1e0]" /> SLA Metrics
                        </h3>
                        <div className="space-y-4">
                            <p className="text-[12px] text-slate-400 italic">No data available for the current period.</p>
                        </div>
                    </div>

                    <div className="bg-[#001639] text-white p-5 rounded-[4px] shadow-lg">
                        <h3 className="text-[14px] font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" /> Resolution Assistant
                        </h3>
                        <p className="text-[11px] text-white/60 mb-6 font-medium">Connect customer data to enable AI-powered ticket resolution suggestions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
