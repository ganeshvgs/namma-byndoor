// path: app/places/[slug]/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { api, ApiError } from "../../lib/api";

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

// ============================================================================
// HELPER: MAP URL GENERATOR
// ============================================================================

function getMapUrl(place: PlaceDetails): string | null {
  if (place.googleMapsUrl && place.googleMapsUrl.trim() !== "") {
    return place.googleMapsUrl;
  }
  if (place.latitude !== undefined && place.longitude !== undefined && place.latitude !== "" && place.longitude !== "") {
    return `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
  }
  return null;
}

// ============================================================================
// SUB-COMPONENT: PLACE HERO
// ============================================================================

interface PlaceHeroProps {
  place: PlaceDetails;
  onOpenGallery?: () => void;
  reducedMotion: boolean | null;
}

const PlaceHero = memo(({ place, onOpenGallery, reducedMotion }: PlaceHeroProps) => {
  const mapUrl = getMapUrl(place);
  const categoryName = typeof place.category === "object" ? place.category?.name : place.category;
  const hasGallery = place.galleryImages && place.galleryImages.length > 0;

  return (
    <section className="relative w-full h-[65vh] lg:h-[80vh] min-h-[480px] max-h-[900px] overflow-hidden select-none bg-slate-900">
      {/* Cover Image */}
      <Image
        src={place.coverImage || "/images/placeholder-place.jpg"}
        alt={place.title}
        fill
        priority
        loading="eager"
        sizes="100vw"
        className="object-cover transition-transform duration-1000 ease-out"
      />

      {/* Dark Gradient over Image ONLY for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-90 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {categoryName && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
                {categoryName}
              </span>
            )}

            {place.featured === true && (
              <span
                className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-md border border-white/30 flex items-center gap-1.5"
                style={{
                  background: `linear-gradient(135deg, ${TOKENS.primary} 0%, ${TOKENS.secondary} 100%)`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg mb-4">
            {place.title}
          </h1>

          {/* Short Description */}
          {place.shortDescription && (
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow mb-8 line-clamp-3">
              {place.shortDescription}
            </p>
          )}

          {/* Action Buttons */}
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
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase transition-all duration-300 bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/50 transform hover:-translate-y-0.5 shadow-sm cursor-pointer"
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
        style={{
          backgroundColor: TOKENS.cardBg,
          borderColor: TOKENS.border,
        }}
      >
        <div className={`grid grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6 sm:gap-8`}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3.5 ${
                idx !== 0 && idx % 2 === 1 ? "border-l border-slate-200/60 pl-4 sm:pl-6" : ""
              } ${
                idx >= 2 ? "lg:border-l lg:border-slate-200/60 lg:pl-6 pt-4 sm:pt-0 border-t border-slate-100 sm:border-t-0" : ""
              }`}
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
            <p key={idx} className="leading-8">
              {para}
            </p>
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

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
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
      document.body.style.overflow = "auto";
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-8 select-none"
      >
        {/* Top Header Controls */}
        <div className="w-full max-w-7xl flex items-center justify-between text-white z-10">
          <span className="text-xs md:text-sm font-extrabold tracking-widest uppercase bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            Photo {currentIndex + 1} of {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close Gallery"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Image Viewport */}
        <div className="relative w-full max-w-6xl h-[70vh] flex items-center justify-center my-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <Image
                src={images[currentIndex]?.image || "/images/placeholder-place.jpg"}
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
              className="absolute left-2 md:left-4 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer z-10"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 md:right-4 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer z-10"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div className="w-full max-w-4xl flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 scrollbar-none">
            {images.map((img, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "border-[#38BDF8] scale-105 opacity-100 shadow-md"
                    : "border-transparent opacity-40 hover:opacity-80"
                }`}
              >
                <Image src={img.image} alt="thumbnail" fill sizes="64px" className="object-cover" />
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
  images?: GalleryImage[];
  onOpenLightbox: (index: number) => void;
  reducedMotion: boolean | null;
}

const PlaceGallery = memo(({ images, onOpenLightbox, reducedMotion }: PlaceGalleryProps) => {
  if (!images || images.length === 0) return null;

  const validImages = images.filter((img) => img && img.image && img.image.trim() !== "");
  if (validImages.length === 0) return null;

  const largeImage = validImages[0];
  const gridImages = validImages.slice(1, 5);

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
            PHOTO GALLERY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Visual Exploration
          </h2>
        </div>

        {validImages.length > 5 && (
          <button
            type="button"
            onClick={() => onOpenLightbox(0)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] tracking-wider uppercase group cursor-pointer self-start sm:self-auto"
          >
            <span>View All {validImages.length} Photos</span>
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        )}
      </div>

      {/* Desktop & Tablet Layout: 1 Large Left + 4 Right Grid */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 lg:gap-6 h-[460px] lg:h-[540px]">
        {/* Large Left Image (Cols 1-7) */}
        <motion.div
          whileHover={reducedMotion ? undefined : { scale: 1.01 }}
          transition={{ duration: 0.3 }}
          onClick={() => onOpenLightbox(0)}
          className="col-span-7 relative rounded-[28px] overflow-hidden bg-slate-100 cursor-pointer shadow-md group"
        >
          <Image
            src={largeImage.image}
            alt="Gallery hero"
            fill
            sizes="(max-width: 1200px) 50vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-white/30">
              Expand Photo
            </span>
          </div>
        </motion.div>

        {/* Four Right Images Grid (Cols 8-12) */}
        <div className="col-span-5 grid grid-cols-2 gap-4 lg:gap-6 h-full">
          {gridImages.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => onOpenLightbox(idx + 1)}
              className="relative rounded-[22px] overflow-hidden bg-slate-100 cursor-pointer shadow-sm group"
            >
              <Image
                src={img.image}
                alt={`Gallery thumbnail ${idx + 2}`}
                fill
                sizes="(max-width: 1200px) 25vw, 20vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              {idx === 3 && validImages.length > 5 && (
                <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-lg sm:text-xl">
                  +{validImages.length - 5} More
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Layout: Horizontally Swipeable Gallery */}
      <div className="md:hidden flex gap-3.5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
        {validImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onOpenLightbox(idx)}
            className="relative w-[280px] h-[340px] rounded-[24px] overflow-hidden shrink-0 bg-slate-100 snap-center shadow-md cursor-pointer"
          >
            <Image src={img.image} alt={`Gallery mobile ${idx + 1}`} fill sizes="280px" className="object-cover" />
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              {idx + 1} / {validImages.length}
            </div>
          </div>
        ))}
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

  // Transform standard YouTube watch URLs to embedded format
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

  const embedUrl = getEmbedUrl(videoUrl);

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
            src={embedUrl}
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
  const hasCoords =
    place.latitude !== undefined &&
    place.longitude !== undefined &&
    place.latitude !== "" &&
    place.longitude !== "";

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
              src={`https://www.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`}
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

interface PlaceTagsProps {
  tags?: string[];
}

const PlaceTags = memo(({ tags }: PlaceTagsProps) => {
  if (!tags || tags.length === 0) return null;

  const validTags = tags.filter((t) => t && t.trim() !== "");
  if (validTags.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-2">
          Discover More:
        </span>
        {validTags.map((tag, idx) => (
          <span
            key={idx}
            className="px-4 py-2 rounded-full text-xs font-bold text-[#0284C7] bg-[#0284C7]/10 border border-[#0284C7]/20 shadow-xs uppercase tracking-wide backdrop-blur-md"
          >
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
    {/* Hero Skeleton */}
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

    {/* Information Card Skeleton */}
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 -mt-16 relative z-20 mb-16">
      <div
        className="w-full h-32 rounded-[32px] border bg-slate-200/80 border-white/60 shadow-lg"
        style={{ backgroundColor: TOKENS.cardBg }}
      />
    </div>

    {/* Story Content Skeleton */}
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="w-28 h-6 bg-slate-300/80 rounded-full mb-4" />
      <div className="w-2/3 h-10 bg-slate-300/80 rounded-xl mb-8" />
      <div className="space-y-4">
        <div className="w-full h-5 bg-slate-200 rounded" />
        <div className="w-full h-5 bg-slate-200 rounded" />
        <div className="w-5/6 h-5 bg-slate-200 rounded" />
      </div>
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
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center select-none"
      style={{
        background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)`,
      }}
    >
      <div className="w-20 h-20 rounded-full bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] mb-6 shadow-inner border border-[#0284C7]/20">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-3">
        Destination Not Found
      </h1>
      <p className="text-base sm:text-lg text-[#64748B] max-w-md mx-auto leading-relaxed mb-8">
        The place you’re looking for may have been moved or is currently unavailable in our active curation.
      </p>
      <button
        type="button"
        onClick={() => router.push("/")}
        className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-white uppercase shadow-[0_6px_20px_rgba(2,132,199,0.35)] hover:shadow-[0_10px_30px_rgba(2,132,199,0.5)] transition-all transform hover:-translate-y-0.5 bg-gradient-to-r from-[#0369A1] to-[#38BDF8] cursor-pointer"
      >
        Return to Home
      </button>
    </div>
  );
});
PlaceNotFound.displayName = "PlaceNotFound";

// ============================================================================
// SUB-COMPONENT: ERROR STATE
// ============================================================================

interface PlaceErrorStateProps {
  onRetry: () => void;
}

const PlaceErrorState = memo(({ onRetry }: PlaceErrorStateProps) => {
  const router = useRouter();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center select-none"
      style={{
        background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)`,
      }}
    >
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 shadow-inner border border-amber-500/20">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-3">
        Unable to Load Destination
      </h1>
      <p className="text-base sm:text-lg text-[#64748B] max-w-md mx-auto leading-relaxed mb-8">
        We encountered a network issue while retrieving this destination. Please check your connection and try again.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onRetry}
          className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-white uppercase shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-[#0369A1] to-[#38BDF8] cursor-pointer"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-[#0F172A] uppercase bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all cursor-pointer"
        >
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
      setLoading(true);
      setError(false);
      setNotFound(false);

      const response = await api.get<PlaceApiResponse>(`/api/places/${slug}`);

      if (response && (response.place || response.data)) {
        const placeData = response.place || response.data;
        if (placeData && placeData.status === "active") {
          setPlace(placeData);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (err: any) {
      console.error(`Failed to fetch place details for slug "${slug}":`, err);
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

  const handleOpenLightbox = useCallback((index: number = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F8FCFF]">
        <Navbar />
        <PlaceDetailsSkeleton />
      </main>
    );
  }

  // 2. Custom Not Found State (404)
  if (notFound || !place) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F8FCFF]">
        <Navbar />
        <PlaceNotFound />
      </main>
    );
  }

  // 3. Network Error State
  if (error) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F8FCFF]">
        <Navbar />
        <PlaceErrorState onRetry={fetchPlaceDetails} />
      </main>
    );
  }

  // 4. Successful Render
  return (
    <main
      className="min-h-screen flex flex-col pb-24 select-none"
      style={{
        background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)`,
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <PlaceHero
        place={place}
        onOpenGallery={() => handleOpenLightbox(0)}
        reducedMotion={reducedMotion}
      />

      {/* Floating Information Card */}
      <PlaceInformation place={place} reducedMotion={reducedMotion} />

      {/* About / Story Section */}
      <PlaceStory place={place} reducedMotion={reducedMotion} />

      {/* Photo Gallery Section */}
      <PlaceGallery
        images={place.galleryImages}
        onOpenLightbox={handleOpenLightbox}
        reducedMotion={reducedMotion}
      />

      {/* Video Section (Only renders when video exists) */}
      <PlaceVideo videoUrl={place.video} reducedMotion={reducedMotion} />

      {/* Location & Interactive Map Section */}
      <PlaceLocation place={place} reducedMotion={reducedMotion} />

      {/* Tags Section */}
      <PlaceTags tags={place.tags} />

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxOpen && place.galleryImages && (
        <GalleryLightbox
          images={place.galleryImages}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
        />
      )}
    </main>
  );
}