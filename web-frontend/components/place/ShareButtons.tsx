"use client";

import React, { useState, useCallback, memo } from "react";
import { ShareIcon } from "../../utils/sectionIcons";

interface ShareButtonsProps {
  title: string;
  className?: string;
}

export const ShareButtons = memo(({ title, className = "" }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Explore ${title}`,
          text: `Check out ${title} on our Tourism Guide!`,
          url,
        });
        return;
      } catch {
        // Fall back to clipboard if native share is dismissed/fails
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore copy errors
    }
  }, [title]);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share destination"
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase transition-all duration-300 bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/50 transform hover:-translate-y-0.5 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] ${className}`}
      >
        <ShareIcon />
        <span>{copied ? "Link Copied" : "Share"}</span>
      </button>
    </div>
  );
});
ShareButtons.displayName = "ShareButtons";