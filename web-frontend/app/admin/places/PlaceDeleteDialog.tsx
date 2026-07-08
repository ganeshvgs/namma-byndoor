// path: web-frontend/components/admin/places/PlaceDeleteDialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Place } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

interface DeleteDialogProps {
  place: Place | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function PlaceDeleteDialog({ place, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!place) return;
    setDeleting(true);
    try {
      await api.delete(`/api/places/${place._id}`);
      toast.success(`Deleted "${place.title}".`);
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
      {place && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm" />
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-red-500/20 p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-red-500/10 border border-red-500/20 text-red-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Delete Destination</h3>
                <p className="text-slate-400 text-sm mt-1.5">Are you sure you want to permanently remove <span className="text-white font-semibold">"{place.title}"</span>?</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} disabled={deleting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 border border-white/10">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30">
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}