"use client";

import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GalleryImage } from "../../types/place";
import { ExpandArrowsIcon } from "../../utils/sectionIcons";

const SHIMMER_BLUR_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDcwIiBmaWxsPSJ1cmwoI2cpIiAvPjwvc3ZnPg==";

interface PlaceGalleryProps {
  images: GalleryImage[];
  onOpenLightbox: (index: number) => void;
  reducedMotion: boolean | null;
}

const galleryContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const galleryCardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const GalleryCard = memo(
  ({
    image,
    index,
    className = "",
    overlayText,
    onOpenLightbox,
  }: {
    image: GalleryImage;
    index: number;
    className?: string;
    overlayText?: string;
    onOpenLightbox: (idx: number) => void;
  }) => (
    <motion.button
      variants={galleryCardVariants}
      type="button"
      onClick={() => onOpenLightbox(index)}
      aria-label={
        overlayText
          ? `View photo ${index + 1} and ${overlayText.toLowerCase()}`
          : `View photo ${index + 1}`
      }
      className={`relative rounded-[24px] overflow-hidden group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] bg-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 block w-full h-full ${className}`}
    >
      <Image
        src={image.image}
        alt={`Gallery photo ${index + 1}`}
        fill
        placeholder="blur"
        blurDataURL={SHIMMER_BLUR_URL}
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        sizes="(max-width: 768px) 85vw, (max-width: 1440px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/30 opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 shadow-md">
        <ExpandArrowsIcon />
      </div>

      {overlayText && (
        <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl md:text-2xl tracking-wider">
          {overlayText}
        </div>
      )}
    </motion.button>
  )
);
GalleryCard.displayName = "GalleryCard";

export const PlaceGallery = memo(({ images, onOpenLightbox, reducedMotion }: PlaceGalleryProps) => {
  if (!images || images.length === 0) return null;
  const imageCount = images.length;

  return (
    <section className="py-12 md:py-16 px-0 md:px-12 xl:px-20 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-6 md:px-0">
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-[0.25em] uppercase mb-3 border bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/20">
            PHOTO GALLERY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Visual Exploration
          </h2>
        </div>
      </div>

      {/* MOBILE SWIPE CAROUSEL (< 768px) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3 px-6">
          <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
            Swipe to explore photos
          </span>
        </div>
        <div
          className="flex gap-4 overflow-x-auto pb-6 px-6 snap-x snap-mandatory scrollbar-none w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenLightbox(idx)}
              aria-label={`View photo ${idx + 1} of ${imageCount}`}
              className="relative w-[85vw] max-w-[400px] aspect-[4/3] rounded-[24px] shrink-0 snap-center overflow-hidden shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8] group bg-slate-100"
            >
              <Image
                src={img.image}
                alt={`Gallery mobile ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 85vw, 400px"
                placeholder="blur"
                blurDataURL={SHIMMER_BLUR_URL}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-md">
                <ExpandArrowsIcon />
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full tracking-widest shadow-sm">
                {idx + 1} / {imageCount}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* TABLET ADAPTIVE 2-COLUMN GRID (768px - 1023px) */}
      <motion.div
        variants={reducedMotion ? undefined : galleryContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="hidden md:grid lg:hidden grid-cols-2 gap-5"
      >
        <div className="col-span-2 aspect-[16/9] w-full">
          <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i + 1} className="aspect-[4/3] w-full">
            <GalleryCard
              image={img}
              index={i + 1}
              onOpenLightbox={onOpenLightbox}
              overlayText={i === 3 && imageCount > 5 ? `+${imageCount - 5} More` : undefined}
            />
          </div>
        ))}
      </motion.div>

      {/* DESKTOP PINTEREST / MASONRY GRID (>= 1024px) */}
      <motion.div
        variants={reducedMotion ? undefined : galleryContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="hidden lg:grid grid-cols-12 gap-6 h-[500px] xl:h-[600px]"
      >
        {imageCount === 1 && (
          <div className="col-span-12 w-full h-full">
            <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
          </div>
        )}

        {imageCount === 2 && (
          <>
            <div className="col-span-6 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-6 w-full h-full">
              <GalleryCard image={images[1]} index={1} onOpenLightbox={onOpenLightbox} />
            </div>
          </>
        )}

        {imageCount === 3 && (
          <>
            <div className="col-span-8 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-4 flex flex-col gap-6 w-full h-full">
              <div className="flex-1">
                <GalleryCard image={images[1]} index={1} onOpenLightbox={onOpenLightbox} />
              </div>
              <div className="flex-1">
                <GalleryCard image={images[2]} index={2} onOpenLightbox={onOpenLightbox} />
              </div>
            </div>
          </>
        )}

        {imageCount === 4 && (
          <>
            <div className="col-span-8 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-4 grid grid-cols-2 grid-rows-2 gap-6 w-full h-full">
              <div className="col-span-2 row-span-1">
                <GalleryCard image={images[1]} index={1} onOpenLightbox={onOpenLightbox} />
              </div>
              <div className="col-span-1 row-span-1">
                <GalleryCard image={images[2]} index={2} onOpenLightbox={onOpenLightbox} />
              </div>
              <div className="col-span-1 row-span-1">
                <GalleryCard image={images[3]} index={3} onOpenLightbox={onOpenLightbox} />
              </div>
            </div>
          </>
        )}

        {imageCount >= 5 && (
          <>
            <div className="col-span-7 xl:col-span-8 w-full h-full">
              <GalleryCard image={images[0]} index={0} onOpenLightbox={onOpenLightbox} />
            </div>
            <div className="col-span-5 xl:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 xl:gap-6 w-full h-full">
              {images.slice(1, 5).map((img, i) => (
                <div key={i + 1} className="col-span-1 row-span-1 w-full h-full">
                  <GalleryCard
                    image={img}
                    index={i + 1}
                    onOpenLightbox={onOpenLightbox}
                    overlayText={i === 3 && imageCount > 5 ? `+${imageCount - 5} More` : undefined}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
});
PlaceGallery.displayName = "PlaceGallery";