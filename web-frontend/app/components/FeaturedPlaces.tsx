// path: web-frontend/app/components/FeaturedPlaces.tsx
"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
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
  shortDescription: string;
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
  primary: "#0284C7",
  secondary: "#38BDF8",
  dark: "#0F172A",
  bgFrom: "#F8FCFF",
  bgTo: "#EEF8FF",
  cardBg: "rgba(255, 255, 255, 0.75)",
  cardBorder: "rgba(255, 255, 255, 0.35)",
  hoverGlow: "rgba(2, 132, 199, 0.18)",
} as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================================================
// OUTLINE SVG ICONS (PREMIUM & LIGHTWEIGHT)
// ============================================================================

const CalendarIcon = memo(() => (
  <svg className="w-4 h-4 text-[#0284C7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
));
CalendarIcon.displayName = "CalendarIcon";

const TicketIcon = memo(() => (
  <svg className="w-4 h-4 text-[#0284C7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
));
TicketIcon.displayName = "TicketIcon";

const ClockIcon = memo(() => (
  <svg className="w-4 h-4 text-[#0284C7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
));
ClockIcon.displayName = "ClockIcon";

const ArrowRightIcon = memo(() => (
  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
));
ArrowRightIcon.displayName = "ArrowRightIcon";

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const SectionBackground = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
    {/* Very light luxury gradient background */}
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        background: `linear-gradient(180deg, ${TOKENS.bgFrom} 0%, ${TOKENS.bgTo} 100%)`,
      }}
    />
    {/* Subtle blue radial ambient glow behind the grid */}
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] lg:w-[1200px] h-[600px] rounded-full opacity-60 blur-[120px]"
      style={{
        background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(2,132,199,0.05) 50%, transparent 80%)",
      }}
    />
  </div>
));
SectionBackground.displayName = "SectionBackground";

const SectionHeader = memo(() => (
  <motion.div 
    variants={headerVariants}
    className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-8"
  >
    <div className="max-w-2xl">
      {/* Small Label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
        <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#0284C7] uppercase">
          DISCOVER
        </span>
      </div>

      {/* Large Heading */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15] mb-4">
        Featured Places
      </h2>

      {/* Small Description */}
      <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
        Discover the most beautiful destinations around Byndoor carefully selected for unforgettable experiences.
      </p>
    </div>

    {/* View All Places Button (Login Page Style Pill) */}
    <div>
      <Link href="/places">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="inline-flex items-center gap-3 px-7 py-4 rounded-full font-bold text-xs tracking-[0.1em] text-white uppercase cursor-pointer shadow-[0_4px_20px_rgba(2,132,199,0.28)] hover:shadow-[0_8px_28px_rgba(2,132,199,0.4)] transition-shadow duration-300"
          style={{
            background: "linear-gradient(135deg, #0369A1 0%, #0284C7 50%, #38BDF8 100%)",
          }}
        >
          <span>View All Places</span>
          <span className="text-lg leading-none">&rarr;</span>
        </motion.button>
      </Link>
    </div>
  </motion.div>
));
SectionHeader.displayName = "SectionHeader";

const PlaceSkeletonCard = memo(() => (
  <div 
    className="w-full rounded-[32px] overflow-hidden p-3.5 sm:p-4 border backdrop-blur-xl animate-pulse"
    style={{
      backgroundColor: TOKENS.cardBg,
      borderColor: TOKENS.cardBorder,
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
    }}
  >
    {/* Image Skeleton */}
    <div className="w-full aspect-[16/10] bg-slate-200/80 rounded-[24px] mb-5" />
    
    {/* Content Skeleton */}
    <div className="px-2 pb-2">
      <div className="h-7 bg-slate-200/80 rounded-lg w-3/4 mb-3" />
      <div className="h-4 bg-slate-200/60 rounded-md w-full mb-1.5" />
      <div className="h-4 bg-slate-200/60 rounded-md w-5/6 mb-6" />

      {/* Info Row Skeleton */}
      <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-slate-100 mb-6">
        <div className="h-8 bg-slate-100 rounded-lg" />
        <div className="h-8 bg-slate-100 rounded-lg" />
        <div className="h-8 bg-slate-100 rounded-lg" />
      </div>

      {/* Button Skeleton */}
      <div className="h-12 bg-slate-200/80 rounded-full w-full" />
    </div>
  </div>
));
PlaceSkeletonCard.displayName = "PlaceSkeletonCard";

const EmptyState = memo(() => (
  <motion.div 
    variants={headerVariants}
    className="w-full max-w-xl mx-auto text-center py-16 px-8 rounded-[32px] border backdrop-blur-2xl shadow-xl my-8"
    style={{
      backgroundColor: TOKENS.cardBg,
      borderColor: TOKENS.cardBorder,
    }}
  >
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-[#0284C7]/10 to-[#38BDF8]/20 flex items-center justify-center text-[#0284C7] shadow-inner">
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
      Featured Places Coming Soon
    </h3>
    <p className="text-slate-500 font-normal max-w-md mx-auto leading-relaxed">
      Stay tuned as we curate and add amazing destinations around Byndoor for your next unforgettable journey.
    </p>
  </motion.div>
));
EmptyState.displayName = "EmptyState";

// ============================================================================
// MAIN PLACE CARD (AIRBNB LUXURY CRAFTSMANSHIP)
// ============================================================================

const PlaceCard = memo(({ place }: { place: Place }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="group relative w-full rounded-[32px] overflow-hidden p-3.5 sm:p-4 border backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between"
      style={{
        backgroundColor: TOKENS.cardBg,
        borderColor: TOKENS.cardBorder,
        boxShadow: "0 10px 35px -10px rgba(15, 23, 42, 0.07), 0 4px 12px -2px rgba(2, 132, 199, 0.03)",
      }}
    >
      {/* Invisible overlay link making entire card clickable */}
      <Link 
        href={`/places/${place.slug || place._id}`} 
        className="absolute inset-0 z-20 focus:outline-none"
        aria-label={`Explore ${place.title}`}
      />

      <div>
        {/* Top Image Container (16:10 Aspect Ratio) */}
        <div className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden mb-5 bg-slate-100 transform-gpu">
          <Image
            src={place.coverImage || "/images/placeholder-place.jpg"}
            alt={place.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[0.25,1,0.5,1] group-hover:scale-[1.08] will-change-transform"
            priority={false}
          />

          {/* Top Subtle Dark Gradient for Badge Contrast */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/20 to-transparent opacity-80 z-10 pointer-events-none" />
          
          {/* Bottom Warm Shadow Gradient for Depth */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent opacity-60 z-10 pointer-events-none" />

          {/* Top Left: Category Badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white bg-slate-900/60 backdrop-blur-md border border-white/20 shadow-sm">
              {place.category?.name || "Destination"}
            </span>
          </div>

          {/* Top Right: Featured Badge with Blue Gradient */}
          {place.featured && (
            <div className="absolute top-3.5 right-3.5 z-10">
              <span 
                className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md border border-white/30 flex items-center gap-1.5"
                style={{
                  background: "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content Block */}
        <div className="px-2">
          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2 group-hover:text-[#0284C7] transition-colors duration-300 line-clamp-1">
            {place.title}
          </h3>

          {/* Short Description (2 Lines Max, Muted) */}
          <p className="text-sm text-slate-500 font-normal leading-relaxed line-clamp-2 mb-5 min-h-[2.5rem]">
            {place.shortDescription || "Experience the serene beauty and rich cultural heritage of this iconic Byndoor landmark."}
          </p>

          {/* Information Row (Best Time, Entry Fee, Opening Hours) */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-200/60 mb-5 bg-white/40 rounded-2xl px-3 backdrop-blur-sm">
            {/* Best Time */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-0.5 text-slate-400">
                <CalendarIcon />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Time</span>
              </div>
              <span className="text-xs font-bold text-slate-700 truncate w-full" title={place.bestTime || "Oct - Mar"}>
                {place.bestTime || "Oct - Mar"}
              </span>
            </div>

            {/* Entry Fee */}
            <div className="flex flex-col items-center text-center border-x border-slate-200/60 px-1">
              <div className="flex items-center gap-1 mb-0.5 text-slate-400">
                <TicketIcon />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Entry</span>
              </div>
              <span className="text-xs font-bold text-slate-700 truncate w-full" title={place.entryFee || "Free"}>
                {place.entryFee || "Free"}
              </span>
            </div>

            {/* Opening Hours */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-0.5 text-slate-400">
                <ClockIcon />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Hours</span>
              </div>
              <span className="text-xs font-bold text-slate-700 truncate w-full" title={place.openingHours || "6 AM - 6 PM"}>
                {place.openingHours || "6 AM - 6 PM"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Explore Button */}
      <div className="px-2 pb-1 pt-1">
        <div 
          className="w-full py-3.5 px-6 rounded-full font-bold text-xs tracking-[0.12em] text-white uppercase flex items-center justify-between transition-all duration-500 group-hover:shadow-[0_8px_24px_rgba(2,132,199,0.35)] relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0369A1 0%, #0284C7 50%, #38BDF8 100%)",
          }}
        >
          {/* Subtle Button Hover Glow */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <span className="relative z-10">Explore Place</span>
          <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
            <ArrowRightIcon />
          </span>
        </div>
      </div>

      {/* Card Hover Glow Ring Effect */}
      <div 
        className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-[#38BDF8]/40 transition-colors duration-500 pointer-events-none z-30" 
        style={{
          boxShadow: "inset 0 0 20px rgba(56, 189, 248, 0)",
        }}
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
        
        // Use your project's existing API helper
        const response = await api.get<PlacesResponse>("/api/places");
        
        if (!isMounted) return;

        const rawData = response.data || response.places || (Array.isArray(response) ? response : []);

        if (Array.isArray(rawData)) {
          // 1. Filter only active and featured places
          // 2. Sort ascending by priority
          // 3. Slice maximum of 6 destinations
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

  // Responsive padding scale: 24px mobile, 48px tablet, 80px desktop
  return (
    <section 
      className="relative w-full py-[120px] overflow-hidden select-none"
      aria-label="Featured Places in Byndoor"
    >
      {/* Background Gradient & Radial Glow */}
      <SectionBackground />

      {/* Max Width 1400px Centered Container with Apple Padding Scale */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20">
        
        {/* Section Header */}
        <SectionHeader />

        {/* Dynamic Content States */}
        <AnimatePresence mode="wait">
          {loading ? (
            /* LOADING STATE: Premium Shimmer Skeletons */
            <motion.div 
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
            >
              {[...Array(3)].map((_, idx) => (
                <PlaceSkeletonCard key={idx} />
              ))}
            </motion.div>
          ) : error || places.length === 0 ? (
            /* EMPTY / ERROR STATE: Elegant Illustration */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState />
            </motion.div>
          ) : (
            /* SUCCESS STATE: Responsive Staggered Grid */
            <motion.div 
              key="grid"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
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