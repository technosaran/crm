"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, Clock, DollarSign, GripVertical } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { OpportunityStage } from '@/types/crm';
import { useGlobalStore } from '@/store/useGlobalStore';

import Link from 'next/link';

const STAGES: { id: OpportunityStage; label: string; color: string }[] = [
    { id: 'NEW', label: 'Discovery', color: 'bg-blue-500' },
    { id: 'QUALIFICATION', label: 'Qualification', color: 'bg-indigo-500' },
    { id: 'PROPOSAL', label: 'Proposal', color: 'bg-amber-500' },
    { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-purple-500' },
    { id: 'CONTRACT', label: 'Contract', color: 'bg-pink-500' },
    { id: 'CLOSED_WON', label: 'Won', color: 'bg-emerald-500' },
];

interface Deal {
    id: string;
    title: string;
    account: string;
    value: number;
    stage: OpportunityStage;
    days: number;
}

const initialDeals: Deal[] = [];

export function KanbanView() {
    const [deals, setDeals] = useState(initialDeals);
    const { currency, locale } = useGlobalStore();

    const handleDragStart = (e: React.DragEvent, dealId: string) => {
        e.dataTransfer.setData('dealId', dealId);
    };

    const onDrop = (e: React.DragEvent, targetStage: OpportunityStage) => {
        const dealId = e.dataTransfer.getData('dealId');
        const updated = deals.map(d => d.id === dealId ? { ...d, stage: targetStage } : d);
        setDeals(updated);
    };

    const allowDrop = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            {STAGES.map((stage) => {
                const stageDeals = deals.filter(d => d.stage === stage.id);
                const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

                return (
                    <div
                        key={stage.id}
                        onDragOver={allowDrop}
                        onDrop={(e) => onDrop(e, stage.id)}
                        className="min-w-[280px] w-[280px] flex flex-col gap-3"
                    >
                        <div className="flex flex-col gap-1 px-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full", stage.color)} />
                                    <h3 className="text-[13px] font-bold text-slate-700">{stage.label}</h3>
                                    <span className="text-[11px] text-slate-400 font-bold">{stageDeals.length}</span>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={14} /></button>
                            </div>
                            <div className="text-[11px] font-bold text-slate-400">
                                {formatCurrency(totalValue, currency, locale)}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-h-[500px] bg-sf-gray/30 rounded-lg p-2 border border-dashed border-sf-border/50">
                            {stageDeals.map((deal) => (
                                <motion.div
                                    key={deal.id}
                                    layoutId={deal.id}
                                    draggable
                                    onDragStart={(e: any) => handleDragStart(e, deal.id)}
                                    className="bg-white border border-sf-border rounded-[4px] p-3 shadow-sm hover:border-sf-blue cursor-grab active:cursor-grabbing group transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[150px]">
                                            {deal.account}
                                        </span>
                                        <GripVertical size={12} className="text-slate-200 group-hover:text-slate-400" />
                                    </div>
                                    <Link href={`/opportunities/${deal.id}`}>
                                        <h4 className="text-[13px] font-bold text-slate-800 leading-snug mb-3 hover:text-sf-blue cursor-pointer transition-colors">
                                            {deal.title}
                                        </h4>
                                    </Link>
                                    <div className="flex items-center justify-between">
                                        <div className="text-[12px] font-bold text-emerald-600">
                                            {formatCurrency(deal.value, currency, locale)}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <Clock size={10} />
                                            {deal.days}d
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <button className="flex items-center justify-center gap-2 py-2 text-[11px] text-slate-400 hover:text-sf-blue transition-all border border-dashed border-transparent hover:border-sf-blue rounded">
                                <Plus size={12} /> Add Deal
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
