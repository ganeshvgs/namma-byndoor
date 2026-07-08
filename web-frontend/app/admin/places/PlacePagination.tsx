// path: web-frontend/components/admin/places/PlacePagination.tsx
"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export default function PlacePagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
      <div>Showing <span className="font-bold text-white">{startIdx}</span> to <span className="font-bold text-white">{endIdx}</span> of <span className="font-bold text-white">{totalItems}</span> places</div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold">Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onPageChange(p)} className={`w-8 h-8 rounded-xl font-bold ${p === currentPage ? "bg-indigo-600 text-white shadow" : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"}`}>{p}</button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold">Next</button>
      </div>
    </div>
  );
}