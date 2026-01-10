'use client';

import React, { useState, useRef } from 'react';
import {
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Loader2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CsvParser } from '@/lib/import/csvParser';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImportWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any[]) => Promise<void>;
    entityName: string;
    requiredFields: string[];
}

export const ImportWizard = ({
    isOpen,
    onClose,
    onImport,
    entityName,
    requiredFields
}: ImportWizardProps) => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [validationResults, setValidationResults] = useState<{ valid: any[], invalid: any[] }>({ valid: [], invalid: [] });
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
            toast.error('Please upload a valid CSV file');
            return;
        }

        setFile(selectedFile);
        try {
            const results = await CsvParser.parse(selectedFile);
            setParsedData(results.data);

            const { valid, invalid } = CsvParser.validate(results.data, requiredFields as any);
            setValidationResults({ valid, invalid });
            setStep(2);
        } catch (error) {
            toast.error('Failed to parse CSV file');
        }
    };

    const executeImport = async () => {
        setIsImporting(true);
        try {
            await onImport(validationResults.valid);
            toast.success(`Succesfully imported ${validationResults.valid.length} ${entityName}`);
            onClose();
        } catch (error: any) {
            toast.error(`Import failed: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 font-outfit">Import {entityName}</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Step {step} of 3</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all group"
                                >
                                    <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">Drop your CSV here</p>
                                    <p className="text-sm text-slate-500 mt-1">or click to browse from your computer</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="text-left w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Required Columns</p>
                                    <div className="flex flex-wrap gap-2">
                                        {requiredFields.map(field => (
                                            <span key={field} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-600">
                                                {field}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl flex items-center gap-4">
                                    <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Validated Successfully</h4>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-500/80 font-medium">
                                            Found {validationResults.valid.length} valid rows ready for import.
                                        </p>
                                    </div>
                                </div>

                                {validationResults.invalid.length > 0 && (
                                    <div className="p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-3xl flex items-center gap-4">
                                        <div className="h-12 w-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                                            <AlertCircle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-400">Issues Detected</h4>
                                            <p className="text-xs text-rose-700 dark:text-rose-500/80 font-medium">
                                                {validationResults.invalid.length} rows contain errors and will be skipped.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="max-h-[200px] overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                                    <table className="w-full text-left text-[11px]">
                                        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-widest">
                                            <tr>
                                                {Object.keys(parsedData[0] || {}).slice(0, 4).map(key => (
                                                    <th key={key} className="px-4 py-2">{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {parsedData.slice(0, 5).map((row, i) => (
                                                <tr key={i}>
                                                    {Object.values(row).slice(0, 4).map((val: any, j) => (
                                                        <td key={j} className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                                                            {val?.toString() || '-'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {parsedData.length > 5 && (
                                        <div className="p-3 text-center text-slate-400 text-[10px] font-bold">
                                            And {parsedData.length - 5} more rows...
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        disabled={step === 1 || isImporting}
                        className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center gap-2"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>

                    {step === 2 ? (
                        <button
                            onClick={executeImport}
                            disabled={isImporting || validationResults.valid.length === 0}
                            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                            {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload size={18} />}
                            Begin Import
                        </button>
                    ) : (
                        <button
                            disabled={!file}
                            onClick={() => setStep(step + 1)}
                            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-30 transition-all flex items-center gap-2"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
