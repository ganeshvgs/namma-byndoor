// path: app/components/CategoryWisePlaces.tsx
"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { api } from "../lib/api";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Category {
  _id: string;
  name: string;
  coverImage?: string;
  icon?: string;
  description?: string;
  status: "active" | "inactive" | string;
  priority: number;
}

export interface PlaceCategoryRef {
  _id: string;
  name?: string;
}

export interface Place {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: PlaceCategoryRef;
  bestTime?: string;
  featured?: boolean;
  status: "active" | "inactive" | string;
  priority: number;
}

interface CategoriesResponse {
  success?: boolean;
  data?: Category[];
  categories?: Category[];
}

interface PlacesResponse {
  success?: boolean;
  data?: Place[];
  places?: Place[];
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
  muted: "#64748B",
  border: "rgba(255, 255, 255, 0.45)",
} as const;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const CategorySkeleton = memo(() => (
  <div
    className="w-[145px] h-[175px] md:w-[190px] md:h-[220px] shrink-0 rounded-[24px] bg-slate-200/70 border border-white/40 animate-pulse relative overflow-hidden"
    style={{ backgroundColor: TOKENS.cardBg }}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-slate-300/60 to-transparent" />
    <div className="absolute bottom-4 left-4 right-4">
      <div className="w-8 h-8 rounded-full bg-slate-300/80 mb-2" />
      <div className="h-4 bg-slate-300/80 rounded w-3/4 mb-1" />
      <div className="h-3 bg-slate-300/60 rounded w-1/2" />
    </div>
  </div>
));
CategorySkeleton.displayName = "CategorySkeleton";

const PlaceSkeleton = memo(() => (
  <div
    className="w-full rounded-[24px] p-3 border backdrop-blur-xl animate-pulse"
    style={{ backgroundColor: TOKENS.cardBg, borderColor: TOKENS.border }}
  >
    <div className="w-full aspect-[4/5] md:aspect-[4/3] bg-slate-200/80 rounded-[18px] mb-3" />
    <div className="px-1 pb-1">
      <div className="h-5 bg-slate-200/80 rounded-md w-3/4 mb-2" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 bg-slate-200/60 rounded w-1/3" />
        <div className="w-7 h-7 rounded-full bg-slate-200/80" />
      </div>
    </div>
  </div>
));
PlaceSkeleton.displayName = "PlaceSkeleton";

const EmptyCategoryState = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-md mx-auto text-center py-16 px-6 rounded-[28px] border backdrop-blur-xl my-6"
    style={{ backgroundColor: TOKENS.cardBg, borderColor: TOKENS.border }}
  >
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7]">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <h4 className="text-lg font-bold text-[#0F172A] mb-1.5">
      No destinations added yet
    </h4>
    <p className="text-sm text-[#64748B] font-normal leading-relaxed">
      We’re discovering beautiful places for this category. Check back soon.
    </p>
  </motion.div>
));
EmptyCategoryState.displayName = "EmptyCategoryState";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  placeCount: number;
  onClick: () => void;
  reducedMotion: boolean | null;
}

const CategoryCard = memo(({
  category,
  isSelected,
  placeCount,
  onClick,
  reducedMotion,
}: CategoryCardProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`group relative shrink-0 w-[145px] h-[175px] md:w-[190px] md:h-[220px] rounded-[24px] overflow-hidden text-left cursor-pointer transition-all duration-300 focus:outline-none snap-start select-none ${
        isSelected
          ? "ring-2 ring-[#0284C7] shadow-[0_12px_30px_rgba(2,132,199,0.25)] -translate-y-1"
          : "shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
      }`}
      style={{
        backgroundColor: TOKENS.cardBg,
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full bg-slate-800">
        <Image
          src={category.coverImage || "/images/placeholder-category.jpg"}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 145px, 190px"
          className={`object-cover transition-transform duration-700 ease-out ${
            isSelected ? "scale-105" : "group-hover:scale-110"
          }`}
        />
      </div>

      {/* Dark Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent pointer-events-none" />

      {/* Selected Blue Glow & Gradient Indicator */}
      {isSelected && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${TOKENS.gradientStart} 0%, ${TOKENS.secondary} 100%)`,
          }}
        />
      )}

      {/* Small "Exploring" Badge for Active Tab */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-3 right-3 z-10"
          >
            <span 
              className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1 border border-white/30"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.gradientStart} 0%, ${TOKENS.primary} 100%)`,
              }}
            >
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Exploring
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4 z-10 flex flex-col justify-end">
        {/* Icon / Emoji */}
        {category.icon && (
          <span className="text-lg md:text-xl mb-1.5 drop-shadow-md block" aria-hidden="true">
            {category.icon}
          </span>
        )}

        {/* Category Name */}
        <h3 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug drop-shadow-md line-clamp-1">
          {category.name}
        </h3>

        {/* Place Count / Short Info */}
        <span className="text-[11px] md:text-xs text-slate-300 font-medium tracking-wide mt-0.5 drop-shadow">
          {placeCount} {placeCount === 1 ? "place" : "places"}
        </span>
      </div>
    </motion.button>
  );
});
CategoryCard.displayName = "CategoryCard";

interface CategorySliderProps {
  categories: Category[];
  selectedId: string | null;
  placeCountMap: Record<string, number>;
  onSelect: (id: string) => void;
  reducedMotion: boolean | null;
}

const CategorySlider = memo(({
  categories,
  selectedId,
  placeCountMap,
  onSelect,
  reducedMotion,
}: CategorySliderProps) => {
  return (
    <div className="relative w-full overflow-hidden my-8 md:my-10">
      {/* Horizontal Scrollable Container with peeking support on mobile */}
      <div 
        className="flex items-center gap-3.5 md:gap-5 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto md:justify-start"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <CategoryCard
            key={cat._id}
            category={cat}
            isSelected={selectedId === cat._id}
            placeCount={placeCountMap[cat._id] || 0}
            onClick={() => onSelect(cat._id)}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
});
CategorySlider.displayName = "CategorySlider";

interface SelectedCategoryHeaderProps {
  category: Category | null;
  count: number;
}

const SelectedCategoryHeader = memo(({ category, count }: SelectedCategoryHeaderProps) => {
  if (!category) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category._id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto mb-6"
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              {category.name}
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/20">
              {count} {count === 1 ? "destination" : "destinations"}
            </span>
          </div>
          {category.description && (
            <p className="text-xs sm:text-sm text-[#64748B] font-normal mt-1 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
SelectedCategoryHeader.displayName = "SelectedCategoryHeader";

interface CompactPlaceCardProps {
  place: Place;
  reducedMotion: boolean | null;
}

const CompactPlaceCard = memo(({ place, reducedMotion }: CompactPlaceCardProps) => {
  return (
    <Link
      href={`/places/${place.slug || place._id}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-[#0284C7] rounded-[24px]"
    >
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-full rounded-[24px] p-2.5 sm:p-3 border backdrop-blur-xl transition-shadow duration-300 flex flex-col justify-between shadow-[0_6px_20px_rgba(15,23,42,0.05)] group-hover:shadow-[0_12px_32px_rgba(2,132,199,0.15)]"
        style={{
          backgroundColor: TOKENS.cardBg,
          borderColor: TOKENS.border,
        }}
      >
        {/* Cover Image (4:5 Mobile, 4:3 Desktop Ratio) */}
        <div className="relative w-full aspect-[4/5] md:aspect-[4/3] rounded-[18px] overflow-hidden mb-3 bg-slate-100 transform-gpu">
          <Image
            src={place.coverImage || "/images/placeholder-place.jpg"}
            alt={place.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Subtle Top Gradient for Badge Visibility */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

          {/* Featured Badge ONLY if featured === true */}
          {place.featured && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span 
                className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm border border-white/20 flex items-center gap-1"
                style={{
                  background: `linear-gradient(135deg, ${TOKENS.primary} 0%, ${TOKENS.secondary} 100%)`,
                }}
              >
                ★ Featured
              </span>
            </div>
          )}
        </div>

        {/* Compact Content Area */}
        <div className="px-1.5 pb-1 flex flex-col justify-between flex-grow">
          <div>
            <h4 className="text-sm md:text-base font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors duration-200 line-clamp-1 tracking-tight">
              {place.title}
            </h4>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
            <div className="flex items-center gap-1 text-[#64748B] truncate pr-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-[#0284C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[11px] font-medium truncate" title={place.bestTime || "Year Round"}>
                {place.bestTime || "Year Round"}
              </span>
            </div>

            {/* Small Arrow Button */}
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.gradientStart} 0%, ${TOKENS.secondary} 100%)`,
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});
CompactPlaceCard.displayName = "CompactPlaceCard";

// ============================================================================
// MAIN SECTION COMPONENT
// ============================================================================

export default function CategoryWisePlaces() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  
  const reducedMotion = useReducedMotion();

  // Fetch Categories and Places Concurrently
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const [catRes, placesRes] = await Promise.all([
          api.get<CategoriesResponse>("/api/categories"),
          api.get<PlacesResponse>("/api/places"),
        ]);

        if (!isMounted) return;

        // Parse Categories: active only, sort priority ascending
        const rawCategories = catRes.data || catRes.categories || (Array.isArray(catRes) ? catRes : []);
        const activeCategories = rawCategories
          .filter((c) => c.status === "active")
          .sort((a, b) => (a.priority || 0) - (b.priority || 0));

        // Parse Places: active only, sort priority ascending
        const rawPlaces = placesRes.data || placesRes.places || (Array.isArray(placesRes) ? placesRes : []);
        const activePlaces = rawPlaces
          .filter((p) => p.status === "active")
          .sort((a, b) => (a.priority || 0) - (b.priority || 0));

        setCategories(activeCategories);
        setAllPlaces(activePlaces);

        // Automatically select the first active category on load
        if (activeCategories.length > 0) {
          setSelectedCategoryId(activeCategories[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch category-wise places data:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Map category IDs to their active place counts
  const placeCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    allPlaces.forEach((place) => {
      const catId = place.category?._id;
      if (catId) {
        map[catId] = (map[catId] || 0) + 1;
      }
    });
    return map;
  }, [allPlaces]);

  // Filter places for the currently selected category
  const filteredPlaces = useMemo(() => {
    if (!selectedCategoryId) return [];
    return allPlaces.filter((place) => place.category?._id === selectedCategoryId);
  }, [allPlaces, selectedCategoryId]);

  // Get currently selected category object
  const selectedCategory = useMemo(() => {
    return categories.find((c) => c._id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  return (
    <section 
      className="relative w-full py-20 md:py-28 overflow-hidden select-none"
      aria-label="Explore Byndoor by Interest"
      style={{
        background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)`,
      }}
    >
      {/* Subtle Ambient Background Glow */}
      <div 
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-40 blur-[130px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(2,132,199,0.05) 50%, transparent 80%)",
        }}
      />

      {/* Section Header */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 text-center md:text-left">
        <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
          EXPLORE BY INTEREST
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15] mb-3">
          Find Places You’ll Love
        </h2>
      </div>

      {/* Dynamic Navigation & Content States */}
      {loading ? (
        /* LOADING STATE */
        <div className="w-full max-w-[1400px] mx-auto">
          {/* Horizontal Skeletons */}
          <div className="flex gap-4 overflow-x-hidden my-8 md:my-10 px-6 md:px-12 xl:px-20">
            {[...Array(6)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>

          {/* 8 Compact Place Skeletons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-6 md:px-12 xl:px-20">
            {[...Array(8)].map((_, i) => (
              <PlaceSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : error || categories.length === 0 ? (
        /* ERROR / EMPTY CATEGORIES STATE */
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20">
          <EmptyCategoryState />
        </div>
      ) : (
        /* SUCCESS STATE */
        <>
          {/* Horizontal Category Slider */}
          <CategorySlider
            categories={categories}
            selectedId={selectedCategoryId}
            placeCountMap={placeCountMap}
            onSelect={(id) => setSelectedCategoryId(id)}
            reducedMotion={reducedMotion}
          />

          {/* Selected Category Header Info */}
          <SelectedCategoryHeader
            category={selectedCategory}
            count={filteredPlaces.length}
          />

          {/* Compact Places Grid */}
          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20">
            <AnimatePresence mode="wait">
              {filteredPlaces.length === 0 ? (
                <EmptyCategoryState key="empty" />
              ) : (
                <motion.div
                  key={selectedCategoryId || "grid"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                >
                  {filteredPlaces.map((place) => (
                    <CompactPlaceCard
                      key={place._id}
                      place={place}
                      reducedMotion={reducedMotion}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </section>
  );
}