"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// ─── Constants & Assets ────────────────────────────────────────────────────────
const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

const IMAGES = {
  beach: "https://res.cloudinary.com/dmxsb5kj9/image/upload/v1785317093/jwazjrbwp6yf5jmvb5qj_niep7k.jpg",
  waterfall: "https://res.cloudinary.com/tug8gdxt/image/upload/v1783746240/namma-byndoor/scifw62eabvawyi4ywb9.jpg",
  temple: "https://res.cloudinary.com/tug8gdxt/image/upload/v1783765816/namma-byndoor/eqep40dt53w9pn9mxswp.webp",
  river: "https://res.cloudinary.com/dmxsb5kj9/image/upload/v1785317568/pexels-akshayanilphotography-8282510_kzmxld.jpg",
  kodachadri: "https://res.cloudinary.com/tug8gdxt/image/upload/v1784467158/namma-byndoor/mlvy3zy6bkwo1wvrffbf.webp",
};

// Extracted static data outside component scope to prevent re-creation during scroll repaints
const journeyChapters = [
  {
    id: "01",
    title: "The Coast",
    image: IMAGES.beach,
    desc: "Stretching along the Arabian Sea, Byndoor's coastline is marked by expansive quiet beaches, dramatic sunsets, and the timeless rhythm of the tides.",
  },
  {
    id: "02",
    title: "Water & Wilderness",
    image: IMAGES.waterfall,
    desc: "Monsoon-fed rivers carve through the landscape, creating intricate estuaries and plunging into hidden waterfalls surrounded by dense tropical foliage.",
  },
  {
    id: "03",
    title: "Into the Ghats",
    image: IMAGES.kodachadri,
    desc: "Rising sharply from the coastal plains, the Western Ghats define the eastern horizon, offering deep wilderness, ancient trails, and sweeping vantage points.",
  },
  {
    id: "04",
    title: "Living Heritage",
    image: IMAGES.temple,
    desc: "Rooted in coastal and agrarian life, the region is dotted with historic temples and vibrant local traditions that continue to quietly shape the community.",
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Navbar />
      
      <main className="bg-white text-[#0F172A] selection:bg-[#0284C7] selection:text-white overflow-hidden">
        
        {/* ─── SECTION 1: CINEMATIC HERO ─── */}
        <section className="relative w-full h-[85svh] md:h-[95svh] flex items-end justify-center pb-16 md:pb-24">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/90 via-white/40 to-transparent z-10 pointer-events-none" aria-hidden="true" />
          
          <div className="absolute inset-0 z-0 bg-[#0F172A]">
            <Image
              src={IMAGES.beach}
              alt="Byndoor coastline meeting the sea"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 h-[60svh] bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-[1400px] px-6 md:px-12 lg:px-24 text-center">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-white/80 text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
                Namma Byndoor
              </span>
              <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight">
                About Byndoor
              </h1>
              <p className="text-white/90 text-lg md:text-2xl font-light mt-2 max-w-2xl mx-auto leading-snug">
                Where the Western Ghats meet the Arabian Sea.
              </p>
              <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto mt-4 font-light leading-relaxed hidden md:block">
                Discover a region quietly shaped by expansive coastlines, monsoon-fed rivers, hidden waterfalls, towering mountains, and enduring local heritage.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          >
            <div className="w-[1px] h-12 bg-white/30 overflow-hidden">
              <motion.div 
                animate={prefersReducedMotion ? {} : { y: [0, 48] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-1/2 bg-white"
              />
            </div>
          </motion.div>
        </section>

        {/* ─── SECTION 2: BETWEEN SEA AND MOUNTAINS ─── */}
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
              <FadeIn>
                <div className="w-12 h-[2px] bg-[#0284C7] mb-8" />
                <span className="text-[#0284C7] text-xs font-bold tracking-[0.25em] uppercase block mb-4">
                  This is Byndoor
                </span>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-8 text-[#0F172A]">
                  Between the sea and the mountains.
                </h2>
                <div className="space-y-6 text-[#1E3A5F]/80 font-light text-lg md:text-xl leading-relaxed">
                  <p>
                    Byndoor is a quiet coastal stretch where geography takes center stage. Here, the rolling hills of the Western Ghats descend toward the Arabian Sea, carved by a network of rivers that sustain rich estuarine ecosystems and local communities.
                  </p>
                  <p>
                    It is a place of slow tides, deep monsoon forests, and enduring traditions—a landscape defined by water and wilderness.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <FadeIn delay={0.1} className="relative w-full aspect-[4/3] lg:aspect-[3/2] overflow-hidden bg-[#F8FCFF]">
                <Image
                  src={IMAGES.river}
                  alt="A quiet river flowing through Byndoor's landscape"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transform-gpu transition-transform duration-700 ease-out hover:scale-105"
                />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: A JOURNEY THROUGH BYNDOOR ─── */}
        <section className="w-full py-24 bg-[#F8FCFF]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
            
            <FadeIn className="text-center mb-20 md:mb-32">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#0F172A]">
                A Journey Through Byndoor
              </h2>
              <p className="mt-4 text-[#1E3A5F]/70 text-lg font-light">
                Explore the environments that shape our region.
              </p>
            </FadeIn>

            <div className="space-y-24 md:space-y-40">
              {journeyChapters.map((chapter, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={chapter.id} className={`flex flex-col gap-10 md:gap-16 lg:gap-24 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <FadeIn className="w-full md:w-3/5">
                      <div className="relative aspect-video md:aspect-[16/10] overflow-hidden bg-gray-100">
                        <Image
                          src={chapter.image}
                          alt={`Landscape showing Byndoor's ${chapter.title.toLowerCase()}`}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 60vw"
                          className="object-cover"
                        />
                      </div>
                    </FadeIn>
                    <FadeIn className="w-full md:w-2/5 flex flex-col justify-center" delay={0.1}>
                      <span className="text-[#0284C7]/40 text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 md:-ml-2">
                        {chapter.id}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-medium text-[#0F172A] mb-6">
                        {chapter.title}
                      </h3>
                      <p className="text-[#1E3A5F]/80 text-lg md:text-xl font-light leading-relaxed">
                        {chapter.desc}
                      </p>
                    </FadeIn>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ─── SECTION 4: BYNDOOR MAP SIGNATURE ─── */}
        <section className="relative w-full py-32 md:py-48 overflow-hidden flex flex-col items-center justify-center bg-white border-y border-[#0284C7]/10">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] text-6xl md:text-9xl font-black uppercase tracking-widest leading-none flex flex-wrap items-center justify-around overflow-hidden select-none">
            <span className="translate-y-12">Coast</span>
            <span className="-translate-y-24">Rivers</span>
            <span className="translate-y-32">Waterfalls</span>
            <span className="-translate-y-12">Mountains</span>
            <span className="translate-y-16">Heritage</span>
          </div>

          <div className="relative z-10 w-full max-w-lg mx-auto px-6 flex flex-col items-center">
            <motion.svg viewBox="0 0 210 140" className="w-full max-w-[280px] md:max-w-[360px] h-auto drop-shadow-sm mb-12" aria-hidden="true">
              <motion.path
                d={MAP_PATH}
                fill="none"
                stroke="#0284C7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </motion.svg>
            <FadeIn className="text-center" delay={0.2}>
              <span className="block text-[#0F172A] text-2xl md:text-3xl font-medium tracking-wide mb-2">BYNDOOR</span>
              <span className="block text-[#0284C7] text-sm md:text-base font-medium tracking-[0.2em] uppercase">
                From the Arabian Sea to the Western Ghats
              </span>
            </FadeIn>
          </div>
        </section>

        {/* ─── SECTION 5: FIVE LANDSCAPES, ONE BYNDOOR ─── */}
        <section className="w-full py-24 md:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
            
            <FadeIn className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#0F172A]">
                Five landscapes. One Byndoor.
              </h2>
            </FadeIn>

            <div className="hidden md:grid grid-cols-12 gap-4 auto-rows-[250px] lg:auto-rows-[300px]">
              <div className="col-span-12 lg:col-span-7 relative group overflow-hidden bg-gray-100">
                <Image src={IMAGES.beach} alt="Coast" fill loading="lazy" sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <span className="absolute bottom-6 left-6 text-white text-sm font-bold tracking-[0.2em] uppercase">Coast</span>
              </div>
              <div className="col-span-12 lg:col-span-5 relative group overflow-hidden bg-gray-100">
                <Image src={IMAGES.river} alt="Rivers" fill loading="lazy" sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <span className="absolute bottom-6 left-6 text-white text-sm font-bold tracking-[0.2em] uppercase">Rivers</span>
              </div>
              <div className="col-span-4 relative group overflow-hidden bg-gray-100">
                <Image src={IMAGES.waterfall} alt="Waterfalls" fill loading="lazy" sizes="33vw" className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <span className="absolute bottom-6 left-6 text-white text-sm font-bold tracking-[0.2em] uppercase">Waterfalls</span>
              </div>
              <div className="col-span-4 relative group overflow-hidden bg-gray-100">
                <Image src={IMAGES.kodachadri} alt="Mountains" fill loading="lazy" sizes="33vw" className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <span className="absolute bottom-6 left-6 text-white text-sm font-bold tracking-[0.2em] uppercase">Mountains</span>
              </div>
              <div className="col-span-4 relative group overflow-hidden bg-gray-100">
                <Image src={IMAGES.temple} alt="Heritage" fill loading="lazy" sizes="33vw" className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <span className="absolute bottom-6 left-6 text-white text-sm font-bold tracking-[0.2em] uppercase">Heritage</span>
              </div>
            </div>

            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 gap-4 hide-scrollbar touch-pan-x">
              {[ 
                { src: IMAGES.beach, label: "Coast" },
                { src: IMAGES.river, label: "Rivers" },
                { src: IMAGES.waterfall, label: "Waterfalls" },
                { src: IMAGES.kodachadri, label: "Mountains" },
                { src: IMAGES.temple, label: "Heritage" }
              ].map((img, i) => (
                <div key={i} className="relative flex-none w-[85vw] aspect-video snap-center overflow-hidden bg-gray-100">
                  <Image src={img.src} alt={img.label} fill loading="lazy" sizes="85vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white text-xs font-bold tracking-[0.2em] uppercase">{img.label}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── SECTION 6: ABOUT NAMMA BYNDOOR (THE PLATFORM) ─── */}
        <section className="relative w-full py-32 md:py-48 bg-[#F8FCFF] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <svg viewBox="0 0 210 140" className="w-[150vw] md:w-[60vw] max-w-[800px] h-auto">
              <path d={MAP_PATH} fill="none" stroke="#0284C7" strokeWidth="3" />
            </svg>
          </div>
          <FadeIn className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <span className="text-[#0284C7] text-xs font-bold tracking-[0.25em] uppercase block mb-6">
              The Platform
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#0F172A] mb-6">
              Namma Byndoor
            </h2>
            <p className="text-2xl md:text-3xl font-light text-[#0F172A] mb-8">
              Our home. Our stories. One place.
            </p>
            <p className="text-[#1E3A5F]/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Namma Byndoor was created to gather the landscapes, heritage, and quiet corners of this region into one seamless digital experience. Designed as a modern discovery platform, our goal is to help you explore the destinations and nature that make Byndoor unique.
            </p>
          </FadeIn>
        </section>

        {/* ─── SECTION 7: FINAL CTA ─── */}
        <section className="relative w-full min-h-[60svh] md:min-h-[70svh] flex flex-col items-center justify-center py-24">
          <div className="absolute inset-0 z-0 bg-[#0F172A]">
            <Image
              src={IMAGES.kodachadri}
              alt="View over the Western Ghats from Kodachadri"
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0F172A]/60" />
          </div>
          <FadeIn className="relative z-10 w-full px-6 text-center flex flex-col items-center">
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
              There is more to discover.
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-xl mx-auto">
              Begin your journey and explore destinations across the coast and the ghats.
            </p>
            <Link href="/places" className="group">
              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0369A1] text-sm md:text-base font-bold tracking-[0.15em] uppercase shadow-xl transition-colors hover:bg-gray-50"
              >
                Explore Places
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M3.33334 8H12.6667M12.6667 8L8 3.33333M12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </Link>
          </FadeIn>
        </section>
        
        {/* CSS Utility for Mobile Snap Gallery */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { 
            -ms-overflow-style: none; 
            scrollbar-width: none; 
            overscroll-behavior-x: contain; 
          }
        `}} />
      </main>
      <Footer />
    </>
  );
}