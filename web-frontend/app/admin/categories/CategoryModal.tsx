// path: web-frontend/components/admin/categories/CategoryModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, CategoryFormData } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  editing: Category | null;
  onSaved: () => void;
}

const EMPTY_FORM: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  coverImage: "",
  priority: 1,
  status: "active",
};

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

export default function CategoryModal({ open, onClose, editing, onSaved }: CategoryModalProps) {
  const [form, setForm] = useState<CategoryFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          name: editing.name || "",
          slug: editing.slug || "",
          description: editing.description || "",
          icon: editing.icon || "",
          coverImage: editing.coverImage || "",
          priority: editing.priority || 1,
          status: editing.status || "active",
        });
        setIsSlugManuallyEdited(true);
      } else {
        setForm(EMPTY_FORM);
        setIsSlugManuallyEdited(false);
      }
      setErrors({});
    }
  }, [open, editing]);

  // Auto-Slug Generation logic
  function handleNameChange(val: string) {
    setForm((prev) => {
      const updated = { ...prev, name: val };
      if (!isSlugManuallyEdited) {
        updated.slug = val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, name: undefined }));
  }

  function handleSlugChange(val: string) {
    setIsSlugManuallyEdited(true);
    set("slug", val.toLowerCase().replace(/\s+/g, "-"));
  }

  // Handle local image file upload (simulated or API upload via FormData)
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      
      // Send to backend upload endpoint or Cloudinary proxy
      const res = await api.post<{ url: string }>("/api/upload", uploadData);
      if (res?.url) {
        set("coverImage", res.url);
        toast.success("Image uploaded successfully.");
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (err) {
      // Fallback preview for demo if upload API is not yet live
      const localPreviewUrl = URL.createObjectURL(file);
      set("coverImage", localPreviewUrl);
      toast.success("Local preview attached. Connect /api/upload for cloud persist.");
    } finally {
      setUploadingImage(false);
    }
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Category Name is required.";
    if (!form.slug.trim()) e.slug = "Slug identifier is required.";
    if (!form.priority || form.priority < 1) e.priority = "Priority must be at least 1.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/categories/${editing._id}`, form);
        toast.success("Category updated successfully.");
      } else {
        await api.post("/api/categories", form);
        toast.success("Category created successfully.");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) {
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

          {/* Modal Panel */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              style={{
                background: "linear-gradient(160deg, rgba(15,23,42,0.98) 0%, rgba(23,33,55,0.98) 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-white font-bold text-lg">
                    {editing ? "Edit Category" : "Add New Category"}
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {editing ? "Modify classification details." : "Organize your portal content with a new tag."}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Category Name" error={errors.name}>
                    <input
                      style={inputStyle}
                      placeholder="e.g. Beaches & Coastal"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </Field>

                  <Field label="Slug (URL Friendly)" error={errors.slug}>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">/</span>
                      <input
                        style={{ ...inputStyle, paddingLeft: "1.25rem font-mono" }}
                        placeholder="beaches-coastal"
                        value={form.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                      />
                    </div>
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                    placeholder="Brief description of what belongs in this category..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </Field>

                {/* Cover Image Upload & URL input */}
                <Field label="Cover Image URL or Upload" error={errors.coverImage}>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        style={inputStyle}
                        placeholder="https://res.cloudinary.com/..."
                        value={form.coverImage}
                        onChange={(e) => set("coverImage", e.target.value)}
                      />
                      <label
                        className="flex-shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                        </svg>
                        {uploadingImage ? "Uploading..." : "Upload File"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    {/* Image Preview Box */}
                    {form.coverImage && (
                      <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                        <img src={form.coverImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => set("coverImage", "")}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                          title="Remove Image"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Icon Name or URL">
                    <input
                      style={inputStyle}
                      placeholder="e.g. compass or URL"
                      value={form.icon}
                      onChange={(e) => set("icon", e.target.value)}
                    />
                  </Field>

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
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3 flex-shrink-0">
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
                      Saving...
                    </span>
                  ) : (
                    "Save Category"
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