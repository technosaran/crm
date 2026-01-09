"use client";

import React from 'react';
import { History, User, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogEntry {
    id: string;
    user: string;
    action: string;
    details: string;
    timestamp: Date;
}

const mockLogs: AuditLogEntry[] = [];

export function AuditTrail() {
    return (
        <div className="bg-white border border-sf-border rounded-[4px] shadow-sm">
            <div className="p-4 border-b border-sf-border flex items-center gap-2">
                <History size={16} className="text-slate-500" />
                <h3 className="text-[14px] font-bold text-slate-800">System Audit Trail</h3>
            </div>
            <div className="divide-y divide-sf-border min-h-[150px] flex flex-col justify-center">
                {mockLogs.length > 0 ? (
                    mockLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-sf-gray/20 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-sf-blue/10 flex items-center justify-center text-sf-blue">
                                        <User size={12} />
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-800">{log.user}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium font-mono">
                                    {format(log.timestamp, 'HH:mm:ss')}
                                </span>
                            </div>
                            <div className="pl-8">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-sf-blue uppercase tracking-tighter bg-sf-blue/5 px-1.5 rounded">
                                        {log.action}
                                    </span>
                                    <p className="text-[12px] text-slate-600 line-clamp-1">{log.details}</p>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                                    <Clock size={10} />
                                    {format(log.timestamp, 'MMM dd, yyyy')}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400">
                        <History size={24} className="mb-2 opacity-20" />
                        <p className="text-[12px] font-medium">No recent system activity</p>
                    </div>
                )}
            </div>
            <button className="w-full py-3 text-[12px] font-bold text-sf-blue hover:bg-sf-gray/30 transition-all border-t border-sf-border">
                Export Audit Logs (CSV)
            </button>
        </div>
    );
}
