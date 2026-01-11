"use client";

import { KanbanView } from "@/components/crm/KanbanView";
import { OpportunityListView } from "@/components/crm/OpportunityListView";
import { OpportunityModal } from "@/components/crm/OpportunityModal";
import { useOpportunities, OpportunityStage } from "@/hooks/useOpportunities";
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
    Settings,
    DollarSign
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useGlobalStore } from "@/store/useGlobalStore";

export default function OpportunitiesPage() {
    const { opportunities, loading, createOpportunity, updateOpportunity, updateStage, refresh } = useOpportunities();
    const { currency, locale } = useGlobalStore();

    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOpportunity, setEditingOpportunity] = useState<typeof opportunities[0] | null>(null);
    const [defaultStage, setDefaultStage] = useState<OpportunityStage>('NEW');
    const [searchQuery, setSearchQuery] = useState('');

    // Calculate pipeline stats
    const stats = useMemo(() => {
        const open = opportunities.filter(o => !['CLOSED_WON', 'CLOSED_LOST'].includes(o.stage));
        const won = opportunities.filter(o => o.stage === 'CLOSED_WON');
        const totalPipeline = open.reduce((sum, o) => sum + (o.amount || 0), 0);
        const totalWon = won.reduce((sum, o) => sum + (o.amount || 0), 0);
        const weightedPipeline = open.reduce((sum, o) => sum + ((o.amount || 0) * (o.probability || 0) / 100), 0);
        return {
            count: opportunities.length,
            openCount: open.length,
            wonCount: won.length,
            totalPipeline,
            totalWon,
            weightedPipeline
        };
    }, [opportunities]);

    // Filter opportunities
    const filteredOpportunities = useMemo(() => {
        if (!searchQuery.trim()) return opportunities;
        const query = searchQuery.toLowerCase();
        return opportunities.filter(o =>
            (o.name || '').toLowerCase().includes(query) ||
            o.account_name?.toLowerCase().includes(query)
        );
    }, [opportunities, searchQuery]);

    const handleOpportunityClick = (opportunity: typeof opportunities[0]) => {
        setEditingOpportunity(opportunity);
        setIsModalOpen(true);
    };

    const handleAddClick = (stage: OpportunityStage) => {
        setDefaultStage(stage);
        setEditingOpportunity(null);
        setIsModalOpen(true);
    };

    const handleNewOpportunity = () => {
        setDefaultStage('NEW');
        setEditingOpportunity(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Partial<typeof opportunities[0]>) => {
        if (editingOpportunity) {
            return await updateOpportunity(editingOpportunity.id, data);
        } else {
            return await createOpportunity({ ...data, stage: data.stage || defaultStage });
        }
    };

    const handleStageChange = async (id: string, stage: OpportunityStage) => {
        await updateStage(id, stage);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fc9003] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white flex-shrink-0">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Opportunities</p>
                            <h2 className="text-lg sm:text-[20px] font-bold text-slate-900 leading-tight flex items-center gap-2">
                                Sales Pipeline <ChevronDown size={14} className="text-slate-400" />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={refresh}
                            className="sf-btn-neutral"
                            disabled={loading}
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        </button>
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
                        <button onClick={handleNewOpportunity} className="sf-btn-primary flex-1 sm:flex-initial">
                            <Plus size={14} className="mr-2" />
                            New Opportunity
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-sf-border gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-[13px] text-slate-500 font-medium flex-wrap">
                        <span><span className="font-bold text-slate-800">{stats.openCount}</span> open deals</span>
                        <div className="h-4 w-px bg-sf-border hidden sm:block" />
                        <span className="flex items-center gap-1">
                            <DollarSign size={12} className="text-emerald-500" />
                            <span className="font-bold text-emerald-600">{formatCurrency(stats.totalPipeline, currency, locale)}</span>
                            <span className="text-slate-400">pipeline</span>
                        </span>
                        <div className="h-4 w-px bg-sf-border hidden sm:block" />
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-sf-blue">{formatCurrency(stats.weightedPipeline, currency, locale)}</span>
                            <span className="text-slate-400">weighted</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative group flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-sf-blue transition-colors" />
                            <input
                                placeholder="Search opportunities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-sf-gray border border-sf-border pl-10 pr-4 py-1.5 rounded h-8 text-sm focus:bg-white focus:border-sf-blue outline-none w-full sm:w-64 transition-all"
                            />
                        </div>
                        <button
                            className="p-1 px-2 border border-sf-border rounded-[4px] hover:bg-white text-slate-500"
                            onClick={() => {
                                import('@/lib/export').then(({ exportToCSV }) => {
                                    exportToCSV(opportunities, 'zenith_pipeline_export');
                                });
                            }}
                        >
                            <Download size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Pipeline Stats Cards */}
            {stats.count > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pipeline</p>
                        <p className="text-[20px] font-bold text-slate-800 mt-1">{formatCurrency(stats.totalPipeline, currency, locale)}</p>
                    </div>
                    <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weighted Pipeline</p>
                        <p className="text-[20px] font-bold text-sf-blue mt-1">{formatCurrency(stats.weightedPipeline, currency, locale)}</p>
                    </div>
                    <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Closed Won</p>
                        <p className="text-[20px] font-bold text-emerald-600 mt-1">{formatCurrency(stats.totalWon, currency, locale)}</p>
                    </div>
                    <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Win Rate</p>
                        <p className="text-[20px] font-bold text-slate-800 mt-1">
                            {stats.count > 0 ? Math.round((stats.wonCount / stats.count) * 100) : 0}%
                        </p>
                    </div>
                </div>
            )}

            {viewMode === 'kanban' ? (
                <KanbanView
                    opportunities={filteredOpportunities}
                    loading={loading}
                    onStageChange={handleStageChange}
                    onOpportunityClick={handleOpportunityClick}
                    onAddClick={handleAddClick}
                />
            ) : (
                <OpportunityListView
                    opportunities={filteredOpportunities}
                    loading={loading}
                    onOpportunityClick={handleOpportunityClick}
                />
            )}

            {/* Opportunity Modal */}
            <OpportunityModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingOpportunity(null);
                }}
                opportunity={editingOpportunity}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
