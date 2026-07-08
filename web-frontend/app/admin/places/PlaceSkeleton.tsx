// path: web-frontend/components/admin/places/PlaceSkeleton.tsx
"use client";

import { ViewMode } from "./types";

interface SkeletonProps {
  viewMode?: ViewMode;
  count?: number;
}

export default function PlaceSkeleton({ viewMode = "grid", count = 6 }: SkeletonProps) {
  if (viewMode === "table") {
    return (
      <div className="rounded-2xl border border-indigo-500/15 overflow-hidden bg-slate-900/40 backdrop-blur-md animate-pulse">
        <div className="h-12 bg-slate-800/80 border-b border-white/5" />
        <div className="divide-y divide-white/5">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex-shrink-0" />
                <div className="space-y-2 flex-1 max-w-sm">
                  <div className="h-4 bg-slate-700/80 rounded w-3/4" />
                  <div className="h-3 bg-slate-700/50 rounded w-1/2" />
                </div>
              </div>
              <div className="hidden md:block h-6 bg-slate-700/60 rounded-full w-24" />
              <div className="h-6 bg-slate-700/60 rounded-full w-16" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-700/60" />
                <div className="w-8 h-8 rounded-lg bg-slate-700/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl overflow-hidden animate-pulse flex flex-col"
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(99, 102, 241, 0.12)",
          }}
        >
          <div className="w-full h-48 bg-slate-700/60 relative">
            <div className="absolute top-3 left-3 w-16 h-6 bg-slate-800/80 rounded-full" />
            <div className="absolute top-3 right-3 w-20 h-6 bg-slate-800/80 rounded-full" />
          </div>
          <div className="p-5 flex flex-col gap-3 flex-1">
            <div className="h-5 bg-slate-700/80 rounded w-3/4" />
            <div className="h-3 bg-slate-700/50 rounded w-full" />
            <div className="h-3 bg-slate-700/50 rounded w-5/6" />
            <div className="flex gap-1.5 mt-2">
              <div className="h-5 w-14 bg-slate-700/40 rounded-md" />
              <div className="h-5 w-14 bg-slate-700/40 rounded-md" />
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
              <div className="h-9 flex-1 bg-slate-700/50 rounded-xl" />
              <div className="h-9 flex-1 bg-slate-700/50 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}