"use client";

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Settings,
    RefreshCw,
    Plus,
    LayoutGrid,
    ChevronDown,
    MoreVertical,
    Tag,
    Download,
    Mail,
    Phone,
    TrendingUp,
    Upload,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { Modal } from '@/components/shared/Modal';
import { useLeads, Lead } from '@/hooks/useLeads';
import { validateName, validateEmail, validatePhone, sanitizeString } from '@/lib/validation';
import { ConvertLeadModal } from './ConvertLeadModal';
import { BulkActionBar } from '@/components/shared/BulkActionBar';
import { ImportWizard } from '@/components/shared/ImportWizard';
import { ExportDialog } from '@/components/shared/ExportDialog';
import { Confetti } from '@/components/shared/Confetti';

export function LeadTable() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [conversionLead, setConversionLead] = useState<Lead | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Use Advanced Leads Hook with Pagination
    const {
        leads,
        loading,
        totalCount,
        filters,
        setFilters,
        createLead,
        deleteLeads,
        convertLead,
        refresh
    } = useLeads();

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (leads.length === 0) return;
        setSelectedIds(selectedIds.length === leads.length ? [] : leads.map(l => l.id));
    };

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} leads?`)) {
            await deleteLeads(selectedIds);
            setSelectedIds([]);
        }
    };

    const handleBulkImport = async (data: any[]) => {
        for (const lead of data) {
            await createLead(lead);
        }
        refresh();
    };

    const handleConvertAction = (lead: Lead) => {
        setConversionLead(lead);
    };

    const totalPages = Math.ceil(totalCount / filters.pageSize);

    return (
        <div className="flex flex-col gap-6">
            {/* Salesforce List View Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-500 h-12 w-12 shadow-xl shadow-orange-500/20 rounded-2xl flex items-center justify-center text-white shrink-0">
                            <LayoutGrid size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Lead Intelligence</span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Enterprise Object</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight font-outfit">
                                All Open Leads
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setIsImportOpen(true)}
                            className="h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                            <Upload size={16} />
                            <span className="hidden md:inline">Import</span>
                        </button>
                        <button
                            onClick={() => setIsExportOpen(true)}
                            className="h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                            <Download size={16} />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
                        <button className="sf-btn-primary h-11 px-6 shadow-lg shadow-indigo-500/20" onClick={() => setIsModalOpen(true)}>
                            <Plus size={16} className="mr-2" />
                            New Lead
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Table Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col shadow-sm relative overflow-hidden min-h-[500px]">
                    {/* Action Header */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative group w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    placeholder="Search leads..."
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-10 pl-10 pr-4 text-xs focus:border-indigo-500 outline-none transition-all shadow-sm"
                                    value={filters.search || ''}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={cn(
                                    "p-2.5 rounded-xl border transition-all",
                                    showFilters
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <Filter size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `${totalCount} Records Found`}
                            </span>
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={filters.page === 1}
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-600 dark:text-slate-400"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[11px] font-black text-slate-900 dark:text-white px-3">
                                    {filters.page} / {totalPages || 1}
                                </span>
                                <button
                                    disabled={filters.page >= totalPages}
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-600 dark:text-slate-400"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <button onClick={refresh} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-all">
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px] border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                    <th className="p-4 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                            checked={leads.length > 0 && selectedIds.length === leads.length}
                                            onChange={toggleAll}
                                            disabled={leads.length === 0}
                                        />
                                    </th>
                                    {['Lead Name', 'Company', 'Status', 'Owner', 'Source', 'Email', 'Actions'].map(h => (
                                        <th key={h} className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <AnimatePresence mode="popLayout">
                                    {leads.length > 0 ? (
                                        leads.map((lead, idx) => (
                                            <motion.tr
                                                key={lead.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={cn(
                                                    "group transition-all",
                                                    selectedIds.includes(lead.id) ? "bg-indigo-50/30 dark:bg-indigo-500/5 shadow-inner" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                                                )}
                                            >
                                                <td className="p-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                                        checked={selectedIds.includes(lead.id)}
                                                        onChange={() => toggleSelect(lead.id)}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <Link href={`/leads/${lead.id}`} className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors cursor-pointer text-sm">
                                                            {lead.first_name} {lead.last_name}
                                                        </Link>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">ID: {lead.id.split('-')[0]}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{lead.company_name || lead.company}</td>
                                                <td className="p-4">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                        lead.status === 'New' ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
                                                            lead.status === 'Working' ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                                                                lead.status === 'Nurturing' ? "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" :
                                                                    lead.status === 'Qualified' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                                                        "bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400"
                                                    )}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200 dark:border-slate-700">
                                                            {(lead.first_name || 'U')[0]}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Admin</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-500 font-bold text-xs uppercase tracking-tight">{lead.source}</td>
                                                <td className="p-4 text-indigo-600 font-bold text-xs lowercase">{lead.email}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {lead.status !== 'Qualified' && (
                                                            <button
                                                                onClick={() => handleConvertAction(lead)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-500/20"
                                                            >
                                                                <TrendingUp size={12} /> Convert
                                                            </button>
                                                        )}
                                                        <button className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400"><MoreVertical size={16} /></button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="p-20 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                                                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300">
                                                        <LayoutGrid size={40} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-slate-800 dark:text-white font-outfit">Silence in the pipeline</h3>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Ready to start the next big deal?</p>
                                                    </div>
                                                    <button className="sf-btn-primary h-11 px-8 rounded-2xl" onClick={() => setIsModalOpen(true)}>
                                                        Create First Lead
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Premium Components Integration */}
            <BulkActionBar
                selectedCount={selectedIds.length}
                onClear={() => setSelectedIds([])}
                onDelete={handleDelete}
                onExport={() => setIsExportOpen(true)}
                onAssign={() => toast.info("Bulk Assign Feature Coming Soon")}
                onEmail={() => toast.info("Mass Email Feature Coming Soon")}
            />

            <ImportWizard
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                onImport={handleBulkImport}
                entityName="Leads"
                requiredFields={['first_name', 'last_name', 'company_name', 'email']}
            />

            <ExportDialog
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                data={selectedIds.length > 0 ? leads.filter(l => selectedIds.includes(l.id)) : leads}
                filename="zenith_crm_leads"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Lead"
            >
                <LeadForm
                    onCancel={() => setIsModalOpen(false)}
                    onSuccess={async (lead) => {
                        await createLead(lead);
                        setIsModalOpen(false);
                        refresh();
                    }}
                />
            </Modal>

            <ConvertLeadModal
                isOpen={!!conversionLead}
                onClose={() => setConversionLead(null)}
                lead={conversionLead}
                onConvert={async (options) => {
                    if (conversionLead) {
                        const success = await convertLead(conversionLead.id, options);
                        if (success) {
                            setShowConfetti(true);
                            toast.success("Big Win! Lead converted to opportunity.", {
                                description: `Ready to close the deal for ${conversionLead.company_name}`
                            });
                        }
                        setConversionLead(null);
                        refresh();
                    }
                }}
            />

            <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
        </div>
    );
}

function LeadForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        source: 'Web',
        status: 'New'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        // Validation...
        if (!formData.last_name || !formData.company_name) {
            toast.error("Please fill in required fields");
            setIsSubmitting(false);
            return;
        }

        try {
            await onSuccess(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 py-4">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Lead Identity</h4>
                    <InputField
                        label="First Name"
                        value={formData.first_name}
                        onChange={v => setFormData({ ...formData, first_name: v })}
                    />
                    <InputField
                        label="Last Name"
                        required
                        value={formData.last_name}
                        onChange={v => setFormData({ ...formData, last_name: v })}
                    />
                    <InputField
                        label="Account / Company"
                        required
                        value={formData.company_name}
                        onChange={v => setFormData({ ...formData, company_name: v })}
                    />
                </div>
                <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Communication</h4>
                    <InputField
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={v => setFormData({ ...formData, email: v })}
                    />
                    <InputField
                        label="Phone Number"
                        value={formData.phone}
                        onChange={v => setFormData({ ...formData, phone: v })}
                    />
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Lead Source</label>
                        <select
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-11 px-4 text-sm outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 dark:text-slate-300"
                            value={formData.source}
                            onChange={e => setFormData({ ...formData, source: e.target.value })}
                        >
                            <option>Web</option>
                            <option>Referral</option>
                            <option>LinkedIn</option>
                            <option>Cold Outreach</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-2 font-bold text-slate-500 hover:text-slate-800">Cancel</button>
                <button
                    type="submit"
                    className="h-11 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Provision Lead'}
                </button>
            </div>
        </form>
    );
}

function InputField({ label, value, onChange, required, type = "text" }: { label: string, value: string, onChange: (v: string) => void, required?: boolean, type?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-11 px-4 text-sm outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-300"
            />
        </div>
    );
}

function FilterGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> {title}
            </h4>
            <div className="space-y-2 pl-1">
                {children}
            </div>
        </div>
    );
}
