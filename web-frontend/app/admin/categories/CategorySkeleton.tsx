// path: web-frontend/components/admin/categories/CategorySkeleton.tsx
"use client";

export default function CategorySkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse flex flex-col"
      style={{
        background: "rgba(30, 41, 59, 0.6)",
        border: "1px solid rgba(99, 102, 241, 0.12)",
      }}
    >
      {/* Cover Image Skeleton */}
      <div className="w-full h-44 bg-slate-700/60 relative">
        <div className="absolute top-3 left-3 w-12 h-6 bg-slate-800/80 rounded-full" />
        <div className="absolute top-3 right-3 w-20 h-6 bg-slate-800/80 rounded-full" />
      </div>

      {/* Body Skeleton */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-700/80 flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-700/80 rounded-md w-3/4" />
            <div className="h-3 bg-slate-700/50 rounded-md w-1/2" />
          </div>
        </div>

        <div className="space-y-2 mt-2">
          <div className="h-3 bg-slate-700/40 rounded w-full" />
          <div className="h-3 bg-slate-700/40 rounded w-5/6" />
        </div>

        <div className="flex gap-2 mt-4 pt-2 border-t border-white/5">
          <div className="h-9 flex-1 bg-slate-700/50 rounded-xl" />
          <div className="h-9 flex-1 bg-slate-700/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}