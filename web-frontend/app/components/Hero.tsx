"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  Variants, 
  useTransform, 
  AnimatePresence,
  useReducedMotion
} from "framer-motion";
import { api } from "../lib/api";

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
}

// ==========================================
// ANIMATION VARIANTS
// ==========================================

const heroVariants: Variants = {
  heroHidden: { opacity: 0, y: 12 },
  heroVisible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

const titleContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
};

const titleLetter: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 200,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0 }, // Instant exit to prevent flickering between hovers
  },
};

// ==========================================
// UTILS & HOOKS
// ==========================================

const useResponsiveLayout = () => {
  const [layout, setLayout] = useState({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    mounted: false,
  });

  useEffect(() => {
    const checkLayout = () => {
      const width = window.innerWidth;
      setLayout((prev) => {
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1280;
        const isDesktop = width >= 1280;
        
        // Prevent unnecessary state updates if nothing changed
        if (
          prev.isMobile === isMobile &&
          prev.isTablet === isTablet &&
          prev.isDesktop === isDesktop &&
          prev.mounted
        ) {
          return prev;
        }
        
        return { isMobile, isTablet, isDesktop, mounted: true };
      });
    };
    
    checkLayout();
    window.addEventListener("resize", checkLayout, { passive: true });
    return () => window.removeEventListener("resize", checkLayout);
  }, []);

  return layout;
};

// ==========================================
// COMPONENTS
// ==========================================

const ScrollIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5, duration: 1 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
    aria-hidden="true"
  >
    <div className="w-[22px] h-[36px] border-[1.5px] border-white/30 rounded-full flex justify-center p-1 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
      <motion.div
        className="w-[3px] h-[5px] bg-white rounded-full mt-1"
        animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </motion.div>
));
ScrollIndicator.displayName = "ScrollIndicator";

const AnimatedTitle = memo(({ title }: { title: string }) => {
  return (
    <motion.h2
      variants={titleContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-wide mb-4 leading-tight drop-shadow-2xl capitalize"
    >
      <div className="flex flex-wrap justify-center gap-x-[0.2em]">
        {title.split(" ").map((word, wordIdx) => (
          <div key={wordIdx} className="flex overflow-hidden pb-2">
            {word.split("").map((char, charIdx) => (
              <motion.span key={`${wordIdx}-${charIdx}`} variants={titleLetter} className="inline-block">
                {char}
              </motion.span>
            ))}
          </div>
        ))}
      </div>
    </motion.h2>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";

const HeroOverlay = memo(({ activeVideo }: { activeVideo: VideoData }) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 sm:px-10 text-center pointer-events-none">
      <motion.div variants={overlayVariants} initial="hidden" animate="visible" className="mb-6 pointer-events-auto">
        <span className="text-white text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase bg-white/10 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          Discover
        </span>
      </motion.div>

      

      <motion.p
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        className="text-base sm:text-lg lg:text-xl text-white/90 font-normal tracking-wide mb-10 max-w-md mx-auto drop-shadow-md"
      >
        Discover the beauty of Byndoor 
      </motion.p>

      <motion.div variants={overlayVariants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[280px] sm:max-w-none pointer-events-auto">
        <button className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-[13px] sm:text-sm tracking-[0.1em] text-white uppercase transition-all duration-300 transform hover:-translate-y-[2px] shadow-[0_4px_16px_rgba(2,132,199,0.3)] hover:shadow-[0_8px_24px_rgba(2,132,199,0.4)] active:scale-95 bg-gradient-to-r from-[#0369A1] to-[#38BDF8]">
          Explore Byndoor &rarr;
        </button>
        <button className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-[13px] sm:text-sm tracking-[0.1em] text-white uppercase transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:border-white/50 transform hover:-translate-y-[2px] shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95">
          Plan Your Visit
        </button>
      </motion.div>

      <ScrollIndicator />
    </div>
  );
});
HeroOverlay.displayName = "HeroOverlay";

const VideoCard = memo(({ video, isMobile, isFirst }: VideoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 80, damping: 30, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Reduced intensity parallax for premium feel
  const videoX = useTransform(springX, [-0.5, 0.5], [-1.5, 1.5]);
  const videoY = useTransform(springY, [-0.5, 0.5], [-1.5, 1.5]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || shouldReduceMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [isMobile, shouldReduceMotion, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobile || shouldReduceMotion) return;
    mouseX.set(0);
    mouseY.set(0);
  }, [isMobile, shouldReduceMotion, mouseX, mouseY]);

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full bg-[#0F172A]"
    >
      <motion.div
        className="absolute inset-[-10px] z-0 transform-gpu"
        style={isMobile || shouldReduceMotion ? undefined : { x: videoX, y: videoY }}
      >
        <video
          src={isMobile ? video.mobileUrl : video.desktopUrl}
          autoPlay
          muted
          loop
          playsInline
          preload={isFirst ? "auto" : "metadata"}
          className="w-full h-full object-cover ease-in-out"
          style={{ 
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 750ms ease-in-out"
          }}
          onCanPlay={handleCanPlay}
        />
      </motion.div>
    </div>
  );
});
VideoCard.displayName = "VideoCard";

// ==========================================
// MAIN EXPORT
// ==========================================

export default function Hero() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const { isMobile, isTablet, isDesktop, mounted } = useResponsiveLayout();

  useEffect(() => {
    let isSubscribed = true;

    const fetchVideos = async () => {
      try {
        const data = await api.get<HeroResponse>("/api/hero-videos");
        if (isSubscribed && data.success && data.videos) {
          const activeVideos = data.videos
            .filter((v) => v.status === "active")
            .sort((a, b) => a.priority - b.priority);
          setVideos(activeVideos);
        }
      } catch (error) {
        console.error("Hero video fetch error:", error);
      }
    };

    fetchVideos();
    return () => { isSubscribed = false; };
  }, []);

  const displayCount = useMemo(() => {
    if (!mounted) return 1;
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  }, [mounted, isDesktop, isTablet]);

  const displayVideos = useMemo(() => videos.slice(0, displayCount), [videos, displayCount]);

  const activeVideo = useMemo(() => displayVideos[hoveredIndex] || displayVideos[0], [displayVideos, hoveredIndex]);

  const handleHeroMouseLeave = useCallback(() => setHoveredIndex(0), []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const index = Number(e.currentTarget.dataset.index);
    setHoveredIndex(index);
  }, []);

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
    <motion.div 
      variants={heroVariants}
      initial="heroHidden"
      animate="heroVisible"
      className="relative w-full h-[100vh] bg-[#0F172A] overflow-hidden" 
      role="banner"
      onMouseLeave={handleHeroMouseLeave}
    >
      {/* Centralized Global Overlays for a seamless cinematic panorama feel */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-0 w-full h-56 bg-gradient-to-b from-[#0284C7]/20 to-transparent mix-blend-multiply" />
        <div className="absolute bottom-0 w-full h-80 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        <div className="absolute inset-0 bg-[#0F172A]/15" />
      </div>

      {/* Centralized Singular Content */}
      {activeVideo && <HeroOverlay activeVideo={activeVideo} />}

      {/* Panoramic Video Background */}
      <div className="absolute inset-0 w-full h-full z-10">
        <AnimatePresence>
          {videoLayouts.map(({ video, index, isFirst, style }) => (
            <div
              key={video._id}
              data-index={index}
              className="absolute top-0 bottom-0 h-full overflow-hidden"
              style={style}
              onMouseEnter={handleMouseEnter}
            >
              <VideoCard video={video} isMobile={isMobile} isFirst={isFirst} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}