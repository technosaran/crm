"use client";

import React from 'react';
import {
    Building2,
    Plus,
    Filter,
    ArrowRight,
    Globe,
    Users,
    DollarSign,
    MapPin,
    MoreVertical,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Account } from '@/hooks/useAccounts';

import Link from 'next/link';

interface AccountGridProps {
    accounts: Account[];
    loading: boolean;
    onAccountClick: (account: Account) => void;
    onDelete: (ids: string[]) => void;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    viewMode: 'grid' | 'list';
}

const typeColors: Record<Account['type'], string> = {
    CUSTOMER: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    PROSPECT: 'bg-blue-50 text-blue-600 border-blue-200',
    PARTNER: 'bg-purple-50 text-purple-600 border-purple-200',
    VENDOR: 'bg-orange-50 text-orange-600 border-orange-200',
    COMPETITOR: 'bg-red-50 text-red-600 border-red-200',
    OTHER: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function AccountGrid({
    accounts,
    loading,
    onAccountClick,
    onDelete,
    selectedIds,
    onSelectionChange,
    viewMode
}: AccountGridProps) {
    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const formatCurrency = (value: number | null) => {
        if (!value) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-sf-gray/50 rounded-[4px] animate-pulse" />
                ))}
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-sf-border rounded-[4px] p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 lg:col-span-2"
                    >
                        <div className="h-16 w-16 bg-[#7F8DE1]/10 text-[#7F8DE1] rounded-full flex items-center justify-center">
                            <Building2 size={32} />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-[16px] font-bold text-slate-800">No Corporate Accounts found</h3>
                            <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                                Track organizations you do business with. Accounts allow you to group contacts and deals under a single corporate entity.
                            </p>
                        </div>
                    </motion.div>

                    <div className="bg-[#001639] text-white p-6 rounded-[4px] shadow-lg flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                        <div>
                            <h4 className="text-[15px] font-bold mb-3">Enterprise Connect</h4>
                            <p className="text-[12px] text-white/60 leading-relaxed mb-6">
                                Zenith Intelligence can auto-enrich your accounts with firmographic data like revenue, headcount, and tech stack.
                            </p>
                        </div>
                        <button className="text-[12px] font-bold flex items-center gap-1 group hover:gap-2 transition-all text-[#00A1E0]">
                            Learn about Enrichment <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] border-collapse">
                        <thead className="bg-[#f8f9fb] border-b border-sf-border">
                            <tr>
                                <th className="p-3 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                        checked={accounts.length > 0 && selectedIds.length === accounts.length}
                                        onChange={() => onSelectionChange(selectedIds.length === accounts.length ? [] : accounts.map(a => a.id))}
                                    />
                                </th>
                                <th className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">Account Name</th>
                                <th className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">Type</th>
                                <th className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">Industry</th>
                                <th className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">Revenue</th>
                                <th className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">Location</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sf-border/50">
                            {accounts.map((account) => (
                                <motion.tr
                                    key={account.id}
                                    layout
                                    className={cn(
                                        'group transition-all cursor-pointer',
                                        selectedIds.includes(account.id) ? 'bg-sf-blue/5' : 'hover:bg-sf-gray/40'
                                    )}
                                    onClick={() => onAccountClick(account)}
                                >
                                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="rounded"
                                            checked={selectedIds.includes(account.id)}
                                            onChange={(e) => toggleSelect(account.id, e as any)}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-[#7F8DE1]/10 flex items-center justify-center text-[#7F8DE1] font-bold text-[10px]">
                                                {account.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <Link href={`/accounts/${account.id}`} className="font-bold text-sf-blue hover:underline">{account.name}</Link>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border', typeColors[account.type])}>
                                            {account.type}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-600">{account.industry || '-'}</td>
                                    <td className="p-3 text-slate-600 font-medium">{formatCurrency(account.annual_revenue)}</td>
                                    <td className="p-3 text-slate-500">
                                        {account.billing_city && account.billing_country
                                            ? `${account.billing_city}, ${account.billing_country}`
                                            : account.billing_country || '-'}
                                    </td>
                                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                        <button className="p-1 px-2 hover:bg-white rounded transition-all text-slate-400 opacity-0 group-hover:opacity-100">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div className="space-y-6">
            {selectedIds.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-sf-blue/5 border border-sf-blue/20 rounded-[4px] p-3 flex items-center justify-between"
                >
                    <span className="text-[13px] font-bold text-sf-blue">{selectedIds.length} account(s) selected</span>
                    <button
                        onClick={() => onDelete(selectedIds)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[12px] font-bold"
                    >
                        <Trash2 size={14} /> Delete Selected
                    </button>
                </motion.div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account, idx) => (
                    <motion.div
                        key={account.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onAccountClick(account)}
                        className={cn(
                            'bg-white border rounded-[4px] p-5 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-sf-blue/30 group relative',
                            selectedIds.includes(account.id) ? 'border-sf-blue bg-sf-blue/5' : 'border-sf-border'
                        )}
                    >
                        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="checkbox"
                                className="rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                checked={selectedIds.includes(account.id)}
                                onChange={(e) => toggleSelect(account.id, e as any)}
                            />
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-12 w-12 rounded-lg bg-[#7F8DE1]/10 flex items-center justify-center text-[#7F8DE1] font-bold text-sm shrink-0">
                                {account.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <Link href={`/accounts/${account.id}`} className="text-[15px] font-bold text-slate-800 truncate group-hover:text-sf-blue transition-colors block">
                                    {account.name}
                                </Link>
                                <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1', typeColors[account.type])}>
                                    {account.type}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 text-[12px]">
                            {account.industry && (
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Building2 size={14} className="text-slate-400" />
                                    <span>{account.industry}</span>
                                </div>
                            )}
                            {account.website && (
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Globe size={14} className="text-slate-400" />
                                    <span className="truncate">{account.website.replace(/^https?:\/\//, '')}</span>
                                </div>
                            )}
                            {(account.billing_city || account.billing_country) && (
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>
                                        {account.billing_city && account.billing_country
                                            ? `${account.billing_city}, ${account.billing_country}`
                                            : account.billing_country || account.billing_city}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-sf-border">
                            <div className="flex items-center gap-1 text-slate-500">
                                <DollarSign size={14} />
                                <span className="text-[12px] font-bold">{formatCurrency(account.annual_revenue)}</span>
                            </div>
                            {account.number_of_employees && (
                                <div className="flex items-center gap-1 text-slate-500">
                                    <Users size={14} />
                                    <span className="text-[12px] font-bold">{account.number_of_employees}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
