'use client';

import React from 'react';
import { Award, TrendingUp, User } from 'lucide-react';

export const LeaderBoard = () => {
    // Mock data for leaderboard
    const reps = [
        { id: 1, name: 'Alex Thompson', revenue: 145000, deals: 24, growth: '+12%' },
        { id: 2, name: 'Sarah Chen', revenue: 132000, deals: 18, growth: '+8%' },
        { id: 3, name: 'Michael Ross', revenue: 98000, deals: 15, growth: '+5%' },
        { id: 4, name: 'Elena Rodriguez', revenue: 87000, deals: 12, growth: '+15%' },
    ];

    return (
        <div className="space-y-4">
            {reps.map((rep, index) => (
                <div
                    key={rep.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                <User className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                            </div>
                            {index === 0 && (
                                <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-1 border-2 border-white shadow-sm">
                                    <Award className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{rep.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">{rep.deals} Deals Closed</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm font-black text-slate-900">${rep.revenue.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-emerald-500">
                            <TrendingUp className="h-3 w-3" />
                            {rep.growth}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
