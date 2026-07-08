// path: web-frontend/components/admin/categories/CategoryCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Category } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

interface CategoryCardProps {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onStatusToggled: () => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onStatusToggled,
}: CategoryCardProps) {
  const [toggling, setToggling] = useState(false);

  // Inline Status Toggle without opening Modal
  async function handleToggleStatus() {
    if (toggling) return;
    setToggling(true);
    const newStatus = category.status === "active" ? "inactive" : "active";

    try {
      await api.put(`/api/categories/${category._id}`, {
        ...category,
        status: newStatus,
      });
      toast.success(`Category "${category.name}" marked as ${newStatus}.`);
      onStatusToggled();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to toggle status.");
    } finally {
      setToggling(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)",
        border: "1px solid rgba(99,102,241,0.14)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Cover Image & Header Overlay */}
      <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
        {category.coverImage ? (
          <img
            src={category.coverImage}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-[11px] font-medium uppercase tracking-wider">No Cover Image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Priority Badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold z-10"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(99,102,241,0.9))",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(99,102,241,0.4)",
          }}
        >
          <span className="text-white">P{category.priority}</span>
        </div>

        {/* Inline Status Toggle Button */}
        <button
          onClick={handleToggleStatus}
          disabled={toggling}
          title="Click to toggle status"
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 hover:scale-105"
          style={{
            background:
              category.status === "active"
                ? "rgba(16, 185, 129, 0.85)"
                : "rgba(100, 116, 139, 0.85)",
            backdropFilter: "blur(8px)",
            color: "white",
            border: `1px solid ${
              category.status === "active" ? "rgba(52, 211, 153, 0.5)" : "rgba(148, 163, 184, 0.4)"
            }`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{
              boxShadow: category.status === "active" ? "0 0 6px #ffffff" : "none",
            }}
          />
          {toggling ? "Saving..." : category.status === "active" ? "Active" : "Inactive"}
        </button>

        {/* Title & Slug Overlay */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-bold text-base leading-tight truncate drop-shadow">
              {category.name}
            </h3>
            <p className="text-blue-300 text-xs font-mono truncate mt-0.5 opacity-90">
              /{category.slug}
            </p>
          </div>

          {/* Icon Preview Badge */}
          {category.icon && (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg border border-white/20"
              style={{ background: "rgba(30, 41, 59, 0.8)", backdropFilter: "blur(8px)" }}
              title={`Icon: ${category.icon}`}
            >
              {category.icon.startsWith("http") || category.icon.startsWith("/") ? (
                <img src={category.icon} alt="" className="w-5 h-5 object-contain" />
              ) : (
                <span className="text-xs font-bold uppercase tracking-tighter">
                  {category.icon.slice(0, 2)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-4">
        <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
          {category.description || (
            <span className="text-slate-500 italic">No description provided for this category.</span>
          )}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-white/5 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(category)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.18))",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#93C5FD",
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
            Edit
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDelete(category)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#F87171",
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}