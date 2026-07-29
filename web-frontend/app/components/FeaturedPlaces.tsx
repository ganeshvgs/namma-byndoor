"use client";

import React, { useState, useEffect, memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence, useReducedMotion } from "framer-motion";
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
  cardBg: "rgba(255, 255, 255, 0.95)", // Replaced heavy backdrop blur with a clean, opaque background
  cardBorder: "rgba(255, 255, 255, 0.8)",
} as const;

// Base variants - will be modified dynamically if the user prefers reduced motion
const baseSectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Sped up the stagger so the section finishes its entrance quickly
      delayChildren: 0.05,
    },
  },
};

const baseHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const baseCardVariants: Variants = {
  // Removed scale animation; opacity + simple translation is cheaper and cleaner
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

// ============================================================================
// OUTLINE SVG ICONS
// ============================================================================

const ArrowUpRightIcon = memo(() => (
  // Hover animation moved purely to CSS transform for zero main-thread cost
  <svg
    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5"
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
    {/* Optimization: Removed extremely expensive blur-[100px]. 
        Achieved the exact same visual using a natively feathered radial gradient. */}
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[1000px] h-[400px] rounded-full opacity-60"
      style={{
        background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(2,132,199,0.05) 40%, transparent 70%)",
      }}
    />
  </div>
));
SectionBackground.displayName = "SectionBackground";

const SectionHeader = memo(({ variants }: { variants: Variants }) => (
  <motion.div variants={variants} className="flex flex-col items-start mb-8 sm:mb-10 lg:mb-12">
    <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 mb-2.5 sm:mb-3">
      {/* Optimization: Removed infinite animate-pulse to let the browser go to sleep once rendered */}
      <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
      <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] text-[#0284C7] uppercase">
        DISCOVER
      </span>
    </div>

    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
      Featured Places
    </h2>
  </motion.div>
));
SectionHeader.displayName = "SectionHeader";

const PlaceSkeletonCard = memo(() => (
  // Optimization: Removed backdrop-blur-xl and heavy shadows from temporary skeletons
  <div
    className="w-full rounded-[20px] sm:rounded-[28px] p-2 sm:p-3 border animate-pulse"
    style={{
      backgroundColor: TOKENS.cardBg,
      borderColor: TOKENS.cardBorder,
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
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

const EmptyState = memo(({ variants }: { variants: Variants }) => (
  // Optimization: Removed backdrop-blur-2xl
  <motion.div
    variants={variants}
    className="w-full max-w-lg mx-auto text-center py-12 px-6 rounded-[24px] border shadow-md my-4"
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
// COMPACT PREVIEW CARD
// ============================================================================

const PlaceCard = memo(({ place, variants }: { place: Place; variants: Variants }) => {
  return (
    <motion.div
      variants={variants}
      // Optimization: Replaced Framer Motion's JS-driven hover springs with pure CSS transitions.
      // Optimization: Replaced massive backdrop-blur-2xl with clean opacity.
      // Optimization: Targeting transition purely to the 3 properties that change, avoiding 'transition-all'
      className="group relative w-full rounded-[20px] sm:rounded-[28px] p-2 sm:p-3 border transition-[transform,border-color,box-shadow] duration-300 ease-out flex flex-col justify-between md:hover:-translate-y-1 md:hover:shadow-[0_12px_30px_-10px_rgba(15,23,42,0.1)] active:scale-[0.98]"
      style={{
        backgroundColor: TOKENS.cardBg,
        borderColor: TOKENS.cardBorder,
        boxShadow: "0 4px 15px -5px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Link
        href={`/places/${place.slug || place._id}`}
        className="absolute inset-0 z-20 focus:outline-none"
        aria-label={`Explore ${place.title}`}
      />

      <div>
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[14px] sm:rounded-[20px] overflow-hidden bg-slate-100">
          <Image
            src={place.coverImage || "/images/placeholder-place.jpg"}
            alt={place.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
            // Optimization: Removed permanent will-change-transform. 
            // Optimization: Scoped hover scaling primarily to desktop (md:) to save mobile touch GPU.
            className="object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.06]"
            loading="lazy" 
          />

          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 via-black/10 to-transparent opacity-80 z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent opacity-50 z-10 pointer-events-none" />

          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 max-w-[65%] sm:max-w-[70%]">
            {/* Optimization: Swapped backdrop-blur for a highly performant 75% solid background */}
            <span className="block truncate px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900/75 border border-white/10 shadow-sm">
              {place.category?.name || "Destination"}
            </span>
          </div>

          {place.featured && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
              {/* Optimization: Removed the animated pulse from the featured dot to prevent constant painting */}
              <span
                className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/20 flex items-center gap-1 shadow-sm"
                style={{ background: "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)" }}
              >
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white shrink-0" />
                <span className="hidden xs:inline sm:inline">Featured</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 sm:pt-3 pb-0.5 sm:pb-1 px-1 sm:px-1.5 flex items-center justify-between gap-1.5 sm:gap-3">
        <h3 className="text-xs sm:text-base lg:text-lg font-bold text-[#0F172A] tracking-tight transition-colors duration-200 truncate w-full group-hover:text-[#0284C7]">
          {place.title}
        </h3>

        <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center transition-colors duration-300 md:group-hover:bg-[#0284C7] md:group-hover:text-white">
          <ArrowUpRightIcon />
        </div>
      </div>

      <div className="absolute inset-0 rounded-[20px] sm:rounded-[28px] border border-transparent transition-colors duration-300 pointer-events-none z-30 md:group-hover:border-[#38BDF8]/40" />
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
  const prefersReducedMotion = useReducedMotion();

  // Conditionally disable variants if the user prefers reduced motion
  const sectionVariants = useMemo(() => 
    prefersReducedMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : baseSectionVariants
  , [prefersReducedMotion]);

  const headerVariants = useMemo(() => 
    prefersReducedMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : baseHeaderVariants
  , [prefersReducedMotion]);

  const cardVariants = useMemo(() => 
    prefersReducedMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } } : baseCardVariants
  , [prefersReducedMotion]);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedPlaces = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch exactly as requested: dynamic, filtered, and sorted from the backend
        const response = await api.get<PlacesResponse>(
          "/api/places?status=active&featured=true&sort=priority&limit=6"
        );

        if (!isMounted) return;

        const rawData = response.data || response.places || (Array.isArray(response) ? response : []);

        if (Array.isArray(rawData)) {
          // Maintaining the defensive slice strictly in case the API limit is ignored
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
        <SectionHeader variants={headerVariants} />

        {/* Optimization: Removed 'mode="wait"' to prevent the UI from blocking layout while loading exits */}
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
            >
              {[...Array(6)].map((_, idx) => (
                <PlaceSkeletonCard key={idx} />
              ))}
            </motion.div>
          ) : error || places.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <EmptyState variants={headerVariants} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              // Only trigger the animation once. After entering, the grid sits entirely static.
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
            >
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} variants={cardVariants} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}