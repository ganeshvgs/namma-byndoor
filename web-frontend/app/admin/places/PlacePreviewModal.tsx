// path: web-frontend/components/admin/places/PlacePreviewModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Place } from "./types";

interface PlacePreviewModalProps {
  place: Place | null;
  onClose: () => void;
}

export default function PlacePreviewModal({ place, onClose }: PlacePreviewModalProps) {
  if (!place) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-indigo-500/30 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {place.category?.name || "General"}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{place.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Hero / Cover */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
              <img
                src={place.coverImage || "https://placehold.co/800x400?text=No+Cover"}
                alt={place.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description & Story */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Overview</h3>
              <p className="text-base font-medium text-white leading-relaxed">{place.shortDescription}</p>
              {place.story && (
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-2">{place.story}</p>
              )}
            </div>

            {/* Gallery */}
            {place.galleryImages && place.galleryImages.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Gallery Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {place.galleryImages.map((imgObj, i) => (
                    <div key={imgObj.publicId || i} className="h-28 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                      <img src={imgObj.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
              <div>
                <span className="text-xs text-slate-400 block">Best Time to Visit</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{place.bestTime || "Not specified"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Opening Hours</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{place.openingHours || "Not specified"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Entry Fee</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{place.entryFee || "Free"}</span>
              </div>
            </div>

            {/* Location & Maps */}
            {(place.latitude !== null || place.longitude !== null || place.googleMapsUrl) && (
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Location GPS</h4>
                  <p className="text-xs text-blue-300 font-mono mt-0.5">
                    Lat: {place.latitude ?? "N/A"} | Lng: {place.longitude ?? "N/A"}
                  </p>
                </div>
                {place.googleMapsUrl && (
                  <a
                    href={place.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
                  >
                    Open in Maps
                  </a>
                )}
              </div>
            )}

            {/* Tags */}
            {place.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 bg-slate-900 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}