"use client";

import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { ContentSection as ContentSectionType } from "../../types/place";
import { ContentSection } from "./ContentSection";
import { parseParagraphs } from "../../utils/formatText";

interface PlaceContentSectionsProps {
  contentSections?: ContentSectionType[];
  story?: string;
  title: string;
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

export const PlaceContentSections = memo(
  ({ contentSections = [], story = "", title, reducedMotion }: PlaceContentSectionsProps) => {
    // 1. Sort sections by displayOrder and filter out visible: false
    const activeSections = useMemo(() => {
      if (!Array.isArray(contentSections)) return [];
      return contentSections
        .filter((sec) => sec.visible !== false)
        .sort((a, b) => a.displayOrder - b.displayOrder);
    }, [contentSections]);

    // 2. Fallback to story if no active content sections exist
    if (activeSections.length === 0) {
      if (!story || story.trim() === "") return null;
      const paragraphs = parseParagraphs(story);

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
              DISCOVER
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-8">
              The Story of {title}
            </h2>
            <div className="space-y-6 text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="leading-8">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        </section>
      );
    }

    // 3. Render dynamic contentSections engine
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
            EXPERIENCE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-6">
            Explore {title}
          </h2>
          <div className="divide-y divide-slate-200/60">
            {activeSections.map((section) => (
              <ContentSection key={section.id} section={section} />
            ))}
          </div>
        </motion.div>
      </section>
    );
  }
);
PlaceContentSections.displayName = "PlaceContentSections";