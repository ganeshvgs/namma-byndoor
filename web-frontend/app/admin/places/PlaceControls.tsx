// path: web-frontend/components/admin/places/PlaceControls.tsx
"use client";

import { ViewMode, PlaceSortField, PlaceStatusFilter } from "./types";

interface PlaceControlsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  availableCategories: { _id: string; name: string }[];
  statusFilter: PlaceStatusFilter;
  onStatusChange: (val: PlaceStatusFilter) => void;
  sortField: PlaceSortField;
  onSortChange: (val: PlaceSortField) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalResults: number;
}

export default function PlaceControls({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  availableCategories,
  statusFilter,
  onStatusChange,
  sortField,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: PlaceControlsProps) {
  const selectStyle: React.CSSProperties = {
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "0.75rem",
    padding: "0.5rem 0.75rem",
    color: "#E2E8F0",
    fontSize: "0.8125rem",
    fontWeight: 500,
    outline: "none",
    transition: "border-color 0.2s",
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
          placeholder="Search places by title, slug, tags, or story..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-9 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        )}
      </div>

      {/* Filters, Sort & View Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Dropdown Filter */}
        <select style={selectStyle} value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">All Categories ({totalResults})</option>
          {availableCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Status & Featured Filter */}
        <select style={selectStyle} value={statusFilter} onChange={(e) => onStatusChange(e.target.value as PlaceStatusFilter)}>
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="featured">Featured ⭐ Only</option>
        </select>

        {/* Sort Order */}
        <select style={selectStyle} value={sortField} onChange={(e) => onSortChange(e.target.value as PlaceSortField)}>
          <option value="priority-asc">Priority: Highest (P1, P2...)</option>
          <option value="priority-desc">Priority: Lowest First</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
          <option value="newest">Newest Added</option>
        </select>

        {/* View Switcher (Grid vs Table) */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => onViewModeChange("grid")}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" /></svg>
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            title="Table View"
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}