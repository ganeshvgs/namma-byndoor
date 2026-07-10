// path: app/places/[slug]/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { api } from "../../lib/api";

// Assuming existing Layout components are imported from your project structure
import Navbar from "../../components/Navbar";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PlaceCategoryRef {
  _id?: string;
  name?: string;
}

export interface GalleryImage {
  image: string;
  publicId?: string;
}

export interface PlaceDetails {
  _id: string;
  category: PlaceCategoryRef | string;
  title: string;
  slug: string;
  shortDescription?: string;
  story?: string;
  coverImage: string;
  galleryImages?: GalleryImage[];
  video?: string;
  latitude?: number | string;
  longitude?: number | string;
  googleMapsUrl?: string;
  bestTime?: string;
  openingHours?: string;
  entryFee?: string;
  tags?: string[];
  featured?: boolean;
  priority?: number;
  status: "active" | "inactive" | string;
}

interface PlaceApiResponse {
  success?: boolean;
  place?: PlaceDetails;
  data?: PlaceDetails;
}

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const TOKENS = {
  primary: "#0284C7",
  gradientStart: "#0369A1",
  secondary: "#38BDF8",
  dark: "#0F172A",
  bgMain: "#F8FCFF",
  bgSecondary: "#EEF8FF",
  cardBg: "rgba(255, 255, 255, 0.78)",
  border: "rgba(255, 255, 255, 0.45)",
  muted: "#64748B",
} as const;

// ============================================================================
// PREMIUM OUTLINE SVG ICONS
// ============================================================================

const CalendarIcon = memo(() => (
  <svg className="w-5 h-5 text-[#0284C7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
));
CalendarIcon.displayName = "CalendarIcon";

const ClockIcon = memo(() => (
  <svg className="w-5 h-5 text-[#0284C7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
));
ClockIcon.displayName = "ClockIcon";

const TicketIcon = memo(() => (
  <svg className="w-5 h-5 text-[#0284C7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
));
TicketIcon.displayName = "TicketIcon";

const CompassIcon = memo(() => (
  <svg className="w-5 h-5 text-[#0284C7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
));
CompassIcon.displayName = "CompassIcon";

const MapPinIcon = memo(() => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
));
MapPinIcon.displayName = "MapPinIcon";

const PhotoIcon = memo(() => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
));
PhotoIcon.displayName = "PhotoIcon";

const ExpandArrowsIcon = memo(() => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
));
ExpandArrowsIcon.displayName = "ExpandArrowsIcon";

// ============================================================================
// HELPER: MAP URL GENERATOR
// ============================================================================

function getMapUrl(place: PlaceDetails): string | null {
  if (place.googleMapsUrl && place.googleMapsUrl.trim() !== "") {
    return place.googleMapsUrl;
  }
  if (place.latitude !== undefined && place.longitude !== undefined && place.latitude !== "" && place.longitude !== "") {
    return `https://www.google.com/maps/search/?api=1&query=$${place.latitude},${place.longitude}`;
  }
  return null;
}

// ============================================================================
// SUB-COMPONENT: PLACE HERO
// ============================================================================

interface PlaceHeroProps {
  place: PlaceDetails;
  hasGallery: boolean;
  onOpenGallery?: () => void;
  reducedMotion: boolean | null;
}

const PlaceHero = memo(({ place, hasGallery, onOpenGallery, reducedMotion }: PlaceHeroProps) => {
  const mapUrl = getMapUrl(place);
  const categoryName = typeof place.category === "object" ? place.category?.name : place.category;

  return (
    <section className="relative w-full h-[65vh] lg:h-[80vh] min-h-[480px] max-h-[900px] overflow-hidden select-none bg-slate-900">
      <Image
        src={place.coverImage || "/images/placeholder-place.jpg"}
        alt={place.title}
        fill
        priority
        loading="eager"
        sizes="100vw"
        className="object-cover transition-transform duration-1000 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-90 pointer-events-none" />
      
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {categoryName && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
                {categoryName}
              </span>
            )}
            {place.featured === true && (
              <span
                className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-md border border-white/30 flex items-center gap-1.5"
                style={{ background: `linear-gradient(135deg, ${TOKENS.primary} 0%, ${TOKENS.secondary} 100%)` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg mb-4">
            {place.title}
          </h1>
          {place.shortDescription && (
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow mb-8 line-clamp-3">
              {place.shortDescription}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase shadow-[0_4px_20px_rgba(2,132,199,0.4)] hover:shadow-[0_8px_28px_rgba(2,132,199,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-[#0369A1] to-[#38BDF8]"
              >
                <MapPinIcon />
                <span>Open in Maps</span>
              </a>
            )}
            {hasGallery && (
              <button
                type="button"
                onClick={onOpenGallery}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase transition-all duration-300 bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/50 transform hover:-translate-y-0.5 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8]"
              >
                <PhotoIcon />
                <span>View Photos</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
});
PlaceHero.displayName = "PlaceHero";

// ============================================================================
// SUB-COMPONENT: FLOATING INFORMATION CARD
// ============================================================================

interface PlaceInformationProps {
  place: PlaceDetails;
  reducedMotion: boolean | null;
}

const PlaceInformation = memo(({ place, reducedMotion }: PlaceInformationProps) => {
  const categoryName = typeof place.category === "object" ? place.category?.name : place.category;

  const items = useMemo(() => {
    const list = [];
    if (place.bestTime && place.bestTime.trim() !== "") {
      list.push({ label: "Best Time", value: place.bestTime, icon: <CalendarIcon /> });
    }
    if (place.openingHours && place.openingHours.trim() !== "") {
      list.push({ label: "Opening Hours", value: place.openingHours, icon: <ClockIcon /> });
    }
    if (place.entryFee && place.entryFee.trim() !== "") {
      list.push({ label: "Entry Fee", value: place.entryFee, icon: <TicketIcon /> });
    }
    if (categoryName && categoryName.trim() !== "") {
      list.push({ label: "Category", value: categoryName, icon: <CompassIcon /> });
    }
    return list;
  }, [place, categoryName]);

  if (items.length === 0) return null;

  return (
    <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 -mt-14 md:-mt-16 mb-16">
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-[28px] md:rounded-[32px] p-6 sm:p-8 border backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_4px_12px_rgba(2,132,199,0.04)]"
        style={{ backgroundColor: TOKENS.cardBg, borderColor: TOKENS.border }}
      >
        <div className={`grid grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6 sm:gap-8`}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3.5 ${
                idx !== 0 && idx % 2 === 1 ? "border-l border-slate-200/60 pl-4 sm:pl-6" : ""
              } ${idx >= 2 ? "lg:border-l lg:border-slate-200/60 lg:pl-6 pt-4 sm:pt-0 border-t border-slate-100 sm:border-t-0" : ""}`}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#0284C7]/10 flex items-center justify-center shrink-0 border border-[#0284C7]/20">
                {item.icon}
              </div>
              <div className="overflow-hidden w-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-0.5">
                  {item.label}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#0F172A] truncate block" title={item.value}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});
PlaceInformation.displayName = "PlaceInformation";

// ============================================================================
// SUB-COMPONENT: PLACE STORY / ABOUT
// ============================================================================

interface PlaceStoryProps {
  place: PlaceDetails;
  reducedMotion: boolean | null;
}

const PlaceStory = memo(({ place, reducedMotion }: PlaceStoryProps) => {
  if (!place.story || place.story.trim() === "") return null;
  const paragraphs = place.story.split(/\n+/).filter((p) => p.trim() !== "");

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
          DISCOVER
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-8">
          The Story of {place.title}
        </h2>
        <div className="space-y-6 text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="leading-8">{para}</p>
          ))}
        </div>
      </motion.div>
    </section>
  );
});
PlaceStory.displayName = "PlaceStory";

// ============================================================================
// SUB-COMPONENT: LIGHTBOX GALLERY
// ============================================================================

interface GalleryLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

const GalleryLightbox = memo(({ images, initialIndex, onClose }: GalleryLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Fullscreen photo gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-[#0F172A]/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-8 select-none"
      >
        {/* High-visibility Close Button respecting safe areas */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-[10000] w-12 h-12 rounded-full bg-white text-[#0F172A] shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-105 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8]"
          aria-label="Close photo gallery"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Indicator */}
        <div className="w-full max-w-7xl flex items-center justify-center text-white z-10 pt-[env(safe-area-inset-top)]">
          <span className="text-xs md:text-sm font-extrabold tracking-widest uppercase bg-white/10 px-5 py-2 rounded-full border border-white/20 shadow-sm backdrop-blur-md">
            Photo {currentIndex + 1} of {images.length}
          </span>
        </div>

        {/* Main Image Viewport */}
        <div className="relative w-full max-w-7xl flex-1 flex items-center justify-center my-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
            >
              <Image
                src={images[currentIndex]?.image}
                alt={`Gallery photo ${currentIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 md:left-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer z-[10000] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] backdrop-blur-md"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer z-[10000] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] backdrop-blur-md"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div 
            className="w-full max-w-4xl flex items-center justify-center gap-3 overflow-x-auto py-4 px-4 scrollbar-none pb-[env(safe-area-inset-bottom)]"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to photo ${idx + 1}`}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] ${
                  currentIndex === idx
                    ? "border-[#38BDF8] scale-110 opacity-100 shadow-lg"
                    : "border-transparent opacity-40 hover:opacity-100"
                }`}
              >
                <Image src={img.image} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});
GalleryLightbox.displayName = "GalleryLightbox";

// ============================================================================
// SUB-COMPONENT: PHOTO GALLERY
// ============================================================================

interface PlaceGalleryProps {
  images: GalleryImage[];
  onOpenLightbox: (index: number) => void;
  reducedMotion: boolean | null;
}

const GalleryCard = memo(({ 
  image, 
  index, 
  className = "", 
  overlayText, 
  onOpenLightbox 
}: { 
  image: GalleryImage; 
  index: number; 
  className?: string; 
  overlayText?: string;
  onOpenLightbox: (idx: number) => void; 
}) => (
  <button
    type="button"
    onClick={() => onOpenLightbox(index)}
    aria-label={overlayText ? `View photo ${index + 1} and ${overlayText.toLowerCase()}` : `View photo ${index + 1}`}
    className={`relative rounded-[24px] overflow-hidden group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] bg-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 block w-full h-full ${className}`}
  >
    <Image 
      src={image.image} 
      alt={`Gallery photo ${index + 1}`} 
      fill 
      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
      sizes="(max-width: 1440px) 50vw, 100vw" 
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    
    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/30 opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 shadow-md">
      <ExpandArrowsIcon />
    </div>

    {overlayText && (
      <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl md:text-2xl tracking-wider">
        {overlayText}
      </div>
    )}
  </button>
));
GalleryCard.displayName = "GalleryCard";

const PlaceGallery = memo(({ images, onOpenLightbox, reducedMotion }: PlaceGalleryProps) => {
  if (!images || images.length === 0) return null;
  const imageCount = images.length;

  return (
    <section className="py-12 md:py-16 px-0 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-6 md:px-0">
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
            PHOTO GALLERY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Visual Exploration
          </h2>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (< 768px) ── */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3 px-6">
          <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
            Swipe to explore photos 
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 px-6 snap-x snap-mandatory scrollbar-none w-full" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenLightbox(idx)}
              aria-label={`View photo ${idx + 1} of ${imageCount}`}
              className="relative w-[85vw] max-w-[400px] aspect-[4/3] rounded-[24px] shrink-0 snap-center overflow-hidden shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] group bg-slate-100"
            >
              <Image src={img.image} alt={`Gallery mobile ${idx + 1}`} fill sizes="(max-width: 768px) 85vw, 400px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-md">
                <ExpandArrowsIcon />
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full tracking-widest shadow-sm">
                {idx + 1} / {imageCount}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── TABLET LAYOUT (768px - 1023px) ── */}
      <div className="hidden md:flex lg:hidden flex-col gap-5 h-[700px]">
        {/* Always large featured top image on tablet */}
        <div className="w-full flex-[1.2] relative rounded-[28px] overflow-hidden">
           <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} className="w-full h-full" />
        </div>
        {/* Dynamic bottom grid for remaining items */}
        {imageCount > 1 && (
          <div className={`w-full flex-1 grid gap-5 ${
            imageCount === 2 ? 'grid-cols-1' : imageCount === 3 ? 'grid-cols-2' : imageCount === 4 ? 'grid-cols-3' : 'grid-cols-4'
          }`}>
            {images.slice(1, 5).map((img, i) => (
              <GalleryCard 
                key={i + 1} 
                image={img} 
                index={i + 1} 
                onOpenLightbox={onOpenLightbox}
                className="w-full h-full"
                overlayText={i === 3 && imageCount > 5 ? `+${imageCount - 5}` : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── LAPTOP & DESKTOP LAYOUT (>= 1024px) ── */}
      <div className="hidden lg:grid grid-cols-12 gap-6 h-[500px] xl:h-[600px]">
        {imageCount === 1 && (
          <div className="col-span-12 w-full h-full">
            <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
          </div>
        )}
        
        {imageCount === 2 && (
          <>
            <div className="col-span-6 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-6 w-full h-full">
              <GalleryCard image={images[1]} index={1} onOpenLightbox={onOpenLightbox} />
            </div>
          </>
        )}
        
        {imageCount === 3 && (
          <>
            <div className="col-span-8 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-4 flex flex-col gap-6 w-full h-full">
              <div className="flex-1"><GalleryCard image={images[1]} index={1} onOpenLightbox={onOpenLightbox} /></div>
              <div className="flex-1"><GalleryCard image={images[2]} index={2} onOpenLightbox={onOpenLightbox} /></div>
            </div>
          </>
        )}
        
        {imageCount === 4 && (
          <>
            <div className="col-span-8 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-4 grid grid-cols-2 grid-rows-2 gap-6 w-full h-full">
              <div className="col-span-2 row-span-1"><GalleryCard image={images[1]} index={1} onOpenLightbox={onOpenLightbox} /></div>
              <div className="col-span-1 row-span-1"><GalleryCard image={images[2]} index={2} onOpenLightbox={onOpenLightbox} /></div>
              <div className="col-span-1 row-span-1"><GalleryCard image={images[3]} index={3} onOpenLightbox={onOpenLightbox} /></div>
            </div>
          </>
        )}
        
        {imageCount >= 5 && (
          <>
            <div className="col-span-7 xl:col-span-8 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-5 xl:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 xl:gap-6 w-full h-full">
              {images.slice(1, 5).map((img, i) => (
                <div key={i + 1} className="col-span-1 row-span-1 w-full h-full">
                  <GalleryCard 
                    image={img} 
                    index={i + 1} 
                    onOpenLightbox={onOpenLightbox} 
                    overlayText={i === 3 && imageCount > 5 ? `+${imageCount - 5} More` : undefined}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
});
PlaceGallery.displayName = "PlaceGallery";

// ============================================================================
// SUB-COMPONENT: PLACE VIDEO
// ============================================================================

interface PlaceVideoProps {
  videoUrl?: string;
  reducedMotion: boolean | null;
}

const PlaceVideo = memo(({ videoUrl, reducedMotion }: PlaceVideoProps) => {
  if (!videoUrl || videoUrl.trim() === "") return null;

  const getEmbedUrl = (url: string) => {
    let finalUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      finalUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      if (id) finalUrl = `https://www.youtube.com/embed/${id}`;
    }
    return finalUrl;
  };

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
          CINEMATIC EXPERIENCE
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-8">
          Watch Video Tour
        </h2>
        <div className="relative w-full aspect-video rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_15px_35px_rgba(15,23,42,0.12)] border border-white/40 bg-slate-900">
          <iframe
            src={getEmbedUrl(videoUrl)}
            title="Place Video Tour"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </motion.div>
    </section>
  );
});
PlaceVideo.displayName = "PlaceVideo";

// ============================================================================
// SUB-COMPONENT: PLACE LOCATION & MAP
// ============================================================================

interface PlaceLocationProps {
  place: PlaceDetails;
  reducedMotion: boolean | null;
}

const PlaceLocation = memo(({ place, reducedMotion }: PlaceLocationProps) => {
  const mapUrl = getMapUrl(place);
  const hasCoords = place.latitude !== undefined && place.longitude !== undefined && place.latitude !== "" && place.longitude !== "";

  if (!hasCoords && !mapUrl) return null;

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
              LOCATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Find Your Way
            </h2>
          </div>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs tracking-[0.1em] text-white uppercase shadow-md hover:shadow-lg transition-all duration-300 self-start sm:self-auto bg-gradient-to-r from-[#0369A1] to-[#38BDF8]"
            >
              <MapPinIcon />
              <span>Open in Google Maps</span>
            </a>
          )}
        </div>
        {hasCoords && (
          <div className="relative w-full h-[400px] md:h-[480px] rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_12px_30px_rgba(15,23,42,0.08)] border border-white/60 bg-slate-200">
            <iframe
              src={`https://www.google.com/maps?q=$${place.latitude},${place.longitude}&z=15&output=embed`}
              title={`Map showing location of ${place.title}`}
              loading="lazy"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        )}
      </motion.div>
    </section>
  );
});
PlaceLocation.displayName = "PlaceLocation";

// ============================================================================
// SUB-COMPONENT: PLACE TAGS
// ============================================================================

const PlaceTags = memo(({ tags }: { tags?: string[] }) => {
  const validTags = tags?.filter((t) => t && t.trim() !== "");
  if (!validTags || validTags.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-2">
          Discover More:
        </span>
        {validTags.map((tag, idx) => (
          <span key={idx} className="px-4 py-2 rounded-full text-xs font-bold text-[#0284C7] bg-[#0284C7]/10 border border-[#0284C7]/20 shadow-xs uppercase tracking-wide backdrop-blur-md">
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
});
PlaceTags.displayName = "PlaceTags";

// ============================================================================
// SUB-COMPONENT: SKELETON LOADING STATE
// ============================================================================

const PlaceDetailsSkeleton = memo(() => (
  <div className="w-full min-h-screen bg-[#F8FCFF] animate-pulse">
    <div className="w-full h-[65vh] lg:h-[80vh] min-h-[480px] bg-slate-300/60 relative">
      <div className="absolute bottom-16 left-6 md:left-12 xl:left-20 max-w-[1400px] w-full pr-12">
        <div className="w-24 h-6 bg-slate-400/60 rounded-full mb-4" />
        <div className="w-3/4 max-w-xl h-12 bg-slate-400/60 rounded-xl mb-4" />
        <div className="w-full max-w-2xl h-16 bg-slate-400/40 rounded-xl mb-6" />
        <div className="flex gap-4">
          <div className="w-36 h-12 bg-slate-400/60 rounded-full" />
          <div className="w-36 h-12 bg-slate-400/60 rounded-full" />
        </div>
      </div>
    </div>
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 -mt-16 relative z-20 mb-16">
      <div className="w-full h-32 rounded-[32px] border bg-slate-200/80 border-white/60 shadow-lg" />
    </div>
  </div>
));
PlaceDetailsSkeleton.displayName = "PlaceDetailsSkeleton";

// ============================================================================
// SUB-COMPONENT: NOT FOUND STATE (404)
// ============================================================================

const PlaceNotFound = memo(() => {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center select-none" style={{ background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)` }}>
      <div className="w-20 h-20 rounded-full bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] mb-6 shadow-inner border border-[#0284C7]/20">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-3">Destination Not Found</h1>
      <p className="text-base sm:text-lg text-[#64748B] max-w-md mx-auto leading-relaxed mb-8">The place you’re looking for may have been moved or is currently unavailable in our active curation.</p>
      <button onClick={() => router.push("/")} className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-white uppercase shadow-[0_6px_20px_rgba(2,132,199,0.35)] hover:shadow-[0_10px_30px_rgba(2,132,199,0.5)] transition-all transform hover:-translate-y-0.5 bg-gradient-to-r from-[#0369A1] to-[#38BDF8]">
        Return to Home
      </button>
    </div>
  );
});
PlaceNotFound.displayName = "PlaceNotFound";

// ============================================================================
// SUB-COMPONENT: ERROR STATE
// ============================================================================

const PlaceErrorState = memo(({ onRetry }: { onRetry: () => void }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center select-none" style={{ background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)` }}>
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 shadow-inner border border-amber-500/20">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-3">Unable to Load Destination</h1>
      <p className="text-base sm:text-lg text-[#64748B] max-w-md mx-auto leading-relaxed mb-8">We encountered a network issue while retrieving this destination. Please check your connection and try again.</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button onClick={onRetry} className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-white uppercase shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-[#0369A1] to-[#38BDF8]">
          Try Again
        </button>
        <button onClick={() => router.push("/")} className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-[#0F172A] uppercase bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all">
          Return Home
        </button>
      </div>
    </div>
  );
});
PlaceErrorState.displayName = "PlaceErrorState";

// ============================================================================
// MAIN PAGE ROUTE COMPONENT
// ============================================================================

export default function PlaceDetailsPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const reducedMotion = useReducedMotion();

  const fetchPlaceDetails = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true); setError(false); setNotFound(false);
      const response = await api.get<PlaceApiResponse>(`/api/places/${slug}`);
      const placeData = response?.place || response?.data;
      
      if (placeData && placeData.status === "active") {
        setPlace(placeData);
      } else {
        setNotFound(true);
      }
    } catch (err: any) {
      if (err?.status === 404 || err?.message?.includes("404")) {
        setNotFound(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPlaceDetails();
  }, [fetchPlaceDetails]);

  // Ensure data consistency across the entire component tree
  const validGalleryImages = useMemo(() => {
    if (!place?.galleryImages) return [];
    return place.galleryImages.filter((img) => img && img.image && img.image.trim() !== "");
  }, [place?.galleryImages]);

  const handleOpenLightbox = useCallback((index: number = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  if (loading) return <main className="min-h-screen flex flex-col bg-[#F8FCFF]"><Navbar /><PlaceDetailsSkeleton /></main>;
  if (notFound || !place) return <main className="min-h-screen flex flex-col bg-[#F8FCFF]"><Navbar /><PlaceNotFound /></main>;
  if (error) return <main className="min-h-screen flex flex-col bg-[#F8FCFF]"><Navbar /><PlaceErrorState onRetry={fetchPlaceDetails} /></main>;

  return (
    <main
      className="min-h-screen flex flex-col pb-24 select-none"
      style={{ background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)` }}
    >
      <Navbar />
      
      <PlaceHero
        place={place}
        hasGallery={validGalleryImages.length > 0}
        onOpenGallery={() => handleOpenLightbox(0)}
        reducedMotion={reducedMotion}
      />

      <PlaceInformation place={place} reducedMotion={reducedMotion} />
      <PlaceStory place={place} reducedMotion={reducedMotion} />
      
      <PlaceGallery
        images={validGalleryImages}
        onOpenLightbox={handleOpenLightbox}
        reducedMotion={reducedMotion}
      />

      <PlaceVideo videoUrl={place.video} reducedMotion={reducedMotion} />
      <PlaceLocation place={place} reducedMotion={reducedMotion} />
      <PlaceTags tags={place.tags} />

      {lightboxOpen && validGalleryImages.length > 0 && (
        <GalleryLightbox
          images={validGalleryImages}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
        />
      )}
    </main>
  );
}