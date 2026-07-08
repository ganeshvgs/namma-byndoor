// path: web-frontend/components/admin/categories/CategoryDeleteDialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

interface DeleteDialogProps {
  category: Category | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function CategoryDeleteDialog({ category, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!category) return;
    setDeleting(true);
    try {
      await api.delete(`/api/categories/${category._id}`);
      toast.success(`Category "${category.name}" deleted.`);
      onDeleted();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AnimatePresence>
      {category && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/70"
            style={{ backdropFilter: "blur(6px)" }}
          />

          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              key="dlg"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.24 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: "linear-gradient(160deg, rgba(15,23,42,0.98), rgba(23,33,55,0.98))",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <div className="p-6 text-center space-y-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth={1.8} className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Delete Category</h3>
                  <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                    Are you sure you want to delete <span className="text-white font-semibold">"{category.name}"</span>? This may affect items tagged under this classification.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: deleting ? 1 : 1.02 }}
                    whileTap={{ scale: deleting ? 1 : 0.98 }}
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #EF4444, #DC2626)",
                      boxShadow: "0 0 18px rgba(239,68,68,0.3)",
                      opacity: deleting ? 0.7 : 1,
                    }}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}