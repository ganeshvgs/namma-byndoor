//path web-frontend/app/components/Hero.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { api } from "../lib/api";
import { useLoader } from "../providers/LoaderProvider";

// ==========================================
// TYPES
// ==========================================

interface VideoData {
  _id: string;
  title: string;
  desktopUrl: string;
  mobileUrl: string;
  priority: number;
  status: string;
}

interface HeroResponse {
  success: boolean;
  videos: VideoData[];
}

interface VideoCardProps {
  video: VideoData;
  isMobile: boolean;
  isFirst: boolean;
  markVideoReady: () => void;
}

// ==========================================
// VARIANTS & ANIMATIONS
// ==========================================

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1, ease: "easeOut" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// ==========================================
// HOOKS
// ==========================================

const useResponsiveLayout = () => {
  const [layout, setLayout] = useState({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    mounted: false,
  });

  useEffect(() => {
    // matchMedia is significantly cheaper than window.innerWidth listening
    const mqlMobile = window.matchMedia("(max-width: 767px)");
    const mqlTablet = window.matchMedia("(min-width: 768px) and (max-width: 1279px)");
    const mqlDesktop = window.matchMedia("(min-width: 1280px)");

    const updateLayout = () => {
      setLayout({
        isMobile: mqlMobile.matches,
        isTablet: mqlTablet.matches,
        isDesktop: mqlDesktop.matches,
        mounted: true,
      });
    };

    updateLayout(); // Initial check
    
    mqlMobile.addEventListener("change", updateLayout);
    mqlTablet.addEventListener("change", updateLayout);
    mqlDesktop.addEventListener("change", updateLayout);

    return () => {
      mqlMobile.removeEventListener("change", updateLayout);
      mqlTablet.removeEventListener("change", updateLayout);
      mqlDesktop.removeEventListener("change", updateLayout);
    };
  }, []);

  return layout;
};

// ==========================================
// COMPONENTS
// ==========================================

const ScrollIndicator = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      variants={itemVariants}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
      aria-hidden="true"
    >
      <div className="w-[20px] h-[34px] border border-white/40 rounded-full flex justify-center p-[3px] bg-black/10">
        <div className="w-[3px] h-[5px] bg-white rounded-full mt-1 animate-subtle-bounce" />
      </div>
    </motion.div>
  );
});
ScrollIndicator.displayName = "ScrollIndicator";

const HeroOverlay = memo(() => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
      <motion.div variants={overlayVariants} initial="hidden" animate="visible" className="flex flex-col items-center">
        
        {/* Refined Eyebrow */}
        <motion.div variants={itemVariants} className="mb-6 pointer-events-auto">
          <span className="text-white text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase bg-black/20 px-5 py-2 rounded-full border border-white/20">
            Discover
          </span>
        </motion.div>
        <motion.h1
  variants={itemVariants}
  className="mb-6 max-w-5xl text-center text-white font-extrabold leading-tight drop-shadow-lg
             text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
>
  Explore Byndoor{" "}
  <span className="text-sky-300">(Baindur)</span>, Karnataka
</motion.h1>

      

        {/* Concise Subtitle */}
        <motion.p variants={itemVariants} className="text-white/90 text-sm sm:text-base md:text-lg font-light tracking-wider mb-10 drop-shadow-md pointer-events-auto max-w-md">
          Where the Western Ghats meet the Arabian Sea.
        </motion.p>

        {/* Refined CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pointer-events-auto">
          <Link href="/places" className="w-full sm:w-auto">
            <button type="button" className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-[13px] sm:text-sm tracking-[0.1em] text-white uppercase transition-transform duration-200 hover:-translate-y-[1px] active:scale-95 shadow-lg bg-gradient-to-r from-[#0369A1] to-[#38BDF8]">
              Explore Byndoor &rarr;
            </button>
          </Link>
          <Link href="/places" className="w-full sm:w-auto">
            <button type="button" className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-[13px] sm:text-sm tracking-[0.1em] text-white uppercase transition-transform duration-200 bg-black/20 border border-white/30 hover:bg-black/40 hover:-translate-y-[1px] active:scale-95">
              Plan Your Visit
            </button>
          </Link>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </div>
  );
});
HeroOverlay.displayName = "HeroOverlay";

const VideoCard = memo(({ video, isMobile, isFirst, markVideoReady }: VideoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSignaledReady = useRef(false);

  // Trigger when enough data is available to play the first frame (prevents black flash)
  const handleCanPlay = useCallback(() => {
    setIsLoaded(true);
    if (isFirst && !hasSignaledReady.current) {
      hasSignaledReady.current = true;
      markVideoReady(); // Releases the Loader
    }
  }, [isFirst, markVideoReady]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const playSafe = () => {
      if (vid.paused) {
        vid.play().catch((err) => {
          if (err.name !== "AbortError") console.debug("Autoplay prevented:", err);
        });
      }
    };

    // 1. Off-screen pausing via IntersectionObserver (High Performance Gain)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && document.visibilityState === "visible") {
          playSafe();
        } else {
          vid.pause();
        }
      },
      { threshold: 0 } // Triggers the exact moment it leaves/enters the screen
    );
    observer.observe(vid);

    // 2. Background tab pausing
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        vid.pause();
      } else {
        const rect = vid.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) playSafe();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0F172A]">
      <video
        ref={videoRef}
        src={isMobile ? video.mobileUrl : video.desktopUrl}
        autoPlay
        muted
        loop
        playsInline
        // Critical: Only preload the FIRST video heavily. Others wait in the background.
        preload={isFirst ? "auto" : "metadata"}
        onCanPlay={handleCanPlay}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-out transform-gpu ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
});
VideoCard.displayName = "VideoCard";

// ==========================================
// MAIN EXPORT
// ==========================================

export default function Hero() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const { isMobile, isTablet, isDesktop, mounted } = useResponsiveLayout();
  const { markVideoReady } = useLoader();

  useEffect(() => {
    let isSubscribed = true;

    const fetchVideos = async () => {
      try {
        const data = await api.get<HeroResponse>("/api/hero-videos");
        if (isSubscribed && data.success && data.videos) {
          const activeVideos = data.videos
            .filter((v) => v.status === "active")
            .sort((a, b) => a.priority - b.priority);
            
          if (activeVideos.length === 0) markVideoReady(); // Failsafe
          setVideos(activeVideos);
        } else {
          markVideoReady(); // Failsafe
        }
      } catch (error) {
        console.error("Hero video fetch error:", error);
        markVideoReady(); // Failsafe: Release loader if DB/Network fails
      }
    };

    fetchVideos();
    return () => { isSubscribed = false; };
  }, [markVideoReady]);

  const displayCount = useMemo(() => {
    if (!mounted) return 1;
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  }, [mounted, isDesktop, isTablet]);

  const displayVideos = useMemo(() => videos.slice(0, displayCount), [videos, displayCount]);

  const videoLayouts = useMemo(() => {
    return displayVideos.map((video, index) => {
      const isFirst = index === 0;
      const pct = 100 / displayCount;
      const overlap = 24; 
      
      const layoutStyle = isMobile || displayCount === 1 
        ? { left: 0, width: "100%", zIndex: 1 } 
        : isFirst 
          ? { left: 0, width: `${pct}%`, zIndex: 10 }
          : { 
              left: `calc(${pct * index}% - ${overlap}px)`, 
              width: `calc(${pct}% + ${overlap}px)`, 
              zIndex: 10 + index,
              WebkitMaskImage: `linear-gradient(to right, transparent 0%, black ${overlap}px, black 100%)`,
              maskImage: `linear-gradient(to right, transparent 0%, black ${overlap}px, black 100%)`
            };

      return { video, index, isFirst, style: layoutStyle };
    });
  }, [displayVideos, displayCount, isMobile]);

  return (
    <>
      {/* Offloaded scroll bounce to CSS instead of main-thread JS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.6; }
        }
        .animate-subtle-bounce {
          animation: subtle-bounce 1.5s infinite ease-in-out;
        }
      `}} />

      {/* Changed to 100svh for solid mobile browser height stability */}
      <div className="relative w-full h-[100svh] bg-[#0F172A] overflow-hidden" role="banner">
        
        {/* Simplified Overlay Gradients - Keeps readability, drops GPU cost */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-[#0F172A]/40 to-transparent" />
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content only animates in once Hydrated */}
        {mounted && <HeroOverlay />}

        {/* Videos Container */}
        <div className="absolute inset-0 w-full h-full z-10">
          {videoLayouts.map(({ video, index, isFirst, style }) => (
            <div key={video._id} className="absolute top-0 bottom-0 h-full overflow-hidden" style={style}>
              <VideoCard 
                 video={video} 
                 isMobile={isMobile} 
                 isFirst={isFirst} 
                 markVideoReady={markVideoReady}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}