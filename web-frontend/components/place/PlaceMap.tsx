"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { PlaceDetails } from "../../types/place";
import { getMapUrl } from "../../utils/map";
import { MapPinIcon } from "../../utils/sectionIcons";

interface PlaceMapProps {
  place: PlaceDetails;
  reducedMotion: boolean | null;
}

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export const PlaceMap = memo(({ place, reducedMotion }: PlaceMapProps) => {
  const mapUrl = getMapUrl(place);
  const hasCoords =
    place.latitude !== undefined &&
    place.longitude !== undefined &&
    !isNaN(Number(place.latitude)) &&
    !isNaN(Number(place.longitude));

  if (!hasCoords && !mapUrl) return null;

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <motion.div
        variants={reducedMotion ? undefined : fadeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
              LOCATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Find Your Way
            </h2>
          </div>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs tracking-[0.1em] text-white uppercase shadow-md hover:shadow-lg transition-all duration-300 self-start sm:self-auto bg-gradient-to-r from-[#0369A1] to-[#38BDF8]"
            >
              <MapPinIcon />
              <span>Open in Google Maps</span>
            </a>
          )}
        </div>
        {hasCoords && (
          <div className="relative w-full h-[400px] md:h-[480px] rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_12px_30px_rgba(15,23,42,0.08)] border border-white/60 bg-slate-200">
            <iframe
              src={`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`}
              title={`Map showing location of ${place.title}`}
              loading="lazy"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        )}
      </motion.div>
    </section>
  );
});
PlaceMap.displayName = "PlaceMap";