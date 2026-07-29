// path: web-frontend/components/admin/places/PlaceModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Place, PlaceFormData, ContentSection, SectionType } from "./types";
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
  contentSections: [],
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

type TabType = "general" | "builder" | "media" | "location" | "settings";

const SECTION_TEMPLATES: Record<SectionType, { title: string; defaultContent: string }> = {
  overview: { title: "Overview", defaultContent: "A beautiful description..." },
  history: { title: "History & Heritage", defaultContent: "Year 1: Event...\nYear 2: Event..." },
  highlights: { title: "Key Highlights", defaultContent: "- Feature 1\n- Feature 2" },
  thingsToDo: { title: "Things To Do", defaultContent: "- Activity 1\n- Activity 2" },
  travelTips: { title: "Travel Tips", defaultContent: "- Tip 1\n- Tip 2" },
  nature: { title: "Nature", defaultContent: "Describe the landscape..." },
  culture: { title: "Culture", defaultContent: "Local traditions..." },
  food: { title: "Food", defaultContent: "Must try dishes..." },
  festivals: { title: "Festivals", defaultContent: "Main festivals..." },
  wildlife: { title: "Wildlife", defaultContent: "Animals to spot..." },
  photography: { title: "Photography", defaultContent: "- Best time is morning" },
  howToReach: { title: "How to Reach", defaultContent: "By Air: ...\nBy Train: ..." },
  nearbyPlaces: { title: "Nearby Places", defaultContent: "- Place 1" },
  interestingFacts: { title: "Interesting Facts", defaultContent: "- Fact 1" },
  faq: { title: "FAQ", defaultContent: "Q: Is it safe?\nA: Yes." },
  custom: { title: "Custom Section", defaultContent: "Custom content..." },
};

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
  
  const [isDirty, setIsDirty] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [addingSectionType, setAddingSectionType] = useState<SectionType | "">("");

  useEffect(() => {
    if (open) {
      setActiveTab("general");
      setIsDirty(false);
      setExpandedSections(new Set());
      if (editing) {
        setForm({
          category: editing.category?._id || availableCategories[0]?._id || "",
          title: editing.title || "",
          slug: editing.slug || "",
          shortDescription: editing.shortDescription || "",
          story: editing.story || "",
          contentSections: editing.contentSections || [],
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

  function set<K extends keyof PlaceFormData>(key: K, val: PlaceFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setIsDirty(true);
  }

  function handleTitleChange(val: string) {
    set("title", val);
    if (!isSlugManuallyEdited) {
      set("slug", val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"));
    }
  }

  function handleSlugChange(val: string) {
    setIsSlugManuallyEdited(true);
    set("slug", val.toLowerCase().replace(/\s+/g, "-"));
  }

  // Preserve Exact Cloudinary Logic
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

  /* CMS Builder Actions */
  const handleAddSection = (type: SectionType) => {
    const newId = crypto.randomUUID();
    const newSection: ContentSection = {
      id: newId,
      sectionType: type,
      title: SECTION_TEMPLATES[type].title,
      content: SECTION_TEMPLATES[type].defaultContent,
      displayOrder: form.contentSections.length + 1,
      visible: true
    };
    set("contentSections", [...form.contentSections, newSection]);
    setExpandedSections(prev => new Set(prev).add(newId));
    setAddingSectionType("");
  };

  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    set("contentSections", form.contentSections.map(sec => sec.id === id ? { ...sec, ...updates } : sec));
  };

  const removeSection = (id: string) => {
    set("contentSections", form.contentSections.filter(sec => sec.id !== id));
  };

  const duplicateSection = (sec: ContentSection) => {
    const newId = crypto.randomUUID();
    const newSection = { ...sec, id: newId, title: `${sec.title} (Copy)` };
    const idx = form.contentSections.findIndex(s => s.id === sec.id);
    const newArray = [...form.contentSections];
    newArray.splice(idx + 1, 0, newSection);
    set("contentSections", newArray);
    setExpandedSections(prev => new Set(prev).add(newId));
  };

  const toggleSectionCollapse = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
        contentSections: form.contentSections.map((sec, i) => ({ ...sec, displayOrder: i + 1 }))
      };

      if (editing) {
        await api.put(`/api/places/${editing._id}`, payload);
        toast.success("Destination updated successfully.");
      } else {
        await api.post("/api/places", payload);
        toast.success("Destination published successfully.");
      }
      setIsDirty(false);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const handleCloseAttempt = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Discard?")) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseAttempt} className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm" />
          
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] bg-slate-950 border border-indigo-500/30"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-slate-900">
                <div>
                  <h2 className="text-white font-bold text-lg">{editing ? `Edit: ${editing.title}` : "Add New Destination"}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Manage structured content and media for this location.</p>
                </div>
                <button onClick={handleCloseAttempt} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-white/10 bg-slate-900/50 px-6 gap-2 pt-2 flex-shrink-0 overflow-x-auto hide-scrollbar">
                {[
                  { id: "general", label: "1. Basic Info" },
                  { id: "builder", label: `2. CMS Builder (${form.contentSections.length})` },
                  { id: "media", label: "3. Media & Gallery" },
                  { id: "location", label: "4. Location" },
                  { id: "settings", label: "5. Visibility" },
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
              <div className="p-6 overflow-y-auto flex-1 space-y-4 scroll-smooth">
                {activeTab === "general" && (
                  <div className="space-y-6">
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
                      <textarea style={{ ...inputStyle, minHeight: "80px" }} placeholder="1-2 sentences overview for cards..." value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
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

                {activeTab === "builder" && (
                  <div className="space-y-6 h-full flex flex-col">
                    <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-indigo-500/20">
                      <div className="flex gap-2 items-center">
                        <select 
                          value={addingSectionType}
                          onChange={(e) => setAddingSectionType(e.target.value as SectionType)}
                          className="bg-slate-950 border border-indigo-500/30 text-indigo-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-indigo-400"
                        >
                          <option value="">+ Choose Section Type</option>
                          {Object.keys(SECTION_TEMPLATES).map(type => (
                            <option key={type} value={type}>{SECTION_TEMPLATES[type as SectionType].title}</option>
                          ))}
                        </select>
                        <button 
                          disabled={!addingSectionType}
                          onClick={() => handleAddSection(addingSectionType as SectionType)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                          Add Block
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setExpandedSections(new Set())} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 rounded-lg">Collapse All</button>
                        <button onClick={() => setExpandedSections(new Set(form.contentSections.map(s => s.id)))} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 rounded-lg">Expand All</button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pb-6">
                      {form.contentSections.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl">
                          <p className="text-slate-500 font-medium text-sm">No content sections yet. Add a block to start building.</p>
                        </div>
                      ) : (
                        <Reorder.Group axis="y" values={form.contentSections} onReorder={(val) => set("contentSections", val)} className="space-y-4">
                          {form.contentSections.map((section) => (
                            <Reorder.Item key={section.id} value={section} className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-lg group">
                              <div className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-indigo-400 p-1">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" /></svg>
                                  </div>
                                  <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-[10px] font-black uppercase tracking-wider rounded-md border border-indigo-500/20">
                                    {section.sectionType}
                                  </span>
                                  <h4 className="font-bold text-white text-sm w-32 sm:w-48 truncate">{section.title}</h4>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => updateSection(section.id, { visible: !section.visible })} className={`p-1.5 rounded-lg ${section.visible ? "text-emerald-400 bg-emerald-400/10" : "text-slate-500 bg-slate-800"}`} title="Toggle Visibility">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                  </button>
                                  <button onClick={() => duplicateSection(section)} className="p-1.5 rounded-lg text-blue-400 bg-blue-400/10 hover:bg-blue-400/20" title="Duplicate">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" /></svg>
                                  </button>
                                  <button onClick={() => removeSection(section.id)} className="p-1.5 rounded-lg text-red-400 bg-red-400/10 hover:bg-red-400/20" title="Delete">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                  </button>
                                  <div className="w-px h-5 bg-white/10 mx-1" />
                                  <button onClick={() => toggleSectionCollapse(section.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform ${expandedSections.has(section.id) ? "rotate-180" : ""}`}><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                  </button>
                                </div>
                              </div>

                              <AnimatePresence initial={false}>
                                {expandedSections.has(section.id) && (
                                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/5 bg-slate-950/50">
                                    <div className="p-5 space-y-4">
                                      <Field label="Section Title">
                                        <input style={inputStyle} value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} />
                                      </Field>
                                      <Field label="Content Block (Supports lines, lists, paragraphs)">
                                        <textarea 
                                          style={{ ...inputStyle, minHeight: ["history", "faq", "overview"].includes(section.sectionType) ? '160px' : '100px', fontFamily: "monospace" }} 
                                          value={section.content} 
                                          onChange={(e) => updateSection(section.id, { content: e.target.value })} 
                                        />
                                      </Field>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      )}
                    </div>
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
                    <Field label="Google Maps Link">
                      <div className="flex gap-2">
                        <input style={inputStyle} placeholder="https://maps.google.com/..." value={form.googleMapsUrl || ""} onChange={(e) => set("googleMapsUrl", e.target.value)} />
                        {form.googleMapsUrl && (
                          <a href={form.googleMapsUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 whitespace-nowrap transition-colors">
                            Map Preview
                          </a>
                        )}
                      </div>
                    </Field>
                    
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
                <span className="text-xs font-medium text-slate-500">
                  {isDirty ? "Unsaved changes..." : "Up to date."}
                </span>
                <div className="flex gap-3">
                  <button onClick={handleCloseAttempt} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-white/5 border border-white/10">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {saving ? "Saving CMS..." : "Save Destination"}
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