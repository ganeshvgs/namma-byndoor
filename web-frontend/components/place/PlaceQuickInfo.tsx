"use client";

import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { PlaceDetails } from "../../types/place";
import { CalendarIcon, ClockIcon, TicketIcon, CompassIcon } from "../../utils/sectionIcons";

interface PlaceQuickInfoProps {
  place: PlaceDetails;
  reducedMotion: boolean | null;
}

const infoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const infoCardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export const PlaceQuickInfo = memo(({ place, reducedMotion }: PlaceQuickInfoProps) => {
  const categoryName = typeof place.category === "object" ? place.category?.name : place.category;

  const items = useMemo(() => {
    const list = [];
    if (place.bestTime && place.bestTime.trim() !== "") {
      list.push({ label: "Best Time", value: place.bestTime, icon: <CalendarIcon /> });
    }
    if (place.openingHours && place.openingHours.trim() !== "") {
      list.push({ label: "Opening Hours", value: place.openingHours, icon: <ClockIcon /> });
    }
    if (place.entryFee && place.entryFee.trim() !== "") {
      list.push({ label: "Entry Fee", value: place.entryFee, icon: <TicketIcon /> });
    }
    if (categoryName && categoryName.trim() !== "") {
      list.push({ label: "Category", value: categoryName, icon: <CompassIcon /> });
    }
    return list;
  }, [place, categoryName]);

  if (items.length === 0) return null;

  return (
    <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 -mt-14 md:-mt-16 mb-16">
      <motion.div
        variants={reducedMotion ? undefined : infoContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full rounded-[28px] md:rounded-[32px] p-6 sm:p-8 border backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_4px_12px_rgba(2,132,199,0.04)] bg-white/80 border-white/50"
      >
        <div className={`grid grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6 sm:gap-8`}>
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={reducedMotion ? undefined : infoCardVariants}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3.5 ${
                idx !== 0 && idx % 2 === 1 ? "border-l border-slate-200/60 pl-4 sm:pl-6" : ""
              } ${idx >= 2 ? "lg:border-l lg:border-slate-200/60 lg:pl-6 pt-4 sm:pt-0 border-t border-slate-100 sm:border-t-0" : ""}`}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#0284C7]/10 flex items-center justify-center shrink-0 border border-[#0284C7]/20">
                {item.icon}
              </div>
              <div className="overflow-hidden w-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-0.5">
                  {item.label}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#0F172A] truncate block" title={item.value}>
                  {item.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});
PlaceQuickInfo.displayName = "PlaceQuickInfo";