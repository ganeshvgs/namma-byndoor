"use client";

import React, { memo } from "react";

export const PlaceTags = memo(({ tags }: { tags?: string[] }) => {
  const validTags = tags?.filter((t) => t && t.trim() !== "");
  if (!validTags || validTags.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-2">
          Discover More:
        </span>
        {validTags.map((tag, idx) => (
          <span
            key={idx}
            className="px-4 py-2 rounded-full text-xs font-bold text-[#0284C7] bg-[#0284C7]/10 border border-[#0284C7]/20 shadow-xs uppercase tracking-wide backdrop-blur-md"
          >
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
});
PlaceTags.displayName = "PlaceTags";