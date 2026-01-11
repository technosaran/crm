"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    Plus,
    Search,
    Filter,
    Calendar,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { sortTasks, filterTasks, TaskSortField, TaskFilter } from '@/lib/taskUtils';

export default function TasksPage() {
    const { tasks, loading, createTask, updateTask, deleteTasks, completeTask, refresh } = useTasks();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);

    // Selection state
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Sort and filter state
    const [sortField, setSortField] = useState<TaskSortField>('due_date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState<TaskFilter>('open');
    const [searchQuery, setSearchQuery] = useState('');

    // Process tasks with filtering, searching, and sorting
    const processedTasks = useMemo(() => {
        let result = filterTasks(tasks, filter);

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(task =>
                task.subject.toLowerCase().includes(query) ||
                (task.description?.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        result = sortTasks(result, sortField, sortDirection);

        return result;
    }, [tasks, filter, searchQuery, sortField, sortDirection]);

    // Stats
    const stats = useMemo(() => {
        const open = tasks.filter(t => t.status !== 'COMPLETED').length;
        const completed = tasks.filter(t => t.status === 'COMPLETED').length;
        const overdue = tasks.filter(t => {
            if (!t.due_date || t.status === 'COMPLETED') return false;
            return new Date(t.due_date) < new Date();
        }).length;
        return { open, completed, overdue, total: tasks.length };
    }, [tasks]);

    const handleSort = (field: TaskSortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleTaskClick = (task: any) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleNewTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Partial<any>) => {
        if (editingTask) {
            return await updateTask(editingTask.id, data);
        } else {
            return await createTask(data);
        }
    };

    const handleDelete = async (ids: number[]) => {
        await deleteTasks(ids);
        setSelectedIds([]);
    };

    const handleComplete = async (id: number) => {
        await completeTask(id);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#4BC076] h-12 w-12 rounded flex items-center justify-center text-white shadow-md">
                            <CheckCircle2 size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Activities</p>
                            <h1 className="text-[24px] font-bold tracking-tight text-slate-900 leading-none">Task Management</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={refresh}
                            className="sf-btn-neutral flex items-center gap-2"
                            disabled={loading}
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="sf-btn-neutral flex items-center gap-2">
                            <Calendar size={14} /> View Calendar
                        </button>
                        <button
                            onClick={handleNewTask}
                            className="sf-btn-primary flex items-center gap-2"
                        >
                            <Plus size={14} /> New Task
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-sf-border bg-white flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border border-sf-border rounded h-9 pl-10 pr-4 text-[13px] w-full focus:border-sf-blue outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Task List */}
                    <TaskList
                        tasks={processedTasks}
                        loading={loading}
                        onTaskClick={handleTaskClick}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        filter={filter}
                        onFilterChange={setFilter}
                    />
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm">
                        <h3 className="text-[14px] font-bold text-slate-800 mb-4 pb-2 border-b border-sf-border">
                            Task Summary
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-slate-600">Open Tasks</span>
                                <span className="text-[16px] font-bold text-sf-blue">{stats.open}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-slate-600">Completed</span>
                                <span className="text-[16px] font-bold text-emerald-600">{stats.completed}</span>
                            </div>
                            {stats.overdue > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-slate-600">Overdue</span>
                                    <span className="text-[16px] font-bold text-red-600">{stats.overdue}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-sf-border flex items-center justify-between">
                                <span className="text-[13px] font-bold text-slate-800">Total Tasks</span>
                                <span className="text-[16px] font-bold text-slate-800">{stats.total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Productivity Insights */}
                    <div className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm">
                        <h3 className="text-[14px] font-bold text-slate-800 mb-4 pb-2 border-b border-sf-border">
                            Productivity Insights
                        </h3>
                        <div className="space-y-4">
                            {stats.total === 0 ? (
                                <div className="text-center py-6">
                                    <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-[11px] text-slate-500 font-medium italic">
                                        Insights will appear as you complete tasks.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] text-slate-500">Completion Rate</span>
                                        <span className="text-[14px] font-bold text-emerald-600">
                                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-sf-gray rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all"
                                            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Smart Reminders Card */}
                    <div className="bg-gradient-to-br from-[#001639] to-[#0176D3] rounded-[4px] p-5 text-white shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12" />
                        <h4 className="text-[14px] font-bold mb-2">Smart Reminders</h4>
                        <p className="text-[11px] text-blue-100 leading-relaxed mb-4">
                            Zenith Intelligence can auto-remind you of stale deals. Enable in settings.
                        </p>
                        <button className="text-[11px] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Configure AI Rules <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                }}
                task={editingTask}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
