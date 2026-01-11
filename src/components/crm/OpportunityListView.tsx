"use client";

import React from 'react';
import { Opportunity, OpportunityStage } from '@/hooks/useOpportunities';
import { formatCurrency, cn } from '@/lib/utils';
import { useGlobalStore } from '@/store/useGlobalStore';
import {
    Calendar,
    MoreHorizontal,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';

interface OpportunityListViewProps {
    opportunities: Opportunity[];
    loading: boolean;
    onOpportunityClick: (opportunity: Opportunity) => void;
}

const STAGE_CONFIG: Record<OpportunityStage, { label: string; color: string; bg: string; border: string }> = {
    NEW: { label: 'New', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    QUALIFICATION: { label: 'Qualification', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    NEEDS_ANALYSIS: { label: 'Needs Analysis', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    VALUE_PROPOSITION: { label: 'Value Prop', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    PROPOSAL: { label: 'Proposal', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    NEGOTIATION: { label: 'Negotiation', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    CLOSED_WON: { label: 'Closed Won', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    CLOSED_LOST: { label: 'Closed Lost', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export function OpportunityListView({ opportunities, loading, onOpportunityClick }: OpportunityListViewProps) {
    const { currency, locale } = useGlobalStore();

    if (loading) {
        return (
            <div className="bg-white border border-sf-border rounded-[4px] overflow-hidden">
                <div className="animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-b border-sf-border last:border-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (opportunities.length === 0) {
        return (
            <div className="bg-white border border-sf-border rounded-[4px] p-20 text-center">
                <Minus size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-500 font-medium">No opportunities found match your criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-sf-border text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3 font-bold">Opportunity Name</th>
                            <th className="px-6 py-3 font-bold">Account</th>
                            <th className="px-6 py-3 font-bold">Amount</th>
                            <th className="px-6 py-3 font-bold">Stage</th>
                            <th className="px-6 py-3 font-bold text-center">Probability</th>
                            <th className="px-6 py-3 font-bold">Close Date</th>
                            <th className="px-6 py-3 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sf-border">
                        {opportunities.map((opp) => {
                            const stage = STAGE_CONFIG[opp.stage] || STAGE_CONFIG.NEW;
                            const isWon = opp.stage === 'CLOSED_WON';
                            const isLost = opp.stage === 'CLOSED_LOST';

                            return (
                                <tr
                                    key={opp.id}
                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                    onClick={() => onOpportunityClick(opp)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm font-bold text-xs shrink-0",
                                                isWon ? "bg-emerald-500" : isLost ? "bg-rose-500" : "bg-sf-blue"
                                            )}>
                                                {(opp.name || 'UN').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-sf-blue transition-colors">
                                                    {opp.name || 'Untitled Opportunity'}
                                                </p>
                                                <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
                                                    {opp.description || 'No description provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[13px] font-medium text-slate-600">
                                            {opp.account_name || 'Individual'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-[13px] font-bold",
                                                isWon ? "text-emerald-600" : "text-slate-800"
                                            )}>
                                                {formatCurrency(opp.amount, currency, locale)}
                                            </span>
                                            {opp.probability < 100 && opp.probability > 0 && (
                                                <span className="text-[10px] text-slate-400">
                                                    Weighted: {formatCurrency(opp.amount * (opp.probability / 100), currency, locale)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0",
                                            stage.bg, stage.color, stage.border
                                        )}>
                                            {stage.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        opp.probability >= 80 ? "bg-emerald-500" :
                                                            opp.probability >= 50 ? "bg-sf-blue" :
                                                                opp.probability >= 20 ? "bg-amber-500" : "bg-slate-400"
                                                    )}
                                                    style={{ width: `${opp.probability}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[11px] font-bold text-slate-700">{opp.probability}%</span>
                                                {opp.probability > 50 ? (
                                                    <TrendingUp size={10} className="text-emerald-500" />
                                                ) : opp.probability < 30 ? (
                                                    <TrendingDown size={10} className="text-rose-500" />
                                                ) : null}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-nowrap">
                                        <div className="flex items-center gap-2 text-[12px] text-slate-600">
                                            <Calendar size={14} className="text-slate-400" />
                                            {opp.expected_close_date ? new Date(opp.expected_close_date).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 px-2 hover:bg-white border border-transparent hover:border-sf-border rounded transition-all text-slate-400 hover:text-sf-blue">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-sf-border flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-medium">
                    Showing <span className="text-slate-800 font-bold">{opportunities.length}</span> opportunities
                </p>
                <div className="flex gap-2">
                    <button className="text-[11px] font-bold text-sf-blue hover:underline">Export Current View</button>
                </div>
            </div>
        </div>
    );
}
