"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/hooks/useTasks';
import Link from 'next/link';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getDaysOverdue, TaskSortField, TaskFilter } from '@/lib/taskUtils';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskClick: (task: Task) => void;
  onComplete: (id: number) => void;
  onDelete: (ids: number[]) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  sortField: TaskSortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: TaskSortField) => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function TaskList({
  tasks,
  loading,
  onTaskClick,
  onComplete,
  onDelete,
  selectedIds,
  onSelectionChange,
  sortField,
  sortDirection,
  onSort,
  filter,
  onFilterChange,
}: TaskListProps) {
  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === tasks.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(tasks.map(t => t.id));
    }
  };

  const SortIcon = ({ field }: { field: TaskSortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={12} className="inline ml-1" />
    ) : (
      <ChevronDown size={12} className="inline ml-1" />
    );
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return '-';
    return new Date(dueDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-sf-gray/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter Tabs */}
      <div className="p-4 border-b border-sf-border flex items-center justify-between bg-sf-gray/20">
        <div className="flex items-center gap-4">
          {(['all', 'open', 'completed'] as TaskFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={cn(
                'text-[13px] font-bold pb-1 transition-all',
                filter === f
                  ? 'text-sf-blue border-b-2 border-sf-blue'
                  : 'text-slate-500 hover:text-sf-blue'
              )}
            >
              {f === 'all' ? 'All Tasks' : f === 'open' ? 'Open' : 'Completed'}
            </button>
          ))}
        </div>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <span className="text-[12px] font-bold text-sf-blue">
              {selectedIds.length} selected
            </span>
            <button
              onClick={() => onDelete(selectedIds)}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[12px] font-bold"
            >
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </div>

      {/* Table */}
      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle2 size={32} />
          </div>
          <div className="max-w-xs space-y-1">
            <h3 className="text-[16px] font-bold text-slate-800">
              {filter === 'completed' ? 'No completed tasks' : "You're all caught up!"}
            </h3>
            <p className="text-[12px] text-slate-500">
              {filter === 'completed'
                ? 'Complete some tasks to see them here.'
                : 'No pending tasks found. Create a new task to get started.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead className="bg-[#f8f9fb] border-b border-sf-border sticky top-0">
              <tr>
                <th className="p-3 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={tasks.length > 0 && selectedIds.length === tasks.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="p-3 w-12"></th>
                <th
                  className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider cursor-pointer hover:text-sf-blue"
                  onClick={() => onSort('due_date')}
                >
                  Subject <SortIcon field="due_date" />
                </th>
                <th
                  className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider cursor-pointer hover:text-sf-blue"
                  onClick={() => onSort('priority')}
                >
                  Priority <SortIcon field="priority" />
                </th>
                <th
                  className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider cursor-pointer hover:text-sf-blue"
                  onClick={() => onSort('status')}
                >
                  Status <SortIcon field="status" />
                </th>
                <th
                  className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider cursor-pointer hover:text-sf-blue"
                  onClick={() => onSort('due_date')}
                >
                  Due Date <SortIcon field="due_date" />
                </th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sf-border/50">
              {tasks.map((task) => {
                const daysOverdue = getDaysOverdue(task.due_date, task.status);
                return (
                  <motion.tr
                    key={task.id}
                    layout
                    className={cn(
                      'group transition-all cursor-pointer',
                      selectedIds.includes(task.id)
                        ? 'bg-sf-blue/5'
                        : 'hover:bg-sf-gray/40'
                    )}
                    onClick={() => onTaskClick(task)}
                  >
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.includes(task.id)}
                        onChange={() => toggleSelect(task.id)}
                      />
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      {task.status !== 'COMPLETED' && (
                        <button
                          onClick={() => onComplete(task.id)}
                          className="p-1 hover:bg-emerald-50 rounded-full text-slate-300 hover:text-emerald-500 transition-all"
                          title="Mark as complete"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      {task.status === 'COMPLETED' && (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tasks/${task.id}`}
                          className={cn(
                            'font-bold hover:underline',
                            task.status === 'COMPLETED'
                              ? 'text-slate-400 line-through'
                              : 'text-sf-blue'
                          )}
                        >
                          {task.subject}
                        </Link>
                        {daysOverdue !== null && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle size={10} />
                            {daysOverdue}d overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={task.status} type="task" />
                    </td>
                    <td className="p-3 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {formatDueDate(task.due_date)}
                      </div>
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 px-2 hover:bg-white rounded transition-all text-slate-400 opacity-0 group-hover:opacity-100">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
