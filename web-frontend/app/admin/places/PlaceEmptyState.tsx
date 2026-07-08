// path: web-frontend/components/admin/places/PlaceEmptyState.tsx
"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  onAdd: () => void;
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export default function PlaceEmptyState({ onAdd, isFiltered = false, onResetFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-indigo-500/10 bg-slate-900/40 backdrop-blur-md"
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-inner"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.15))",
          border: "1px solid rgba(99,102,241,0.25)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-indigo-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </div>

      <h3 className="text-white font-bold text-lg mb-2">
        {isFiltered ? "No matching places found" : "No regional places published"}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 max-w-md leading-relaxed">
        {isFiltered
          ? "No destinations match your active search keyword, selected category, or filter criteria. Adjust or reset your filters."
          : "Start showcasing Namma Byndoor's iconic beaches, heritage temples, hills, and cultural landmarks."}
      </p>

      {isFiltered ? (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onResetFilters}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          Reset All Filters
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
          Add First Destination
        </motion.button>
      )}
    </motion.div>
  );
}