"use client";

import React, { memo } from "react";
import { PlaceDetails } from "../../types/place";
import { getMapUrl } from "../../utils/map";
import { MapPinIcon, PhotoIcon } from "../../utils/sectionIcons";
import { ShareButtons } from "./ShareButtons";

interface StickyActionBarProps {
  place: PlaceDetails;
  hasGallery: boolean;
  onOpenGallery: () => void;
}

export const StickyActionBar = memo(({ place, hasGallery, onOpenGallery }: StickyActionBarProps) => {
  const mapUrl = getMapUrl(place);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-around gap-2 shadow-2xl">
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#0369A1] to-[#38BDF8]"
        >
          <MapPinIcon />
          <span>Map</span>
        </a>
      )}

      {hasGallery && (
        <button
          type="button"
          onClick={onOpenGallery}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-white/15 border border-white/20"
        >
          <PhotoIcon />
          <span>Photos</span>
        </button>
      )}

      <ShareButtons
        title={place.title}
        className="!px-4 !py-3 !text-xs !bg-white/15 !border-white/20"
      />
    </div>
  );
});
StickyActionBar.displayName = "StickyActionBar";