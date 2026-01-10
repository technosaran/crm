"use client";

import { AccountGrid } from "@/components/accounts/AccountGrid";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Download, Settings, ChevronDown, List, Grid } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AccountsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleExport = () => {
        toast.success("Accounts data export started...");
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#7F8DE1] h-12 w-12 rounded flex items-center justify-center text-white shadow-md flex-shrink-0">
                            <Grid size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Accounts</p>
                            <h1 className="text-xl sm:text-[24px] font-bold tracking-tight text-slate-900 leading-none">
                                All Accounts
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex border border-sf-border rounded-[4px] overflow-hidden bg-white">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-2 transition-all",
                                    viewMode === 'grid' ? "bg-sf-blue text-white" : "text-slate-500 hover:bg-sf-gray"
                                )}
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-2 border-l border-sf-border transition-all",
                                    viewMode === 'list' ? "bg-sf-blue text-white" : "text-slate-500 hover:bg-sf-gray"
                                )}
                            >
                                <List size={16} />
                            </button>
                        </div>
                        <button className="sf-btn-neutral flex items-center gap-2" onClick={() => toast.info("Filter sidebar coming soon")}>
                            <Filter size={14} />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                        <button className="sf-btn-neutral" onClick={handleExport}>
                            <Download size={14} />
                        </button>
                        <button className="sf-btn-primary flex items-center gap-2">
                            <Plus size={14} />
                            New Account
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-sf-border text-[13px] text-slate-500">
                    <div className="flex items-center gap-4">
                        <span><span className="font-bold text-slate-800">24</span> items • Sorted by Account Name</span>
                        <div className="h-4 w-px bg-sf-border" />
                        <span className="flex items-center gap-1 cursor-pointer hover:text-sf-blue transition-colors">
                            Recently Viewed <ChevronDown size={12} />
                        </span>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-sf-blue transition-colors" />
                        <input
                            placeholder="Search accounts..."
                            className="bg-sf-gray border border-sf-border pl-10 pr-4 py-1.5 rounded h-8 text-sm focus:bg-white focus:border-sf-blue outline-none w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            <AccountGrid />
        </div>
    );
}
