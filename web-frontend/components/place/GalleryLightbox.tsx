"use client";

import React, { memo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryImage } from "../../types/place";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

const SHIMMER_BLUR_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDcwIiBmaWxsPSJ1cmwoI2cpIiAvPjwvc3ZnPg==";

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export const GalleryLightbox = memo(
  ({
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
    onSelect,
  }: GalleryLightboxProps) => {
    useKeyboardNavigation({
      onEscape: onClose,
      onArrowLeft: onPrev,
      onArrowRight: onNext,
    });

    /*
     * Prevent the page behind the lightbox from scrolling.
     *
     * This also prevents situations where the lightbox appears to move
     * because the underlying document is still scrollable.
     */
    useEffect(() => {
      const previousOverflow = document.body.style.overflow;
      const previousOverscrollBehavior =
        document.body.style.overscrollBehavior;

      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";

      return () => {
        document.body.style.overflow = previousOverflow;
        document.body.style.overscrollBehavior =
          previousOverscrollBehavior;
      };
    }, []);

    if (!images || images.length === 0) {
      return null;
    }

    const currentImage = images[currentIndex];

    if (!currentImage) {
      return null;
    }

    return (
      <AnimatePresence>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen photo gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[9999]
            h-[100dvh]
            w-screen
            overflow-hidden
            overscroll-none
            bg-[#0F172A]/95
            backdrop-blur-xl
            select-none
          "
        >
          {/* =========================================================
              CLOSE BUTTON
              Always fixed inside the visible viewport.
              Safe-area support helps on phones with notches.
             ========================================================= */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close photo gallery"
            className="
              fixed
              top-[max(12px,env(safe-area-inset-top))]
              right-[max(12px,env(safe-area-inset-right))]
              sm:top-[max(16px,env(safe-area-inset-top))]
              sm:right-[max(16px,env(safe-area-inset-right))]
              md:top-[max(24px,env(safe-area-inset-top))]
              md:right-[max(24px,env(safe-area-inset-right))]
              z-[10050]

              flex
              h-11
              w-11
              sm:h-12
              sm:w-12
              items-center
              justify-center

              rounded-full
              border
              border-white/20
              bg-white
              text-[#0F172A]

              shadow-[0_4px_24px_rgba(0,0,0,0.35)]

              transition-all
              duration-200

              hover:scale-105
              hover:bg-slate-100

              active:scale-95

              focus:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#38BDF8]
            "
          >
            <svg
              className="h-6 w-6 sm:h-7 sm:w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* =========================================================
              MAIN LAYOUT
              Uses exactly the available viewport height.
              min-h-0 is important so the image doesn't force the
              controls outside the screen.
             ========================================================= */}
          <div
            className="
              flex
              h-full
              min-h-0
              w-full
              flex-col

              pt-[max(12px,env(safe-area-inset-top))]
              pb-[max(8px,env(safe-area-inset-bottom))]

              sm:pt-[max(16px,env(safe-area-inset-top))]
              sm:pb-[max(12px,env(safe-area-inset-bottom))]

              md:pt-[max(24px,env(safe-area-inset-top))]
              md:pb-[max(16px,env(safe-area-inset-bottom))]
            "
          >
            {/* =====================================================
                TOP PHOTO COUNTER
               ===================================================== */}
            <div
              className="
                relative
                z-20
                flex
                shrink-0
                items-center
                justify-center
                px-16
                sm:px-20
                md:px-24
              "
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="
                  rounded-full
                  border
                  border-white/20
                  bg-white/10

                  px-4
                  py-2

                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-white

                  shadow-sm
                  backdrop-blur-md

                  sm:px-5
                  sm:text-xs

                  md:text-sm
                "
              >
                Photo {currentIndex + 1} of {images.length}
              </span>
            </div>

            {/* =====================================================
                IMAGE AREA

                flex-1 + min-h-0 means this section only uses the
                remaining viewport height instead of making the
                whole lightbox taller.
               ===================================================== */}
            <div
              className="
                relative
                flex
                min-h-0
                flex-1
                items-center
                justify-center

                px-2
                py-3

                sm:px-4
                sm:py-4

                md:px-8
                md:py-5
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    relative
                    flex
                    h-full
                    min-h-0
                    w-full
                    max-w-7xl
                    items-center
                    justify-center
                  "
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={currentImage.image}
                    alt={`Gallery photo ${currentIndex + 1}`}
                    fill
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={SHIMMER_BLUR_URL}
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* ===================================================
                  PREVIOUS / NEXT BUTTONS
                 =================================================== */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrev();
                    }}
                    aria-label="Previous photo"
                    className="
                      absolute
                      left-2
                      top-1/2
                      z-[10020]
                      -translate-y-1/2

                      flex
                      h-10
                      w-10
                      items-center
                      justify-center

                      rounded-full
                      border
                      border-white/20
                      bg-black/50
                      text-white
                      backdrop-blur-md

                      shadow-lg

                      transition-all
                      duration-200

                      hover:scale-105
                      hover:bg-black/80

                      active:scale-95

                      focus:outline-none
                      focus-visible:ring-4
                      focus-visible:ring-[#38BDF8]

                      sm:left-4
                      sm:h-12
                      sm:w-12

                      md:left-6
                      md:h-14
                      md:w-14
                    "
                  >
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext();
                    }}
                    aria-label="Next photo"
                    className="
                      absolute
                      right-2
                      top-1/2
                      z-[10020]
                      -translate-y-1/2

                      flex
                      h-10
                      w-10
                      items-center
                      justify-center

                      rounded-full
                      border
                      border-white/20
                      bg-black/50
                      text-white
                      backdrop-blur-md

                      shadow-lg

                      transition-all
                      duration-200

                      hover:scale-105
                      hover:bg-black/80

                      active:scale-95

                      focus:outline-none
                      focus-visible:ring-4
                      focus-visible:ring-[#38BDF8]

                      sm:right-4
                      sm:h-12
                      sm:w-12

                      md:right-6
                      md:h-14
                      md:w-14
                    "
                  >
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* =====================================================
                THUMBNAILS

                Only this area can scroll horizontally.
                It never makes the entire lightbox vertically scroll.
               ===================================================== */}
            {images.length > 1 && (
              <div
                className="
                  relative
                  z-20
                  w-full
                  shrink-0
                  overflow-hidden
                "
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="
                    mx-auto
                    flex
                    w-full
                    max-w-4xl
                    items-center

                    justify-start
                    sm:justify-center

                    gap-2
                    sm:gap-3

                    overflow-x-auto
                    overscroll-x-contain

                    px-3
                    py-2

                    sm:px-4
                    sm:py-3

                    md:py-4

                    scrollbar-none
                  "
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {images.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(idx);
                      }}
                      aria-label={`Go to photo ${idx + 1}`}
                      aria-current={
                        currentIndex === idx ? "true" : undefined
                      }
                      className={`
                        relative
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        border-2

                        h-12
                        w-12

                        sm:h-14
                        sm:w-14

                        md:h-16
                        md:w-16

                        lg:h-20
                        lg:w-20

                        transition-all
                        duration-200

                        focus:outline-none
                        focus-visible:ring-4
                        focus-visible:ring-[#38BDF8]

                        ${
                          currentIndex === idx
                            ? "scale-105 border-[#38BDF8] opacity-100 shadow-lg"
                            : "border-transparent opacity-45 hover:opacity-100"
                        }
                      `}
                    >
                      <Image
                        src={img.image}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        placeholder="blur"
                        blurDataURL={SHIMMER_BLUR_URL}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

GalleryLightbox.displayName = "GalleryLightbox";