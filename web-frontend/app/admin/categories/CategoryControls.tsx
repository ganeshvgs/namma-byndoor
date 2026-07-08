// path: web-frontend/components/admin/categories/CategoryControls.tsx
"use client";

import { SortField, FilterStatus } from "./types";

interface CategoryControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  sortField: SortField;
  onSortChange: (sort: SortField) => void;
  totalResults: number;
}

export default function CategoryControls({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortField,
  onSortChange,
  totalResults,
}: CategoryControlsProps) {
  const selectStyle: React.CSSProperties = {
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "0.75rem",
    padding: "0.5rem 0.75rem",
    color: "#E2E8F0",
    fontSize: "0.8125rem",
    fontWeight: 500,
    outline: "none",
    transition: "all 0.2s",
  };

  return (
    <div
      className="p-4 rounded-2xl border border-indigo-500/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      style={{
        background: "linear-gradient(160deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by category name, slug or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-9 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters & Sort Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status:</span>
          <select
            style={selectStyle}
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
          >
            <option value="all">All Status ({totalResults})</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sort:</span>
          <select
            style={selectStyle}
            value={sortField}
            onChange={(e) => onSortChange(e.target.value as SortField)}
          >
            <option value="priority-asc">Priority: Highest First (P1, P2...)</option>
            <option value="priority-desc">Priority: Lowest First</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="newest">Newest Created</option>
          </select>
        </div>
      </div>
    </div>
  );
}