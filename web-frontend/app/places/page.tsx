//path : web-frontend/app/places/page.tsx
"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import PlacesLoading from "./loading";
import { useLoader } from "../providers/LoaderProvider";

// ============================================================================
// TYPES
// ============================================================================
interface Category {
  _id: string;
  name: string;
  coverImage?: string;
  icon?: string;
  status: string;
  priority: number;
}

interface Place {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: { _id: string; name?: string };
  bestTime?: string;
  featured?: boolean;
  status: string;
  priority: number;
  tags?: string[];
}

// ============================================================================
// TOKENS & ICONS
// ============================================================================
const TOKENS = {
  primary: "#0284C7",
  gradientStart: "#0369A1",
  secondary: "#38BDF8",
  bgMain: "#F8FCFF",
  bgSecondary: "#EEF8FF",
  cardBg: "rgba(255, 255, 255, 0.78)",
  border: "rgba(255, 255, 255, 0.45)",
} as const;

const SHIMMER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDcwIiBmaWxsPSJ1cmwoI2cpIiAvPjwvc3ZnPg==";

const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// ============================================================================
// UI COMPONENTS
// ============================================================================
const CategoryCard = memo(({ cat, isSelected, onClick, reducedMotion }: any) => (
  <motion.button
    type="button" 
    onClick={onClick}
    variants={reducedMotion ? undefined : {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    }}
    whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}
    whileTap={reducedMotion ? undefined : { scale: 0.98 }}
    className={`group relative shrink-0 w-[145px] h-[175px] md:w-[190px] md:h-[220px] rounded-[24px] overflow-hidden text-left cursor-pointer transition-all duration-300 snap-start select-none ${
      isSelected ? "ring-2 ring-[#0284C7] shadow-[0_12px_30px_rgba(2,132,199,0.25)] -translate-y-1" : "shadow-md hover:shadow-xl"
    }`}
    style={{ backgroundColor: TOKENS.cardBg }}
  >
    <div className="absolute inset-0 w-full h-full bg-slate-800">
      <Image 
        src={cat.coverImage || "/images/placeholder-category.jpg"} 
        alt={cat.name} 
        fill 
        sizes="(max-width: 768px) 145px, 190px" 
        className={`object-cover transition-transform duration-700 ${isSelected ? "scale-105" : "group-hover:scale-110"}`} 
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent pointer-events-none" />
    {isSelected && <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${TOKENS.gradientStart} 0%, ${TOKENS.secondary} 100%)` }} />}
    <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4 z-10 flex flex-col justify-end">
      {cat.icon && <span className="text-lg md:text-xl mb-1.5 drop-shadow-md">{cat.icon}</span>}
      <h3 className="text-sm md:text-base font-bold text-white tracking-tight line-clamp-1">{cat.name}</h3>
    </div>
  </motion.button>
));
CategoryCard.displayName = "CategoryCard";

const CompactPlaceCard = memo(({ place, reducedMotion }: any) => (
  <motion.div
    initial={reducedMotion ? undefined : { opacity: 0, y: 15 }}
    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "50px" }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="group block rounded-[24px]"
  >
    <Link href={`/places/${place.slug || place._id}`} className="block h-full">
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -6 }}
        className="w-full h-full rounded-[24px] p-2.5 sm:p-3 border backdrop-blur-xl flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
        style={{ backgroundColor: TOKENS.cardBg, borderColor: TOKENS.border }}
      >
        <div className="relative w-full aspect-[4/5] md:aspect-[4/3] rounded-[18px] overflow-hidden mb-3 bg-slate-100">
          <Image 
            src={place.coverImage} 
            alt={place.title} 
            fill 
            placeholder="blur" 
            blurDataURL={SHIMMER} 
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw" 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
          {place.featured && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase text-white shadow-sm border border-white/20" style={{ background: `linear-gradient(135deg, ${TOKENS.primary} 0%, ${TOKENS.secondary} 100%)` }}>★ Featured</span>
            </div>
          )}
        </div>
        <div className="px-1.5 pb-1 flex flex-col justify-between flex-grow">
          <h4 className="text-sm md:text-base font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors line-clamp-1">{place.title}</h4>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
            <div className="text-[11px] font-medium text-[#64748B] truncate">{place.bestTime || "Year Round"}</div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5" style={{ background: `linear-gradient(135deg, ${TOKENS.gradientStart} 0%, ${TOKENS.secondary} 100%)` }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  </motion.div>
));
CompactPlaceCard.displayName = "CompactPlaceCard";

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function PlacesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  
  const reducedMotion = useReducedMotion();
  const { markVideoReady } = useLoader();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, placesRes] = await Promise.all([
          api.get<any>("/api/categories?status=active&sort=priority&limit=100"),
          api.get<any>("/api/places?status=active&sort=priority&limit=100"),
        ]);

        const rawCats = catRes.data || catRes.categories || [];
        const rawPlaces = placesRes.data || placesRes.places || [];

        const activeCats = rawCats.filter((c: any) => c.status === "active").sort((a: any, b: any) => a.priority - b.priority);
        const activePlaces = rawPlaces.filter((p: any) => p.status === "active");

        const allCategory: Category = {
          _id: "all",
          name: "All Destinations",
          icon: "🌍",
          status: "active",
          priority: -1,
          coverImage: "https://res.cloudinary.com/dmxsb5kj9/image/upload/v1784878393/IMG_20240922_130617_iuaim9.jpg",
        };

        setCategories([allCategory, ...activeCats]);
        setPlaces(activePlaces);
      } catch (err) {
        console.error("Failed to load places data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPlaces = useMemo(() => {
    let result = [...places];

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category?._id === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(q))) ||
          (p.category?.name?.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => {
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      if (sortBy === "featured") return (b.featured === true ? 0 : 1) - (a.featured === true ? 0 : 1);
      if (sortBy === "newest") return -1;
      return (a.priority || 0) - (b.priority || 0);
    });
  }, [places, activeCategory, searchQuery, sortBy]);

  if (loading) return <PlacesLoading />;

  // Animation variants scoped for cleanliness
  const heroContainerVariants = reducedMotion ? {} : {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };
  
  const heroItemVariants = reducedMotion ? {} : {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen flex flex-col pb-24" style={{ background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)` }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[45vh] min-h-[380px] bg-slate-900 overflow-hidden select-none">
     <Image
  src={categories[0]?.coverImage || "/images/placeholder-place.jpg"}
  alt="Explore Byndoor"
  fill
  sizes="100vw"
  priority
  className="object-cover opacity-50"
  onLoadingComplete={markVideoReady}
/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FCFF] via-transparent to-[#0F172A]/80" />
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={heroContainerVariants}
          className="absolute inset-0 z-10 flex flex-col justify-center items-center px-6 text-center"
        >
          <motion.span variants={heroItemVariants} className="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.25em] text-white bg-white/20 backdrop-blur-md mb-4 border border-white/30">
            Discover
          </motion.span>
          <motion.h1 variants={heroItemVariants} className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl max-w-4xl leading-tight">
            Explore <span className="text-[#38BDF8]">Byndoor</span>
          </motion.h1>
          <motion.p variants={heroItemVariants} className="mt-4 text-slate-200 md:text-lg max-w-2xl font-medium drop-shadow-md">
            Discover beautiful beaches, majestic waterfalls, ancient temples, and hidden gems.
          </motion.p>
        </motion.div>
      </section>

      {/* Interactive Toolbar */}
      <motion.div 
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 -mt-8 relative z-20 mb-8"
      >
        <div className="w-full rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96 flex items-center">
            <div className="absolute left-4 z-10"><SearchIcon /></div>
            <input
              type="text"
              placeholder="Search places, beaches, temples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all text-sm font-medium text-slate-700 placeholder-slate-400 shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-6">
            <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
              <span className="text-[#0284C7]">{filteredPlaces.length}</span> Destinations
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0284C7] shadow-sm cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1rem" }}
            >
              <option value="priority">Priority</option>
              <option value="featured">Featured First</option>
              <option value="newest">Newest</option>
              <option value="a-z">A - Z</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Category Slider */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={reducedMotion ? {} : {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
        }}
        className="w-full overflow-hidden mb-10"
      >
        <div className="flex items-center gap-3.5 md:gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              cat={cat}
              isSelected={activeCategory === cat._id}
              onClick={() => setActiveCategory(cat._id)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </motion.div>

      {/* Places Grid or Empty State */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 min-h-[40vh]">
        <AnimatePresence mode="wait">
          {filteredPlaces.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-lg mx-auto text-center py-20 px-6 rounded-3xl border border-white/50 bg-white/40 backdrop-blur-xl shadow-sm"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] shadow-inner">
                <SearchIcon />
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mb-2">No places found</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                We couldn't find any destinations matching your search or filter criteria.
              </p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="mt-6 px-6 py-2.5 rounded-full text-sm font-bold text-[#0284C7] bg-[#0284C7]/10 hover:bg-[#0284C7]/20 transition-colors">
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              // Using a composite key forces the grid to crossfade gently when filters change 
              key={`${activeCategory}-${sortBy}-${searchQuery}`}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {filteredPlaces.map((place) => (
                <CompactPlaceCard key={place._id} place={place} reducedMotion={reducedMotion} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}