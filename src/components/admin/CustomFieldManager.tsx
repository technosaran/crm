'use client';

import React, { useState } from 'react';
import {
    Plus,
    Trash2,
    Settings2,
    GripVertical,
    Type,
    Hash,
    Calendar,
    CheckSquare,
    List,
    Save,
    X
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useCustomFields, CustomFieldType } from '@/hooks/useCustomFields';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CustomFieldManagerProps {
    entityType: string;
}

const fieldTypes: { type: CustomFieldType; icon: any; label: string }[] = [
    { type: 'text', icon: Type, label: 'Text Input' },
    { type: 'number', icon: Hash, label: 'Number' },
    { type: 'date', icon: Calendar, label: 'Date' },
    { type: 'boolean', icon: CheckSquare, label: 'Checkbox' },
    { type: 'select', icon: List, label: 'Dropdown' },
];

export const CustomFieldManager = ({ entityType }: CustomFieldManagerProps) => {
    const { fields, loading, refresh } = useCustomFields(entityType);
    const [isAdding, setIsAdding] = useState(false);
    const [newField, setNewField] = useState({
        label: '',
        field_type: 'text' as CustomFieldType,
        is_required: false,
        options: [] as string[]
    });
    const supabase = createClient();

    const handleAddField = async () => {
        if (!newField.label) return;

        try {
            const name = newField.label.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
            const { error } = await supabase
                .from('custom_fields')
                .insert([{
                    ...newField,
                    name,
                    entity_type: entityType,
                    order_index: fields.length
                }]);

            if (error) throw error;

            toast.success('Field added successfully');
            setIsAdding(false);
            setNewField({ label: '', field_type: 'text', is_required: false, options: [] });
            refresh();
        } catch (error: any) {
            toast.error(`Failed to add field: ${error.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all stored data for this field.')) return;

        const { error } = await supabase.from('custom_fields').delete().eq('id', id);
        if (error) {
            toast.error('Failed to delete field');
        } else {
            toast.success('Field removed');
            refresh();
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white font-outfit">Custom Fields</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configure {entityType.toLowerCase()} attributes</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={14} /> Add New Field
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="py-12 flex justify-center">
                        <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {fields.map((field) => (
                            <div
                                key={field.id}
                                className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400">
                                        {fieldTypes.find(f => f.type === field.field_type)?.icon({ size: 18 })}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{field.label}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                            {field.field_type} {field.is_required && <span className="text-rose-500 border-l border-slate-200 ml-2 pl-2">Required</span>}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(field.id)}
                                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        {fields.length === 0 && !isAdding && (
                            <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                                <Settings2 size={40} className="text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-500">No custom fields configured</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="p-8">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit mb-6">New Custom Field</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Field Label</label>
                                        <input
                                            type="text"
                                            value={newField.label}
                                            onChange={e => setNewField({ ...newField, label: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none text-sm transition-all"
                                            placeholder="e.g. Lead Source Quality"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Data Type</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {fieldTypes.map(ft => (
                                                <button
                                                    key={ft.type}
                                                    onClick={() => setNewField({ ...newField, field_type: ft.type })}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                                                        newField.field_type === ft.type
                                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"
                                                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                                                    )}
                                                >
                                                    <ft.icon size={16} />
                                                    <span className="text-xs font-bold">{ft.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newField.is_required}
                                            onChange={e => setNewField({ ...newField, is_required: e.target.checked })}
                                            className="h-5 w-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Mandatory field</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 flex gap-3">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-3 font-bold text-sm text-slate-500 hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddField}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Create Field
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
