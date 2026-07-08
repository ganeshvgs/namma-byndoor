// path: web-frontend/components/admin/categories/CategoryPagination.tsx
"use client";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function CategoryPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: CategoryPaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
      <div>
        Showing <span className="font-bold text-white">{startIdx}</span> to{" "}
        <span className="font-bold text-white">{endIdx}</span> of{" "}
        <span className="font-bold text-white">{totalItems}</span> categories
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors font-semibold text-white flex items-center gap-1"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-xl font-bold transition-all ${
              p === currentPage
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30"
                : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors font-semibold text-white flex items-center gap-1"
        >
          Next
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.16 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}