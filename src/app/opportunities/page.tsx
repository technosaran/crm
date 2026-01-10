"use client";

import { KanbanView } from "@/components/crm/KanbanView";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Plus,
    Filter,
    RefreshCw,
    List,
    LayoutGrid,
    ChevronDown,
    Search,
    Download,
    Settings
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OpportunitiesPage() {
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

    return (
        <div className="space-y-6 pb-12">
            {/* Salesforce Object Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fc9003] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white flex-shrink-0">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Opportunities</p>
                            <h2 className="text-lg sm:text-[20px] font-bold text-slate-900 leading-tight flex items-center gap-2">
                                All Opportunities <ChevronDown size={14} className="text-slate-400" />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex border border-sf-border rounded-[4px] bg-white overflow-hidden">
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={cn("p-2 hover:bg-sf-gray border-r border-sf-border", viewMode === 'kanban' ? "bg-sf-blue text-white" : "text-slate-500")}
                            >
                                <LayoutGrid size={14} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn("p-2 hover:bg-sf-gray", viewMode === 'list' ? "bg-sf-blue text-white" : "text-slate-500")}
                            >
                                <List size={14} />
                            </button>
                        </div>
                        <button className="sf-btn-neutral hidden sm:flex" onClick={() => toast.info("Filter sidebar coming soon")}>
                            <Filter size={14} className="mr-2" />
                            Filter
                        </button>
                        <button className="sf-btn-primary flex-1 sm:flex-initial">
                            <Plus size={14} className="mr-2" />
                            New Opportunity
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-sf-border gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-[13px] text-slate-500 font-medium flex-wrap">
                        <span><span className="font-bold text-slate-800">0</span> items • Sorted by Close Date</span>
                        <div className="h-4 w-px bg-sf-border hidden sm:block" />
                        <span className="flex items-center gap-1 cursor-pointer hover:text-sf-blue">
                            Sorted by Close Date <ChevronDown size={12} />
                        </span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative group flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-sf-blue transition-colors" />
                            <input
                                placeholder="Search opportunities..."
                                className="bg-sf-gray border border-sf-border pl-10 pr-4 py-1.5 rounded h-8 text-sm focus:bg-white focus:border-sf-blue outline-none w-full sm:w-64 transition-all"
                            />
                        </div>
                        <button className="p-1 px-2 border border-sf-border rounded-[4px] hover:bg-white text-slate-500"><Download size={14} /></button>
                        <button className="p-1 px-2 border border-sf-border rounded-[4px] hover:bg-white text-slate-500"><Settings size={14} /></button>
                    </div>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <KanbanView />
            ) : (
                <div className="bg-white border border-sf-border rounded-[4px] p-12 text-center text-slate-400 font-medium italic">
                    Pipeline List View coming in next patch...
                </div>
            )}
        </div>
    );
}
