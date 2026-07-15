// path: web-frontend/app/components/FeaturedPlaces.tsx
"use client";

import React, { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PlaceCategory {
  _id?: string;
  name: string;
}

export interface Place {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  coverImage: string;
  category: PlaceCategory;
  bestTime?: string;
  entryFee?: string;
  openingHours?: string;
  priority: number;
  status: "active" | "inactive" | string;
  featured: boolean;
}

interface PlacesResponse {
  success?: boolean;
  data?: Place[];
  places?: Place[];
}

// ============================================================================
// DESIGN TOKENS & ANIMATION VARIANTS
// ============================================================================

const TOKENS = {
  bgFrom: "#F8FCFF",
  bgTo: "#EEF8FF",
  cardBg: "rgba(255, 255, 255, 0.75)",
  cardBorder: "rgba(255, 255, 255, 0.45)",
} as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================================================
// OUTLINE SVG ICONS
// ============================================================================

const ArrowUpRightIcon = memo(() => (
  <svg
    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
));
ArrowUpRightIcon.displayName = "ArrowUpRightIcon";

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const SectionBackground = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        background: `linear-gradient(180deg, ${TOKENS.bgFrom} 0%, ${TOKENS.bgTo} 100%)`,
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[1000px] h-[400px] rounded-full opacity-50 blur-[100px]"
      style={{
        background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(2,132,199,0.04) 50%, transparent 80%)",
      }}
    />
  </div>
));
SectionBackground.displayName = "SectionBackground";

const SectionHeader = memo(() => (
  <motion.div variants={headerVariants} className="flex flex-col items-start mb-8 sm:mb-10 lg:mb-12">
    {/* Small Label */}
    <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 mb-2.5 sm:mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
      <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] text-[#0284C7] uppercase">
        DISCOVER
      </span>
    </div>

    {/* Large Heading */}
    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
      Featured Places
    </h2>
  </motion.div>
));
SectionHeader.displayName = "SectionHeader";

const PlaceSkeletonCard = memo(() => (
  <div
    className="w-full rounded-[20px] sm:rounded-[28px] p-2 sm:p-3 border backdrop-blur-xl animate-pulse"
    style={{
      backgroundColor: TOKENS.cardBg,
      borderColor: TOKENS.cardBorder,
      boxShadow: "0 8px 30px -10px rgba(0,0,0,0.04)",
    }}
  >
    <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-200/80 rounded-[14px] sm:rounded-[20px] mb-2.5 sm:mb-3.5" />
    <div className="px-1 py-1 sm:py-1.5 flex items-center justify-between gap-2">
      <div className="h-4 sm:h-5 bg-slate-200/80 rounded-md w-2/3" />
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-200/80 shrink-0" />
    </div>
  </div>
));
PlaceSkeletonCard.displayName = "PlaceSkeletonCard";

const EmptyState = memo(() => (
  <motion.div
    variants={headerVariants}
    className="w-full max-w-lg mx-auto text-center py-12 px-6 rounded-[24px] border backdrop-blur-2xl shadow-lg my-4"
    style={{
      backgroundColor: TOKENS.cardBg,
      borderColor: TOKENS.cardBorder,
    }}
  >
    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#0284C7]/10 to-[#38BDF8]/20 flex items-center justify-center text-[#0284C7] shadow-inner">
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-1">
      Featured Places Coming Soon
    </h3>
    <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-sm mx-auto leading-relaxed">
      Stay tuned as we curate and add amazing destinations around Byndoor for your next journey.
    </p>
  </motion.div>
));
EmptyState.displayName = "EmptyState";

// ============================================================================
// COMPACT PREVIEW CARD (AIRBNB + APPLE LUXURY UI)
// ============================================================================

const PlaceCard = memo(({ place }: { place: Place }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className="group relative w-full rounded-[20px] sm:rounded-[28px] p-2 sm:p-3 border backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between"
      style={{
        backgroundColor: TOKENS.cardBg,
        borderColor: TOKENS.cardBorder,
        boxShadow: "0 8px 25px -8px rgba(15, 23, 42, 0.06), 0 2px 8px -2px rgba(2, 132, 199, 0.03)",
      }}
    >
      {/* Invisible overlay link making the entire card clickable */}
      <Link
        href={`/places/${place.slug || place._id}`}
        className="absolute inset-0 z-20 focus:outline-none"
        aria-label={`Explore ${place.title}`}
      />

      <div>
        {/* Cover Image Container (4:3 on mobile for touch comfort, 16:10 on sm+ for compactness) */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[14px] sm:rounded-[20px] overflow-hidden bg-slate-100 transform-gpu">
          <Image
            src={place.coverImage || "/images/placeholder-place.jpg"}
            alt={place.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-[0.25,1,0.5,1] group-hover:scale-[1.06] will-change-transform"
            priority={false}
          />

          {/* Subtle Top & Bottom Gradient Overlay for Badge Contrast */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 via-black/10 to-transparent opacity-80 z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent opacity-50 z-10 pointer-events-none" />

          {/* Top Left: Category Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 max-w-[65%] sm:max-w-[70%]">
            <span className="block truncate px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900/60 backdrop-blur-md border border-white/20 shadow-sm">
              {place.category?.name || "Destination"}
            </span>
          </div>

          {/* Top Right: Featured Badge */}
          {place.featured && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
              <span
                className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md border border-white/30 flex items-center gap-1"
                style={{
                  background: "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
                }}
              >
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                <span className="hidden xs:inline sm:inline">Featured</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Minimal Info Block */}
      <div className="pt-2 sm:pt-3 pb-0.5 sm:pb-1 px-1 sm:px-1.5 flex items-center justify-between gap-1.5 sm:gap-3">
        <h3 className="text-xs sm:text-base lg:text-lg font-bold text-[#0F172A] tracking-tight group-hover:text-[#0284C7] transition-colors duration-200 truncate w-full">
          {place.title}
        </h3>

        {/* Minimal Subtle Arrow CTA Icon */}
        <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0284C7]/8 group-hover:bg-[#0284C7] text-[#0284C7] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-[0_4px_12px_rgba(2,132,199,0.3)]">
          <ArrowUpRightIcon />
        </div>
      </div>

      {/* Subtle Hover Glow Ring Effect */}
      <div
        className="absolute inset-0 rounded-[20px] sm:rounded-[28px] border border-transparent group-hover:border-[#38BDF8]/40 transition-colors duration-300 pointer-events-none z-30"
      />
    </motion.div>
  );
});
PlaceCard.displayName = "PlaceCard";

// ============================================================================
// MAIN EXPORTED SECTION COMPONENT
// ============================================================================

export default function FeaturedPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedPlaces = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await api.get<PlacesResponse>("/api/places");

        if (!isMounted) return;

        const rawData = response.data || response.places || (Array.isArray(response) ? response : []);

        if (Array.isArray(rawData)) {
          const processedPlaces = rawData
            .filter((p) => p.status === "active" && p.featured === true)
            .sort((a, b) => (a.priority || 0) - (b.priority || 0))
            .slice(0, 6);

          setPlaces(processedPlaces);
        } else {
          setPlaces([]);
        }
      } catch (err) {
        console.error("Failed to fetch featured places:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden select-none" aria-label="Featured Places in Byndoor">
      <SectionBackground />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
        <SectionHeader />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
            >
              {[...Array(6)].map((_, idx) => (
                <PlaceSkeletonCard key={idx} />
              ))}
            </motion.div>
          ) : error || places.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
            >
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}