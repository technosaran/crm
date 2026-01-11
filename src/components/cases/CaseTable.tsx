"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  LifeBuoy,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Case } from '@/hooks/useCases';
import Link from 'next/link';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CaseSortField, CaseStatusFilter, CasePriorityFilter } from '@/lib/caseUtils';

interface CaseTableProps {
  cases: Case[];
  loading: boolean;
  onCaseClick: (caseItem: Case) => void;
  onDelete: (ids: number[]) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  sortField: CaseSortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: CaseSortField) => void;
  statusFilter: CaseStatusFilter;
  priorityFilter: CasePriorityFilter;
  onStatusFilterChange: (filter: CaseStatusFilter) => void;
  onPriorityFilterChange: (filter: CasePriorityFilter) => void;
}

export function CaseTable({
  cases,
  loading,
  onCaseClick,
  onDelete,
  selectedIds,
  onSelectionChange,
  sortField,
  sortDirection,
  onSort,
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
}: CaseTableProps) {
  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === cases.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(cases.map(c => c.id));
    }
  };

  const SortIcon = ({ field }: { field: CaseSortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={12} className="inline ml-1" />
    ) : (
      <ChevronDown size={12} className="inline ml-1" />
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
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
      {/* Filters Bar */}
      <div className="p-3 border-b border-sf-border bg-sf-gray/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as CaseStatusFilter)}
              className="bg-white border border-sf-border rounded h-7 px-2 text-[12px] outline-none focus:border-sf-blue"
            >
              <option value="all">All</option>
              <option value="NEW">New</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ESCALATED">Escalated</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as CasePriorityFilter)}
              className="bg-white border border-sf-border rounded h-7 px-2 text-[12px] outline-none focus:border-sf-blue"
            >
              <option value="all">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-500 font-bold">
            {cases.length} case{cases.length !== 1 ? 's' : ''}
          </span>
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
      </div>

      {/* Table */}
      {cases.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
          <div className="h-16 w-16 bg-sf-gray rounded-full flex items-center justify-center text-slate-300">
            <LifeBuoy size={32} />
          </div>
          <div className="max-w-xs space-y-1">
            <h3 className="text-[14px] font-bold text-slate-800">No cases found</h3>
            <p className="text-[12px] text-slate-500">
              {statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters to see more cases.'
                : 'Your support queue is clear. New cases will appear here.'}
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
                    checked={cases.length > 0 && selectedIds.length === cases.length}
                    onChange={toggleAll}
                  />
                </th>
                <th
                  className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider cursor-pointer hover:text-sf-blue"
                  onClick={() => onSort('case_number')}
                >
                  Case # <SortIcon field="case_number" />
                </th>
                <th
                  className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider cursor-pointer hover:text-sf-blue"
                  onClick={() => onSort('subject')}
                >
                  Subject <SortIcon field="subject" />
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
                <th className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  Type
                </th>
                <th
                  className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider cursor-pointer hover:text-sf-blue"
                  onClick={() => onSort('created_at')}
                >
                  Created <SortIcon field="created_at" />
                </th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sf-border/50">
              {cases.map((caseItem) => {
                const isCritical = caseItem.priority === 'CRITICAL';
                const isEscalated = caseItem.status === 'ESCALATED';
                return (
                  <motion.tr
                    key={caseItem.id}
                    layout
                    className={cn(
                      'group transition-all cursor-pointer',
                      selectedIds.includes(caseItem.id)
                        ? 'bg-sf-blue/5'
                        : isCritical
                          ? 'bg-red-50/50 hover:bg-red-50'
                          : 'hover:bg-sf-gray/40'
                    )}
                    onClick={() => onCaseClick(caseItem)}
                  >
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.includes(caseItem.id)}
                        onChange={() => toggleSelect(caseItem.id)}
                      />
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-sf-blue font-bold">
                        {caseItem.case_number}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/cases/${caseItem.id}`} className="font-bold text-slate-800 hover:text-sf-blue hover:underline max-w-[250px] truncate">
                          {caseItem.subject}
                        </Link>
                        {isEscalated && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle size={10} />
                            Escalated
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <PriorityBadge priority={caseItem.priority} />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={caseItem.status} type="case" />
                    </td>
                    <td className="p-3 text-slate-500 capitalize">
                      {caseItem.type?.toLowerCase().replace('_', ' ') || '-'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {formatDate(caseItem.created_at)}
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
