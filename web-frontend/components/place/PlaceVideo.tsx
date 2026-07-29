"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface PlaceVideoProps {
  videoUrl?: string;
  reducedMotion: boolean | null;
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const PlaceVideo = memo(({ videoUrl, reducedMotion }: PlaceVideoProps) => {
  if (!videoUrl || videoUrl.trim() === "") return null;

  const getEmbedUrl = (url: string) => {
    let finalUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      finalUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      if (id) finalUrl = `https://www.youtube.com/embed/${id}`;
    }
    return finalUrl;
  };

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 xl:px-20 max-w-[1400px] mx-auto">
      <motion.div
        variants={reducedMotion ? undefined : fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto"
      >
        <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
          CINEMATIC EXPERIENCE
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-8">
          Watch Video Tour
        </h2>
        <div className="relative w-full aspect-video rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_15px_35px_rgba(15,23,42,0.12)] border border-white/40 bg-slate-900">
          <iframe
            src={getEmbedUrl(videoUrl)}
            title="Place Video Tour"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </motion.div>
    </section>
  );
});
PlaceVideo.displayName = "PlaceVideo";