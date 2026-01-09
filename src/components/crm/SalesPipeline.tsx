"use client";

import React, { useState } from 'react';
import {
    Plus,
    MoreHorizontal,
    ChevronRight,
    TrendingUp,
    FileText,
    UserPlus,
    History,
    type LucideIcon
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalStore } from '@/store/useGlobalStore';
import { toast } from 'sonner';

const stages = [
    { id: 'new', title: 'New', status: 'complete' },
    { id: 'qualify', title: 'Qualify', status: 'complete' },
    { id: 'propose', title: 'Proposal', status: 'current' },
    { id: 'negotiate', title: 'Negotiate', status: 'incomplete' },
    { id: 'contract', title: 'Contracting', status: 'incomplete' },
    { id: 'closed', title: 'Closed', status: 'incomplete' },
];

interface TimelineItem {
    id: number;
    type: string;
    title: string;
    date: string;
    user: string;
    icon: LucideIcon;
    iconBg: string;
}

const timeline: TimelineItem[] = [];

export function SalesPipeline() {
    const { locale, currency } = useGlobalStore();
    const [activeTab, setActiveTab] = useState('Activity');

    const handleMarkComplete = () => {
        toast.success('Opportunity stage updated successfully!');
    };

    return (
        <div className="space-y-4">
            {/* Salesforce Record Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-4 flex flex-col gap-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fc9003] h-12 w-12 rounded flex items-center justify-center text-white shadow-md">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <nav className="text-[11px] text-slate-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                                Opportunities <ChevronRight size={10} />
                            </nav>
                            <h1 className="text-[20px] font-bold leading-tight text-slate-900">Opportunity Name</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral">Edit</button>
                        <button className="sf-btn-neutral">Delete</button>
                        <button className="sf-btn-primary" onClick={handleMarkComplete}>Mark Stage as Complete</button>
                    </div>
                </div>

                {/* The ICONIC Salesforce Path Component */}
                <div className="flex items-center w-full overflow-hidden rounded-full bg-sf-gray h-9 border border-sf-border p-0.5">
                    {stages.map((stage, idx) => (
                        <div
                            key={stage.id}
                            className={cn(
                                "flex-1 flex items-center justify-center text-[12px] font-bold h-full relative transition-all cursor-pointer",
                                stage.status === 'complete' && "bg-[#2E844A] text-white",
                                stage.status === 'current' && "bg-[#0176D3] text-white",
                                stage.status === 'incomplete' && "bg-sf-gray text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <span className="z-10">{stage.title}</span>
                            <div
                                className={cn(
                                    "absolute right-[-16px] top-0 bottom-0 w-[16px] z-20",
                                    stage.status === 'complete' && "bg-[#2E844A]",
                                    stage.status === 'current' && "bg-[#0176D3]",
                                    stage.status === 'incomplete' && "bg-sf-gray"
                                )}
                                style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Details & Related */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden">
                        <div className="flex border-b border-sf-border bg-sf-gray/30">
                            {['Details', 'Related Lists', 'Intelligence'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-6 py-3 text-[13px] font-bold transition-all",
                                        activeTab === tab ? "border-b-2 border-sf-blue text-sf-blue bg-white" : "text-slate-500 hover:text-sf-blue"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {activeTab === 'Details' || activeTab === 'Activity' ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid grid-cols-2 gap-y-8"
                                    >
                                        {[
                                            { label: 'Amount', value: formatCurrency(0, currency, locale) },
                                            { label: 'Close Date', value: '---' },
                                            { label: 'Account Name', value: '---' },
                                            { label: 'Opportunity Owner', value: '---' },
                                            { label: 'Probability', value: '0%' },
                                            { label: 'Stage', value: 'New' },
                                            { label: 'Lead Source', value: '---' },
                                            { label: 'Primary Contact', value: '---' },
                                        ].map((field, i) => (
                                            <div key={i} className="group border-b border-transparent hover:border-sf-border pb-1 pr-4 transition-all">
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide mb-1 flex items-center justify-between">
                                                    {field.label}
                                                    <span className="hidden group-hover:block text-sf-blue cursor-pointer">✎</span>
                                                </p>
                                                <p className="text-[14px] font-semibold text-slate-800">
                                                    {field.value}
                                                </p>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div key="other" className="py-12 text-center text-slate-500 italic">
                                        More content loading...
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm p-4">
                        <h3 className="font-bold text-[15px] mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-amber-500" />
                            Notes & Attachments (0)
                        </h3>
                        <button className="w-full py-8 border-2 border-dashed border-sf-border rounded-lg text-slate-400 hover:border-sf-blue hover:text-sf-blue transition-all flex flex-col items-center gap-2">
                            <Plus size={24} />
                            <span className="text-sm font-medium">Upload Files or Drop Here</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Activity Timeline */}
                <div className="space-y-4">
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm">
                        <div className="flex border-b border-sf-border bg-sf-gray/30">
                            <button className="flex-1 py-3 text-[13px] font-bold border-b-2 border-sf-blue text-sf-blue bg-white">Activity</button>
                            <button className="flex-1 py-3 text-[13px] font-medium text-slate-500 hover:text-sf-blue">Chatter</button>
                        </div>

                        <div className="p-4 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <button className="p-2 rounded-full border border-sf-border text-sf-blue hover:bg-sf-gray">
                                    <History size={16} />
                                </button>
                                <button className="flex-1 bg-white border border-sf-border rounded-full h-9 flex items-center px-4 text-[12px] text-slate-500 hover:bg-sf-gray transition-all cursor-text">
                                    Log a call, task, or meeting...
                                </button>
                            </div>

                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-z-10 before:h-full before:w-0.5 before:bg-sf-border">
                                {timeline.length > 0 ? (
                                    timeline.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="relative flex items-start gap-4"
                                        >
                                            <div className={cn(
                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-white",
                                                item.iconBg
                                            )}>
                                                <item.icon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-[13px] font-bold text-sf-blue hover:underline cursor-pointer truncate">
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{item.date}</span>
                                                </div>
                                                <p className="text-[12px] text-slate-600 line-clamp-1">
                                                    Performed by <span className="font-semibold">{item.user}</span>
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-[13px] font-medium text-slate-500 italic">No past activity</p>
                                        <p className="text-[11px] text-slate-400 mt-1">Updates will appear here dynamically</p>
                                    </div>
                                )}
                            </div>

                            <button className="w-full mt-4 text-[12px] font-bold text-sf-blue hover:underline py-2 border-t border-sf-border">
                                View Full History
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm p-4">
                        <h3 className="font-bold text-[15px] mb-4 flex items-center gap-2">
                            <UserPlus size={18} className="text-indigo-500" />
                            Contact Roles (0)
                        </h3>
                        <div className="text-center py-6">
                            <p className="text-[12px] text-slate-500 italic">No contacts associated</p>
                        </div>
                        <button className="w-full mt-4 sf-btn-neutral">Add Relationship</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
