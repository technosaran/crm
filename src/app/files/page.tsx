"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Search,
    Plus,
    Download,
    Trash2,
    MoreVertical,
    Upload,
    FolderOpen,
    Image as ImageIcon,
    FileCode,
    File as FileIcon,
    ChevronRight,
    Cloud
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const initialFiles: any[] = [];

export default function FilesPage() {
    const [files, setFiles] = useState(initialFiles);

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText className="text-red-500" />;
            case 'IMAGE': return <ImageIcon className="text-blue-500" />;
            case 'VIDEO': return <FileCode className="text-purple-500" />;
            default: return <FileIcon className="text-slate-400" />;
        }
    };

    const handleUpload = () => {
        toast.info("Cloud storage provider not connected. Please check Settings.");
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#54698d] h-12 w-12 rounded flex items-center justify-center text-white shadow-md">
                            <FolderOpen size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Assets</p>
                            <h1 className="text-[24px] font-bold tracking-tight text-slate-900 leading-none">Shared Drive</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral flex items-center gap-2" onClick={handleUpload}>
                            <Upload size={14} /> Upload Local
                        </button>
                        <button className="sf-btn-primary flex items-center gap-2">
                            <Plus size={14} /> New Folder
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-4 border-b border-sf-border flex items-center justify-between bg-sf-gray/20">
                        <div className="flex items-center gap-4 text-[13px] text-slate-500 font-bold uppercase tracking-tighter">
                            <span className="cursor-pointer hover:text-sf-blue">Zenith Drive</span>
                            <ChevronRight size={14} className="text-slate-300" />
                            <span className="text-slate-800">Root Directory</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input placeholder="Search files..." className="bg-white border border-sf-border rounded h-8 pl-9 pr-4 text-[12px] w-64 focus:border-sf-blue outline-none transition-all" />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div className="h-28 w-28 bg-[#00A1E0]/5 rounded-full flex items-center justify-center text-[#00A1E0]">
                                <Cloud size={56} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 border border-sf-border shadow-sm text-slate-400">
                                <Upload size={20} />
                            </div>
                        </motion.div>

                        <div className="max-w-sm space-y-2 px-4">
                            <h3 className="text-[18px] font-bold text-slate-800">Your Cloud Drive is Empty</h3>
                            <p className="text-[13px] text-slate-500 leading-relaxed">
                                Upload proposals, contracts, and marketing assets here. They'll be instantly available to your entire team with managed access control.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 w-full max-w-md border-t border-sf-border pt-8 mt-4">
                            <div className="flex flex-col items-center gap-2 text-[11px] font-bold text-slate-400">
                                <div className="h-10 w-10 bg-sf-gray rounded flex items-center justify-center text-slate-400">
                                    <FileText size={20} />
                                </div>
                                Documents
                            </div>
                            <div className="w-8 border-t border-sf-border" />
                            <div className="flex flex-col items-center gap-2 text-[11px] font-bold text-slate-400">
                                <div className="h-10 w-10 bg-sf-gray rounded flex items-center justify-center text-slate-400">
                                    <ImageIcon size={20} />
                                </div>
                                Media
                            </div>
                            <div className="w-8 border-t border-sf-border" />
                            <div className="flex flex-col items-center gap-2 text-[11px] font-bold text-slate-400">
                                <div className="h-10 w-10 bg-sf-gray rounded flex items-center justify-center text-slate-400">
                                    <FileCode size={20} />
                                </div>
                                Archives
                            </div>
                        </div>

                        <button className="sf-btn-primary mt-4" onClick={handleUpload}>Browse Files to Upload</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
