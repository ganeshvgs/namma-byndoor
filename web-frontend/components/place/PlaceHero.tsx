"use client";

import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlaceDetails } from "../../types/place";
import { getMapUrl } from "../../utils/map";
import { MapPinIcon, PhotoIcon } from "../../utils/sectionIcons";
import { ShareButtons } from "./ShareButtons";

const SHIMMER_BLUR_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDcwIiBmaWxsPSJ1cmwoI2cpIiAvPjwvc3ZnPg==";

interface PlaceHeroProps {
  place: PlaceDetails;
  hasGallery: boolean;
  onOpenGallery?: () => void;
  reducedMotion: boolean | null;
}

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const PlaceHero = memo(({ place, hasGallery, onOpenGallery, reducedMotion }: PlaceHeroProps) => {
  const mapUrl = getMapUrl(place);
  const categoryName = typeof place.category === "object" ? place.category?.name : place.category;

  return (
    <section className="relative w-full h-[65vh] lg:h-[80vh] min-h-[480px] max-h-[900px] overflow-hidden select-none bg-slate-900">
      <Image
        src={place.coverImage || "/images/placeholder-place.jpg"}
        alt={place.title}
        fill
        priority
        loading="eager"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={SHIMMER_BLUR_URL}
        className="object-cover transition-transform duration-1000 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-90 pointer-events-none" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
        <motion.div
          variants={reducedMotion ? undefined : heroVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {categoryName && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
                {categoryName}
              </span>
            )}
            {place.featured === true && (
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-md border border-white/30 flex items-center gap-1.5 bg-gradient-to-r from-[#0284C7] to-[#38BDF8]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg mb-4">
            {place.title}
          </h1>

          {place.shortDescription && (
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow mb-8 line-clamp-3">
              {place.shortDescription}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase shadow-[0_4px_20px_rgba(2,132,199,0.4)] hover:shadow-[0_8px_28px_rgba(2,132,199,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-[#0369A1] to-[#38BDF8]"
              >
                <MapPinIcon />
                <span>Open in Maps</span>
              </a>
            )}

            {hasGallery && (
              <button
                type="button"
                onClick={onOpenGallery}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase transition-all duration-300 bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/50 transform hover:-translate-y-0.5 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8]"
              >
                <PhotoIcon />
                <span>View Photos</span>
              </button>
            )}

            <ShareButtons title={place.title} />
          </div>
        </motion.div>
      </div>
    </section>
  );
});
PlaceHero.displayName = "PlaceHero";