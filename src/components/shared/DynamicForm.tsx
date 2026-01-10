'use client';

import React from 'react';
import { CustomField } from '@/hooks/useCustomFields';
import { cn } from '@/lib/utils';

interface DynamicFormProps {
    fields: CustomField[];
    values: Record<string, any>;
    onChange: (fieldId: string, value: any) => void;
    className?: string;
}

export const DynamicForm = ({
    fields,
    values,
    onChange,
    className
}: DynamicFormProps) => {
    if (fields.length === 0) return null;

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
            {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                        <span>
                            {field.label}
                            {field.is_required && <span className="text-rose-500 ml-1">*</span>}
                        </span>
                    </label>

                    {field.field_type === 'text' && (
                        <input
                            type="text"
                            value={values[field.id] || ''}
                            onChange={(e) => onChange(field.id, e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none text-[13px] transition-all"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            required={field.is_required}
                        />
                    )}

                    {field.field_type === 'number' && (
                        <input
                            type="number"
                            value={values[field.id] || ''}
                            onChange={(e) => onChange(field.id, e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none text-[13px] transition-all"
                            placeholder="0"
                            required={field.is_required}
                        />
                    )}

                    {field.field_type === 'date' && (
                        <input
                            type="date"
                            value={values[field.id] || ''}
                            onChange={(e) => onChange(field.id, e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none text-[13px] transition-all"
                            required={field.is_required}
                        />
                    )}

                    {field.field_type === 'boolean' && (
                        <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition-all">
                            <input
                                type="checkbox"
                                checked={values[field.id] === 'true' || values[field.id] === true}
                                onChange={(e) => onChange(field.id, e.target.checked)}
                                className="h-5 w-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Enabled / Active</span>
                        </label>
                    )}

                    {field.field_type === 'select' && (
                        <select
                            value={values[field.id] || ''}
                            onChange={(e) => onChange(field.id, e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none text-[13px] transition-all appearance-none"
                            required={field.is_required}
                        >
                            <option value="">Select an option...</option>
                            {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}
                </div>
            ))}
        </div>
    );
};
