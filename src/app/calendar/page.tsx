"use client";

import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'];
const initialEvents: any[] = [];

export default function CalendarPage() {
    const [activeView, setActiveView] = useState('Week');

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#4BC076] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white">
                                <CalendarIcon size={20} />
                            </div>
                            <h2 className="text-[20px] font-bold text-slate-900 leading-tight">My Calendar</h2>
                        </div>
                        <div className="flex items-center gap-1 bg-sf-gray p-1 rounded-md border border-sf-border">
                            {['Day', 'Week', 'Month'].map(v => (
                                <button key={v} onClick={() => setActiveView(v)} className={cn("px-4 py-1.5 text-[12px] font-bold rounded transition-all", activeView === v ? "bg-white text-sf-blue shadow-sm" : "text-slate-500 hover:text-slate-700")}>{v}</button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 hover:bg-sf-gray rounded border border-sf-border transition-all"><ChevronLeft size={16} /></button>
                                <span className="text-[14px] font-bold text-slate-800">January 2026</span>
                                <button className="p-1.5 hover:bg-sf-gray rounded border border-sf-border transition-all"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral flex items-center gap-2"><Filter size={14} /> My Events</button>
                        <button className="sf-btn-primary flex items-center gap-2"><Plus size={14} /> New Event</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[75vh]">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="sf-card p-5">
                        <h3 className="text-[14px] font-bold text-slate-800 mb-4 text-center">Calendar View</h3>
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-3">
                            <CalendarIcon size={40} className="opacity-20" />
                            <p className="text-[11px] font-medium italic">Empty Slate</p>
                        </div>
                    </div>

                    <div className="sf-card p-5">
                        <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center justify-between">My Calendars <Plus size={14} className="text-sf-blue cursor-pointer" /></h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-[#4BC076]" />
                                <span className="text-[13px] text-slate-600 font-bold">Standard Events</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly View Grid (Structure remains, data gone) */}
                <div className="lg:col-span-9 bg-white border border-sf-border rounded-[4px] shadow-sm flex flex-col overflow-hidden">
                    <div className="grid grid-cols-8 border-b border-sf-border bg-sf-gray/20 font-bold text-slate-500">
                        <div className="p-3 border-r border-sf-border" />
                        {daysOfWeek.map((day, i) => (
                            <div key={i} className="p-3 text-center border-r border-sf-border">
                                <div className="text-[10px] uppercase">{day}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-[linear-gradient(to_bottom,#DDDBDA_1px,transparent_1px)] bg-[size:100%_64px]">
                        <div className="grid grid-cols-8 h-full min-h-[700px]">
                            <div className="flex flex-col border-r border-sf-border">
                                {hours.map(h => <div key={h} className="h-16 flex items-start justify-center pt-2 text-[10px] font-bold text-slate-400 border-b border-transparent">{h}</div>)}
                            </div>
                            {daysOfWeek.map((_, dIdx) => (
                                <div key={dIdx} className="flex flex-col border-r border-sf-border last:border-r-0 relative hover:bg-sf-gray/10 transition-colors" />
                            ))}
                        </div>

                        {/* Centered Empty State Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-sf-border shadow-xl text-center space-y-3 pointer-events-auto">
                                <CalendarIcon size={32} className="mx-auto text-slate-300" />
                                <h3 className="text-[14px] font-bold text-slate-800">Clear Schedule</h3>
                                <p className="text-[11px] text-slate-500 max-w-[200px]">No events scheduled for this window. Click any slot to add one.</p>
                                <button className="sf-btn-primary scale-90">Schedule Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
