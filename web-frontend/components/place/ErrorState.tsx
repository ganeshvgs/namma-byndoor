"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";

export const ErrorState = memo(({ onRetry }: { onRetry: () => void }) => {
  const router = useRouter();
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-6 text-center select-none">
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
          onClick={onRetry}
          className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-white uppercase shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-[#0369A1] to-[#38BDF8]"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-[#0F172A] uppercase bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );
});
ErrorState.displayName = "ErrorState";