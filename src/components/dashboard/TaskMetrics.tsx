'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TaskMetricsProps {
    metrics: {
        total: number;
        completed: number;
        pending: number;
        overdue: number;
    };
}

export const TaskMetrics = ({ metrics }: TaskMetricsProps) => {
    const data = [
        { name: 'Completed', value: metrics.completed, color: '#10b981' },
        { name: 'Pending', value: metrics.pending, color: '#6366f1' },
        { name: 'Overdue', value: metrics.overdue, color: '#ef4444' },
    ].filter(d => d.value > 0);

    return (
        <div className="flex flex-col items-center">
            <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-800">{metrics.total}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                {data.map((item) => (
                    <div key={item.name} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="h-2 w-full rounded-full mb-2" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-slate-900">{item.value}</span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
