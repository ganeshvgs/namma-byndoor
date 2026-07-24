// path: app/places/loading.tsx
import React from "react";
import Navbar from "../components/Navbar";

const TOKENS = {
  bgMain: "#F8FCFF",
  bgSecondary: "#EEF8FF",
  cardBg: "rgba(255, 255, 255, 0.78)",
} as const;

export default function PlacesLoading() {
  return (
    <main
      className="min-h-screen flex flex-col pb-24 select-none overflow-x-hidden animate-pulse"
      style={{ background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)` }}
    >
      <Navbar />

      {/* Hero Skeleton */}
      <section className="relative w-full h-[40vh] min-h-[320px] bg-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-6 text-center">
          <div className="w-48 h-8 rounded-full bg-white/10 backdrop-blur-md mb-4" />
          <div className="w-3/4 max-w-xl h-16 rounded-2xl bg-white/20" />
        </div>
      </section>

      {/* Search & Sort Skeleton */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 -mt-8 relative z-20 mb-10">
        <div className="w-full h-20 rounded-2xl bg-white/80 border border-slate-200 shadow-lg" />
      </div>

      {/* Category Slider Skeleton */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 mb-8">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[145px] h-[175px] md:w-[190px] md:h-[220px] shrink-0 rounded-[24px] bg-slate-200/70 border border-white/40" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full rounded-[24px] p-3 border backdrop-blur-xl bg-white/70">
            <div className="w-full aspect-[4/5] md:aspect-[4/3] bg-slate-200/80 rounded-[18px] mb-3" />
            <div className="h-5 bg-slate-200/80 rounded-md w-3/4 mb-2" />
            <div className="h-3 bg-slate-200/60 rounded w-1/3" />
          </div>
        ))}
      </div>
    </main>
  );
}