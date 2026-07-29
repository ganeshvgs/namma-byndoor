"use client";

import React, { useState, memo } from "react";
import { ContentSection as ContentSectionType } from "../../types/place";
import { getSectionIcon } from "../../utils/sectionIcons";
import { parseBulletPoints, parseFaqItems, parseParagraphs } from "../../utils/formatText";

interface ContentSectionProps {
  section: ContentSectionType;
}

export const ContentSection = memo(({ section }: ContentSectionProps) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const renderContentBody = () => {
    switch (section.sectionType) {
      // 1. FAQ Accordions
      case "faq": {
        const faqs = parseFaqItems(section.content);
        if (faqs.length === 0) {
          return <p className="text-slate-700 leading-relaxed">{section.content}</p>;
        }
        return (
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-2xl bg-white/70 backdrop-blur-md overflow-hidden transition-colors hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-slate-900 text-base sm:text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8]"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 text-[#0284C7] font-black text-xl">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      // 2. Highlights & Photography Cards
      case "highlights":
      case "photography":
      case "interestingFacts":
      case "nearbyPlaces": {
        const items = parseBulletPoints(section.content);
        if (items.length === 0) {
          return <p className="text-slate-700 leading-relaxed">{section.content}</p>;
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-start gap-3.5"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                <span className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        );
      }

      // 3. Travel Tips & Things To Do Checklists
      case "travelTips":
      case "thingsToDo": {
        const items = parseBulletPoints(section.content);
        if (items.length === 0) {
          return <p className="text-slate-700 leading-relaxed">{section.content}</p>;
        }
        return (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        );
      }

      // 4. How To Reach / History Timelines
      case "howToReach":
      case "history": {
        const paragraphs = parseParagraphs(section.content);
        return (
          <div className="relative border-l-2 border-[#0284C7]/30 pl-6 ml-3 space-y-8">
            {paragraphs.map((para, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0284C7] border-4 border-[#F8FCFF]" />
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed">{para}</p>
              </div>
            ))}
          </div>
        );
      }

      // 5. Default Overview & Custom Section Renderers
      case "overview":
      case "nature":
      case "culture":
      case "food":
      case "festivals":
      case "wildlife":
      case "custom":
      default: {
        const paragraphs = parseParagraphs(section.content);
        return (
          <div className="space-y-6 text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-8">
                {para}
              </p>
            ))}
          </div>
        );
      }
    }
  };

  return (
    <div className="py-8 border-b border-slate-200/60 last:border-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 flex items-center justify-center border border-[#0284C7]/20">
          {getSectionIcon(section.sectionType)}
        </div>
        <h3 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          {section.title || section.sectionType.toUpperCase()}
        </h3>
      </div>
      {renderContentBody()}
    </div>
  );
});
ContentSection.displayName = "ContentSection";