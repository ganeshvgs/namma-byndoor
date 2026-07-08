// path: web-frontend/components/admin/categories/CategoryEmptyState.tsx
"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  onAdd: () => void;
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export default function CategoryEmptyState({
  onAdd,
  isFiltered = false,
  onResetFilters,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-indigo-500/10 bg-slate-900/40 backdrop-blur-md"
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-inner"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-indigo-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      </div>

      <h3 className="text-white font-bold text-lg mb-2">
        {isFiltered ? "No matching categories found" : "No categories yet"}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">
        {isFiltered
          ? "We couldn't find any categories matching your active search or filter criteria. Try adjusting your filters."
          : "Create classification tags and group regional destinations, events, or blog posts cleanly."}
      </p>

      {isFiltered ? (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onResetFilters}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          Reset Filters & Search
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #3B82F6, #6366F1)",
            boxShadow: "0 0 20px rgba(99,102,241,0.35)",
          }}
        >
          Add First Category
        </motion.button>
      )}
    </motion.div>
  );
}