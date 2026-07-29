"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";

export const EmptyState = memo(() => {
  const router = useRouter();
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-6 text-center select-none">
      <div className="w-20 h-20 rounded-full bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] mb-6 shadow-inner border border-[#0284C7]/20">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-3">
        Destination Not Found
      </h1>
      <p className="text-base sm:text-lg text-[#64748B] max-w-md mx-auto leading-relaxed mb-8">
        The place you’re looking for may have been moved or is currently unavailable in our active curation.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.12em] text-white uppercase shadow-[0_6px_20px_rgba(2,132,199,0.35)] hover:shadow-[0_10px_30px_rgba(2,132,199,0.5)] transition-all transform hover:-translate-y-0.5 bg-gradient-to-r from-[#0369A1] to-[#38BDF8]"
      >
        Return to Home
      </button>
    </div>
  );
});
EmptyState.displayName = "EmptyState";