// path: web-frontend/components/admin/places/PlaceModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Place, PlaceFormData } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

interface PlaceModalProps {
  open: boolean;
  onClose: () => void;
  editing: Place | null;
  onSaved: () => void;
  availableCategories: { _id: string; name: string }[];
}

const EMPTY_FORM: PlaceFormData = {
  category: "",
  title: "",
  slug: "",
  shortDescription: "",
  story: "",
  coverImage: "",
  coverImagePublicId: "",
  galleryImages: [],
  video: "",
  latitude: "",
  longitude: "",
  googleMapsUrl: "",
  bestTime: "",
  openingHours: "",
  entryFee: "",
  tags: [],
  featured: false,
  priority: 1,
  status: "active",
};

type TabType = "general" | "media" | "location" | "settings";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
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
};

export default function PlaceModal({ open, onClose, editing, onSaved, availableCategories }: PlaceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [form, setForm] = useState<PlaceFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PlaceFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveTab("general");
      if (editing) {
        setForm({
          category: editing.category?._id || availableCategories[0]?._id || "",
          title: editing.title || "",
          slug: editing.slug || "",
          shortDescription: editing.shortDescription || "",
          story: editing.story || "",
          coverImage: editing.coverImage || "",
          coverImagePublicId: editing.coverImagePublicId || "",
          galleryImages: editing.galleryImages || [],
          video: editing.video || "",
          latitude: editing.latitude !== null && editing.latitude !== undefined ? editing.latitude : "",
          longitude: editing.longitude !== null && editing.longitude !== undefined ? editing.longitude : "",
          googleMapsUrl: editing.googleMapsUrl || "",
          bestTime: editing.bestTime || "",
          openingHours: editing.openingHours || "",
          entryFee: editing.entryFee || "",
          tags: editing.tags || [],
          featured: editing.featured ?? false,
          priority: editing.priority || 1,
          status: editing.status || "active",
        });
        setIsSlugManuallyEdited(true);
      } else {
        setForm({
          ...EMPTY_FORM,
          category: availableCategories[0]?._id || "",
        });
        setIsSlugManuallyEdited(false);
      }
      setErrors({});
      setTagInput("");
    }
  }, [open, editing, availableCategories]);

  function handleTitleChange(val: string) {
    setForm((prev) => {
      const updated = { ...prev, title: val };
      if (!isSlugManuallyEdited) {
        updated.slug = val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, title: undefined }));
  }

  function handleSlugChange(val: string) {
    setIsSlugManuallyEdited(true);
    set("slug", val.toLowerCase().replace(/\s+/g, "-"));
  }

  // Upload Cover Image
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post<{ url: string; publicId: string }>("/api/upload", fd);
      if (res?.url && res?.publicId) {
        set("coverImage", res.url);
        set("coverImagePublicId", res.publicId);
        toast.success("Cover image uploaded.");
      } else {
        throw new Error("Upload failed to return valid image data.");
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to upload cover image.");
    } finally {
      setUploadingCover(false);
    }
  }

  // Upload Gallery Images
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const newImages: { image: string; publicId: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append("file", files[i]);
        try {
          const res = await api.post<{ url: string; publicId: string }>("/api/upload", fd);
          if (res?.url && res?.publicId) {
            newImages.push({ image: res.url, publicId: res.publicId });
          }
        } catch (err) {
          toast.error(`Failed to upload ${files[i].name}`);
        }
      }
      if (newImages.length > 0) {
        set("galleryImages", [...form.galleryImages, ...newImages]);
        toast.success(`Added ${newImages.length} gallery image(s).`);
      }
    } finally {
      setUploadingGallery(false);
    }
  }

  // Tag Manager
  function handleAddTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        set("tags", [...form.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  }
  function removeTag(tagToRemove: string) {
    set("tags", form.tags.filter((t) => t !== tagToRemove));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim()) { e.title = "Title is required."; setActiveTab("general"); }
    if (!form.slug.trim()) { e.slug = "Slug is required."; setActiveTab("general"); }
    if (!form.priority || form.priority < 1) { e.priority = "Priority must be >= 1."; setActiveTab("settings"); }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        latitude: form.latitude !== "" && form.latitude !== null && form.latitude !== undefined ? Number(form.latitude) : null,
        longitude: form.longitude !== "" && form.longitude !== null && form.longitude !== undefined ? Number(form.longitude) : null,
      };

      if (editing) {
        await api.put(`/api/places/${editing._id}`, payload);
        toast.success("Destination updated successfully.");
      } else {
        await api.post("/api/places", payload);
        toast.success("Destination published successfully.");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof PlaceFormData>(key: K, val: PlaceFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm" />
          
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] bg-slate-950 border border-indigo-500/30"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-slate-900">
                <div>
                  <h2 className="text-white font-bold text-lg">{editing ? `Edit: ${editing.title}` : "Add New Destination"}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Fill in the tabs below to publish regional landmarks.</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-white/10 bg-slate-900/50 px-6 gap-2 pt-2 flex-shrink-0 overflow-x-auto">
                {[
                  { id: "general", label: "1. General Info" },
                  { id: "media", label: `2. Media & Gallery (${form.galleryImages.length})` },
                  { id: "location", label: "3. Location & Details" },
                  { id: "settings", label: "4. Settings & Priority" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Destination Title *" error={errors.title}>
                        <input style={inputStyle} placeholder="e.g. Maravanthe Beach" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
                      </Field>
                      <Field label="Slug (URL Identifier) *" error={errors.slug}>
                        <input style={inputStyle} placeholder="maravanthe-beach" value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} />
                      </Field>
                    </div>

                    <Field label="Category">
                      <select style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>
                        {availableCategories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Short Description (Summary)">
                      <textarea style={{ ...inputStyle, minHeight: "60px" }} placeholder="1-2 sentences overview for cards..." value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
                    </Field>

                    <Field label="Detailed Story / History">
                      <textarea style={{ ...inputStyle, minHeight: "130px" }} placeholder="Comprehensive information about the place..." value={form.story} onChange={(e) => set("story", e.target.value)} />
                    </Field>

                    <Field label="Tags (Type & Press Enter)">
                      <input style={inputStyle} placeholder="e.g. sunset, beach, trekking" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.tags.map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs flex items-center gap-1 border border-blue-500/30">
                            #{t}
                            <button type="button" onClick={() => removeTag(t)} className="hover:text-white">×</button>
                          </span>
                        ))}
                      </div>
                    </Field>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="space-y-6">
                    <Field label="Cover Image URL or Upload">
                      <div className="flex gap-2">
                        <input style={inputStyle} placeholder="https://..." value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} />
                        <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                          {uploadingCover ? "..." : "Upload Cover"}
                          <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploadingCover} />
                        </label>
                      </div>
                      {form.coverImage && <img src={form.coverImage} alt="Cover Preview" className="h-32 w-full object-cover rounded-xl mt-2 border border-white/10" />}
                    </Field>

                    <Field label="Gallery Images (Multiple Upload Supported)">
                      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-dashed border-white/20">
                        <span className="text-xs text-slate-400">Add multiple photos to showcase the venue gallery.</span>
                        <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer">
                          {uploadingGallery ? "Uploading..." : "+ Upload Photos"}
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                        </label>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                        {form.galleryImages.map((imgObj, i) => (
                          <div key={i} className="relative h-24 rounded-xl overflow-hidden bg-slate-900 border border-white/10 group">
                            <img src={imgObj.image} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => set("galleryImages", form.galleryImages.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 p-1 rounded bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </Field>

                    <Field label="Video URL (YouTube or Cloudinary Reel)">
                      <input style={inputStyle} placeholder="https://..." value={form.video || ""} onChange={(e) => set("video", e.target.value)} />
                    </Field>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Latitude (GPS)"><input style={inputStyle} placeholder="13.9167" value={form.latitude !== null && form.latitude !== undefined ? form.latitude : ""} onChange={(e) => set("latitude", e.target.value)} /></Field>
                      <Field label="Longitude (GPS)"><input style={inputStyle} placeholder="74.6167" value={form.longitude !== null && form.longitude !== undefined ? form.longitude : ""} onChange={(e) => set("longitude", e.target.value)} /></Field>
                    </div>
                    <Field label="Google Maps Link"><input style={inputStyle} placeholder="https://maps.google.com/..." value={form.googleMapsUrl || ""} onChange={(e) => set("googleMapsUrl", e.target.value)} /></Field>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                      <Field label="Best Time to Visit"><input style={inputStyle} placeholder="Oct - Mar" value={form.bestTime || ""} onChange={(e) => set("bestTime", e.target.value)} /></Field>
                      <Field label="Opening Hours"><input style={inputStyle} placeholder="6:00 AM - 6:30 PM" value={form.openingHours || ""} onChange={(e) => set("openingHours", e.target.value)} /></Field>
                      <Field label="Entry Fee"><input style={inputStyle} placeholder="Free / ₹50" value={form.entryFee || ""} onChange={(e) => set("entryFee", e.target.value)} /></Field>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Field label="Display Priority *" error={errors.priority}>
                        <input type="number" min={1} style={inputStyle} value={form.priority} onChange={(e) => set("priority", Number(e.target.value))} />
                        <span className="text-[11px] text-slate-500">Lower numbers appear first on the portal (e.g. P1 before P2).</span>
                      </Field>
                      <Field label="Publication Status">
                        <select style={inputStyle} value={form.status} onChange={(e) => set("status", e.target.value as "active" | "inactive")}>
                          <option value="active">Active (Visible to public)</option>
                          <option value="inactive">Inactive (Hidden draft)</option>
                        </select>
                      </Field>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">Featured Destination ⭐</h4>
                        <p className="text-xs text-amber-200/70 mt-0.5">Highlight this place on the homepage carousel and regional hero slider.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => set("featured", e.target.checked)}
                        className="w-6 h-6 rounded cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between flex-shrink-0 bg-slate-900">
                <div className="text-xs text-slate-500">
                  Step {activeTab === "general" ? "1" : activeTab === "media" ? "2" : activeTab === "location" ? "3" : "4"} of 4
                </div>
                <div className="flex gap-3">
                  <button onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-white/5 border border-white/10">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/30">
                    {saving ? "Saving..." : "Save Destination"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}