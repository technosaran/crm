'use client';

import React, { useState } from 'react';
import {
    Download,
    FileText,
    Table,
    X,
    Check,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExcelGenerator } from '@/lib/export/excelGenerator';
import { BulkOperations } from '@/lib/bulk/bulkOperations';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    data: any[];
    filename: string;
}

export const ExportDialog = ({
    isOpen,
    onClose,
    data,
    filename
}: ExportDialogProps) => {
    const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const flattened = ExcelGenerator.flattenData(data);

            if (format === 'xlsx') {
                ExcelGenerator.generate(flattened, filename);
            } else {
                BulkOperations.exportToCSV(flattened, filename);
            }

            toast.success('Export completed successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                            <Download className="h-6 w-6 text-indigo-600" />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">Export Data</h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                        Choose your preferred format for the <span className="text-indigo-600 font-bold">{data.length} records</span> selected.
                    </p>

                    <div className="mt-8 space-y-3">
                        <button
                            onClick={() => setFormat('xlsx')}
                            className={cn(
                                "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group",
                                format === 'xlsx'
                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    format === 'xlsx' ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                )}>
                                    <Table size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Excel Spreadsheet</p>
                                    <p className="text-[11px] text-slate-500 font-bold">.xlsx format (Recommended)</p>
                                </div>
                            </div>
                            {format === 'xlsx' && <Check size={20} className="text-indigo-600" />}
                        </button>

                        <button
                            onClick={() => setFormat('csv')}
                            className={cn(
                                "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group",
                                format === 'csv'
                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    format === 'csv' ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                )}>
                                    <FileText size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">CSV File</p>
                                    <p className="text-[11px] text-slate-500 font-bold">Comma separated values</p>
                                </div>
                            </div>
                            {format === 'csv' && <Check size={20} className="text-indigo-600" />}
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl flex gap-3">
                        <Sparkles size={20} className="text-amber-600 shrink-0" />
                        <p className="text-[11px] text-amber-900 dark:text-amber-400 font-medium leading-relaxed">
                            Large exports may take a few seconds to process. Please don't close this window during the operation.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        {isExporting ? "Processing..." : "Download Now"}
                        {!isExporting && <ChevronRight size={16} />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
