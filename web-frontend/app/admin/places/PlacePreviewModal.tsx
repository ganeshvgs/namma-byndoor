// path: web-frontend/components/admin/places/PlacePreviewModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Place, ContentSection } from "./types";

/* =========================================================
   ContentSectionsRenderer (REUSABLE)
   Export this to use exactly identically on Public pages!
========================================================= */
export function ContentSectionsRenderer({ sections }: { sections: ContentSection[] }) {
  if (!sections || sections.length === 0) return null;

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-16 mt-10">
      {visibleSections.map((section) => {
        const lines = section.content.split("\n").filter(l => l.trim().length > 0);

        return (
          <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="relative">
            
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
                {section.sectionType === "overview" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
                {section.sectionType === "history" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                {section.sectionType === "thingsToDo" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>}
                {section.sectionType === "travelTips" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                {section.sectionType === "highlights" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                {section.sectionType === "faq" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                {(!["overview", "history", "thingsToDo", "travelTips", "highlights", "faq"].includes(section.sectionType)) && (
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{section.title}</h3>
                <div className="w-12 h-1 bg-indigo-500 mt-2 rounded-full" />
              </div>
            </div>

            {/* Smart Renderers based on Strict Section Types */}
            {section.sectionType === "overview" && (
              <p className="text-xl text-slate-300 leading-[1.8] font-medium max-w-[80ch]">
                {section.content}
              </p>
            )}

            {section.sectionType === "history" && (
              <div className="relative border-l-2 border-indigo-500/30 pl-8 ml-6 mt-4 space-y-10 py-4">
                {lines.map((line, i) => (
                  <div key={i} className="relative bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors shadow-lg">
                    <span className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border-4 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                    <p className="text-slate-300 text-lg leading-relaxed">{line.replace(/^[-*•]\s*/, "")}</p>
                  </div>
                ))}
              </div>
            )}

            {(section.sectionType === "highlights" || section.sectionType === "interestingFacts" || section.sectionType === "nearbyPlaces") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lines.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 flex gap-4 items-start shadow-xl">
                    <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/30 text-sm font-black">✓</span>
                    <span className="text-slate-200 text-lg font-medium pt-0.5">{item.replace(/^[-*•]\s*/, "")}</span>
                  </div>
                ))}
              </div>
            )}

            {section.sectionType === "thingsToDo" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {lines.map((item, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M5 12l5 5L20 7"/></svg>
                    </div>
                    <span className="text-slate-200 font-bold text-lg">{item.replace(/^[-*•]\s*/, "")}</span>
                  </div>
                ))}
              </div>
            )}

            {(section.sectionType === "travelTips" || section.sectionType === "photography") && (
              <ul className="space-y-4">
                {lines.map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-2xl shadow-emerald-500/50">💡</span>
                    <span className="text-emerald-100 text-lg font-medium">{item.replace(/^[-*•]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.sectionType === "faq" && (
              <div className="space-y-4">
                {lines.map((item, i) => {
                  if(item.toLowerCase().startsWith("q:")) return (
                    <details key={i} className="group bg-slate-900 border border-white/10 rounded-2xl overflow-hidden cursor-pointer open:bg-slate-800 transition-colors">
                      <summary className="p-6 font-bold text-lg text-white list-none flex justify-between items-center select-none">
                        {item.replace(/^[Qq]:\s*/i, "")}
                        <span className="text-indigo-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                      </summary>
                      {/* Finds the next line if it's an answer */}
                      {lines[i+1] && lines[i+1].toLowerCase().startsWith("a:") && (
                        <div className="px-6 pb-6 pt-2 text-slate-300 text-lg leading-relaxed border-t border-white/5">
                          {lines[i+1].replace(/^[Aa]:\s*/i, "")}
                        </div>
                      )}
                    </details>
                  )
                  return null;
                })}
              </div>
            )}

            {/* Default Catch-All (Food, Culture, Nature, Custom) */}
            {(!["overview", "history", "highlights", "interestingFacts", "thingsToDo", "travelTips", "photography", "nearbyPlaces", "faq"].includes(section.sectionType)) && (
              <div className="space-y-6">
                {section.content.split(/\n\s*\n/).map((p, i) => (
                  <p key={i} className="text-slate-300 text-lg leading-[1.85] max-w-[75ch] bg-slate-900/40 p-6 rounded-2xl border-l-4 border-indigo-500 backdrop-blur-sm">
                    {p}
                  </p>
                ))}
              </div>
            )}

          </motion.div>
        );
      })}
    </div>
  );
}

export default function PlacePreviewModal({ place, onClose }: { place: Place | null, onClose: () => void }) {
  if (!place) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl bg-slate-950 border border-white/10 flex flex-col max-h-[95vh]">
          
          <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md z-10">
             <div className="flex items-center gap-4">
               <span className="px-4 py-1.5 rounded-full text-xs font-black bg-indigo-500 text-white uppercase tracking-widest shadow-lg shadow-indigo-500/30">CMS Preview</span>
               <span className="text-slate-400 font-mono text-sm">/{place.slug}</span>
             </div>
             <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
             </button>
          </div>

          <div className="p-6 md:p-12 overflow-y-auto space-y-12 flex-1 scroll-smooth">
            
            <div className="relative h-[350px] md:h-[450px] w-full rounded-[2.5rem] overflow-hidden bg-slate-800 shadow-2xl">
              <img src={place.coverImage || "https://placehold.co/1200x600?text=No+Cover"} alt={place.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{place.title}</h1>
                <p className="text-slate-300 text-lg md:text-xl mt-3 max-w-3xl font-medium leading-relaxed">{place.shortDescription}</p>
              </div>
            </div>

            {/* Reusable Core */}
            <ContentSectionsRenderer sections={place.contentSections} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-white/10">
               {[{ label: "Best Time", val: place.bestTime }, { label: "Opening Hours", val: place.openingHours }, { label: "Entry Fee", val: place.entryFee }].map((meta, i) => (
                 <div key={i} className="p-6 rounded-3xl bg-slate-900 border border-white/5">
                   <span className="text-xs text-slate-500 font-bold uppercase tracking-widest block">{meta.label}</span>
                   <span className="text-xl font-bold text-white mt-2 block">{meta.val || "Not specified"}</span>
                 </div>
               ))}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}