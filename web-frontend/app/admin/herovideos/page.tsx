"use client";
// components/admin/HeroVideos.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroVideo {
  _id: string;
  title: string;
  desktopUrl: string;
  mobileUrl: string;
  priority: number;
  status: "active" | "inactive";
}

type FormData = Omit<HeroVideo, "_id">;

const EMPTY_FORM: FormData = {
  title: "",
  desktopUrl: "",
  mobileUrl: "",
  priority: 1,
  status: "active",
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{
        background: "rgba(30,41,59,0.6)",
        border: "1px solid rgba(99,102,241,0.12)",
      }}
    >
      <div className="w-full aspect-video bg-slate-700/60" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-700/70 rounded-lg w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-700/60 rounded-full" />
          <div className="h-6 w-16 bg-slate-700/60 rounded-full" />
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-8 flex-1 bg-slate-700/50 rounded-xl" />
          <div className="h-8 flex-1 bg-slate-700/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────

function VideoCard({
  video,
  onEdit,
  onDelete,
}: {
  video: HeroVideo;
  onEdit: (v: HeroVideo) => void;
  onDelete: (v: HeroVideo) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      {/* Video preview */}
      <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
        <video
          ref={videoRef}
          src={video.desktopUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onMouseEnter={() => videoRef.current?.play()}
          onMouseLeave={() => {
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Priority badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(99,102,241,0.9))",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(99,102,241,0.4)",
          }}
        >
          <span className="text-white">P{video.priority}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {video.title}
        </h3>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background:
                video.status === "active"
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(148,163,184,0.12)",
              color: video.status === "active" ? "#34D399" : "#94A3B8",
              border: `1px solid ${video.status === "active" ? "rgba(52,211,153,0.25)" : "rgba(148,163,184,0.2)"}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: video.status === "active" ? "#34D399" : "#64748B",
                boxShadow: video.status === "active" ? "0 0 6px #34D399" : "none",
              }}
            />
            {video.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* URL labels */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 w-14">Desktop</span>
            <span className="text-xs text-slate-400 truncate flex-1">{video.desktopUrl}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 w-14">Mobile</span>
            <span className="text-xs text-slate-400 truncate flex-1">{video.mobileUrl}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(video)}
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
            onClick={() => onDelete(video)}
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

// ─── Form field ───────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(15,23,42,0.7)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderRadius: "0.75rem",
  padding: "0.625rem 0.875rem",
  color: "#E2E8F0",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s",
};

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editing: HeroVideo | null;
  onSaved: () => void;
}

function VideoModal({ open, onClose, editing, onSaved }: ModalProps) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        editing
          ? {
              title: editing.title,
              desktopUrl: editing.desktopUrl,
              mobileUrl: editing.mobileUrl,
              priority: editing.priority,
              status: editing.status,
            }
          : EMPTY_FORM,
      );
      setErrors({});
    }
  }, [open, editing]);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.desktopUrl.trim()) e.desktopUrl = "Desktop URL is required.";
    if (!form.mobileUrl.trim()) e.mobileUrl = "Mobile URL is required.";
    if (!form.priority || form.priority < 1) e.priority = "Priority must be ≥ 1.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/hero-videos/${editing._id}`, form);
        toast.success("Video updated successfully.");
      } else {
        await api.post("/api/hero-videos", form);
        toast.success("Video added successfully.");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/70"
            style={{ backdropFilter: "blur(6px)" }}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: "linear-gradient(160deg, rgba(15,23,42,0.98) 0%, rgba(23,33,55,0.98) 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg">
                    {editing ? "Edit Video" : "Add Hero Video"}
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {editing ? "Update the video details." : "Fill in the details below to add a new hero video."}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                <Field label="Title" error={errors.title}>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Byndoor Monsoon Highlights"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </Field>

                <Field label="Desktop Cloudinary Video URL" error={errors.desktopUrl}>
                  <input
                    style={inputStyle}
                    placeholder="https://res.cloudinary.com/..."
                    value={form.desktopUrl}
                    onChange={(e) => set("desktopUrl", e.target.value)}
                  />
                </Field>

                <Field label="Mobile Cloudinary Video URL" error={errors.mobileUrl}>
                  <input
                    style={inputStyle}
                    placeholder="https://res.cloudinary.com/..."
                    value={form.mobileUrl}
                    onChange={(e) => set("mobileUrl", e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Priority" error={errors.priority}>
                    <input
                      type="number"
                      min={1}
                      style={inputStyle}
                      value={form.priority}
                      onChange={(e) => set("priority", Number(e.target.value))}
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      style={inputStyle}
                      value={form.status}
                      onChange={(e) => set("status", e.target.value as "active" | "inactive")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.35)",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving…
                    </span>
                  ) : (
                    "Save Video"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Delete confirm dialog ────────────────────────────────────────────────────

interface DeleteDialogProps {
  video: HeroVideo | null;
  onClose: () => void;
  onDeleted: () => void;
}

function DeleteDialog({ video, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!video) return;
    setDeleting(true);
    try {
      await api.delete(`/api/hero-videos/${video._id}`);
      toast.success("Video deleted.");
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
      {video && (
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
                  <h3 className="text-white font-bold text-lg">Delete Video</h3>
                  <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="text-white font-semibold">"{video.title}"</span>?{" "}
                    This action cannot be undone.
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
                    {deleting ? "Deleting…" : "Delete"}
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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
          border: "1px solid rgba(99,102,241,0.18)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#g1)" strokeWidth={1.5} className="w-10 h-10">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-9.375C2.25 8.004 2.754 7.5 3.375 7.5h17.25C21.246 7.5 21.75 8.004 21.75 8.625v9.75c0 .621-.504 1.125-1.125 1.125m0 0h-1.5m-15.75 0a1.125 1.125 0 011.125-1.125h13.5A1.125 1.125 0 0121 18.375M15 12l-4.5 2.598V9.402L15 12z" />
        </svg>
      </div>
      <h3 className="text-white font-bold text-lg mb-2">No videos yet</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs leading-relaxed">
        Add your first hero video to display on the homepage.
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAdd}
        className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
      >
        Add first video
      </motion.button>
    </motion.div>
  );
}

// ─── HeroVideos (main export) ─────────────────────────────────────────────────

export default function HeroVideos() {
  const [videos, setVideos] = useState<HeroVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroVideo | null>(null);
  const [deleting, setDeleting] = useState<HeroVideo | null>(null);

const fetchVideos = useCallback(async () => {
  setLoading(true);

  try {
    const response = await api.get<{
      success: boolean;
      videos: HeroVideo[];
    }>("/api/hero-videos");

    console.log("Hero Videos Response:", response);

    setVideos(Array.isArray(response.videos) ? response.videos : []);

  } catch (err) {
    toast.error(
      err instanceof ApiError
        ? err.message
        : "Failed to load videos."
    );

    setVideos([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(v: HeroVideo) {
    setEditing(v);
    setModalOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-black leading-tight"
            style={{
              background: "linear-gradient(135deg, #F8FAFC 30%, #93C5FD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hero Videos
          </h1>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Manage the homepage videos displayed across desktop and mobile devices.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
            boxShadow: "0 0 24px rgba(99,102,241,0.4)",
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Hero Video
        </motion.button>
      </div>

      {/* Stats bar */}
      {!loading && videos.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{videos.length} total</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-emerald-400">{videos.filter((v) => v.status === "active").length} active</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>{videos.filter((v) => v.status === "inactive").length} inactive</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : videos.length === 0
            ? <EmptyState key="empty" onAdd={openAdd} />
            : videos.map((v) => (
                <VideoCard
                  key={v._id}
                  video={v}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                />
              ))}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <VideoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={fetchVideos}
      />
      <DeleteDialog
        video={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={fetchVideos}
      />
    </div>
  );
}