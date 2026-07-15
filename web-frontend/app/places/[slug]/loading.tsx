// path: app/places/[slug]/loading.tsx
import React from "react";
import Navbar from "../../components/Navbar";

const TOKENS = {
  bgMain: "#F8FCFF",
  bgSecondary: "#EEF8FF",
  cardBg: "rgba(255, 255, 255, 0.78)",
  border: "rgba(255, 255, 255, 0.45)",
} as const;

export default function PlaceDetailsLoading() {
  return (
    <main
      className="min-h-screen flex flex-col pb-24 select-none overflow-x-hidden animate-pulse"
      style={{ background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)` }}
    >
      {/* 1. INSTANT NAVBAR */}
      <Navbar />

      {/* 2. HERO SKELETON (Exact 65vh / 80vh Match) */}
      <section className="relative w-full h-[65vh] lg:h-[80vh] min-h-[480px] max-h-[900px] bg-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-90" />
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
          <div className="max-w-3xl space-y-4">
            <div className="flex gap-2.5">
              <div className="w-24 h-6 rounded-full bg-white/10 backdrop-blur-md" />
              <div className="w-20 h-6 rounded-full bg-white/10 backdrop-blur-md" />
            </div>
            <div className="w-3/4 sm:w-2/3 h-12 sm:h-16 rounded-2xl bg-white/20" />
            <div className="w-full max-w-xl h-6 rounded-xl bg-white/10" />
            <div className="w-4/5 max-w-lg h-6 rounded-xl bg-white/10" />
            <div className="pt-2 flex gap-4">
              <div className="w-36 h-12 rounded-full bg-white/20" />
              <div className="w-36 h-12 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FLOATING INFO CARD SKELETON (Exact Overlap -mt-14 Match) */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 -mt-14 md:-mt-16 mb-16">
        <div
          className="w-full rounded-[28px] md:rounded-[32px] p-6 sm:p-8 border shadow-xl"
          style={{ backgroundColor: TOKENS.cardBg, borderColor: TOKENS.border }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${
                  idx !== 0 && idx % 2 === 1 ? "border-l border-slate-200/60 pl-4 sm:pl-6" : ""
                } ${idx >= 2 ? "lg:border-l lg:border-slate-200/60 lg:pl-6 pt-4 sm:pt-0 border-t border-slate-100 sm:border-t-0" : ""}`}
              >
                <div className="w-11 h-11 rounded-2xl bg-slate-200/80 shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="w-16 h-3 rounded bg-slate-200/80" />
                  <div className="w-24 h-4 rounded bg-slate-300/80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. STORY SKELETON */}
      <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="w-24 h-6 rounded-full bg-slate-200" />
          <div className="w-64 h-10 rounded-xl bg-slate-300" />
          <div className="space-y-3 pt-4">
            <div className="w-full h-4 rounded bg-slate-200/80" />
            <div className="w-full h-4 rounded bg-slate-200/80" />
            <div className="w-5/6 h-4 rounded bg-slate-200/80" />
          </div>
        </div>
      </section>

      {/* 5. GALLERY SKELETON */}
      <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
        <div className="space-y-3 mb-8">
          <div className="w-28 h-6 rounded-full bg-slate-200" />
          <div className="w-56 h-10 rounded-xl bg-slate-300" />
        </div>
        {/* Desktop 12-col Grid Skeleton */}
        <div className="hidden lg:grid grid-cols-12 gap-6 h-[500px] xl:h-[600px]">
          <div className="col-span-8 w-full h-full rounded-[24px] bg-slate-200/80" />
          <div className="col-span-4 grid grid-cols-2 grid-rows-2 gap-6 w-full h-full">
            <div className="col-span-2 row-span-1 rounded-[24px] bg-slate-200/80" />
            <div className="col-span-1 row-span-1 rounded-[24px] bg-slate-200/80" />
            <div className="col-span-1 row-span-1 rounded-[24px] bg-slate-200/80" />
          </div>
        </div>
        {/* Mobile Snap Scroll Skeleton */}
        <div className="lg:hidden flex gap-4 overflow-hidden">
          <div className="w-[85vw] max-w-[400px] aspect-[4/3] rounded-[24px] bg-slate-200/80 shrink-0" />
          <div className="w-[85vw] max-w-[400px] aspect-[4/3] rounded-[24px] bg-slate-200/80 shrink-0" />
        </div>
      </section>

      {/* 6. VIDEO & MAP SKELETONS */}
      <section className="py-12 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full space-y-16">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="w-36 h-6 rounded-full bg-slate-200" />
          <div className="w-52 h-10 rounded-xl bg-slate-300" />
          <div className="w-full aspect-video rounded-[32px] bg-slate-200/80" />
        </div>
        <div className="space-y-4">
          <div className="w-24 h-6 rounded-full bg-slate-200" />
          <div className="w-48 h-10 rounded-xl bg-slate-300" />
          <div className="w-full h-[400px] md:h-[480px] rounded-[32px] bg-slate-200/80" />
        </div>
      </section>
    </main>
  );
}