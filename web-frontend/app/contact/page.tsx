"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FormEvent, useState } from "react";
import 
// The exact map path used across the Namma Byndoor brand
const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

export default function ContactPage() {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Connect to backend API
    // Currently, there is no API endpoint (/api/contact) established for Namma Byndoor.
    // Insert your fetch() or Server Action call here to handle form submission securely.
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Form architecture ready. Backend connection required.");
    }, 800);
  };

  return (
    <>
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative w-full pt-40 pb-20 md:pt-48 md:pb-28 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#F8FCFF] to-white overflow-hidden">
        
        {/* Subtle Decorative Map */}
        <div className="absolute top-1/2 right-0 md:right-10 -translate-y-1/2 w-[120vw] md:w-[60vw] max-w-[800px] opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 210 140" aria-hidden="true" className="w-full h-auto">
            <motion.path
              d={MAP_PATH}
              fill="none"
              stroke="#0369A1"
              strokeWidth="1"
              initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="text-[#0284C7] text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 block">
              Get in touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight mb-6 leading-[1.1]">
              Connect with Namma Byndoor
            </h1>
            <p className="text-[#1E3A5F]/80 text-lg md:text-xl font-light leading-relaxed">
              Have a place to suggest, information to share, or something you&apos;d like us to know? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. MAIN CONTACT SECTION ─── */}
      <section className="w-full pb-24 md:pb-32 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Context & Information */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col pt-2"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              We&apos;d love to hear from you
            </h2>
            <p className="text-[#1E3A5F]/80 text-base md:text-lg font-light leading-relaxed mb-10">
              Namma Byndoor is built for the community and travelers alike. You can use this form to:
            </p>

            <ul className="flex flex-col gap-4 mb-12">
              {[
                "Suggest a new destination or hidden gem",
                "Report incorrect or outdated information",
                "Share local knowledge and history",
                "Give general feedback"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#38BDF8] mt-0.5">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[#0F172A] font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* Place Suggestion Callout block */}
            <div className="bg-[#F8FCFF] border border-[#0284C7]/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-[#0369A1] font-bold tracking-wide mb-2">
                Know a place we should feature?
              </h3>
              <p className="text-[#1E3A5F]/80 text-sm md:text-base font-light leading-relaxed">
                Help us discover beaches, waterfalls, temples, viewpoints, and other beautiful places around Byndoor, Karnataka.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-[#0F172A]">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    className="h-14 px-4 rounded-xl bg-white border border-[#0284C7]/20 text-[#0F172A] placeholder:text-[#1E3A5F]/40 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all shadow-sm"
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#0F172A]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="h-14 px-4 rounded-xl bg-white border border-[#0284C7]/20 text-[#0F172A] placeholder:text-[#1E3A5F]/40 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all shadow-sm"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-[#0F172A]">
                  Subject
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full h-14 px-4 appearance-none rounded-xl bg-white border border-[#0284C7]/20 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all shadow-sm cursor-pointer"
                  >
                    <option value="" disabled selected>Select a topic...</option>
                    <option value="Place suggestion">Place suggestion</option>
                    <option value="Incorrect information">Incorrect information</option>
                    <option value="Feedback">Feedback</option>
                    <option value="General message">General message</option>
                  </select>
                  {/* Custom Dropdown Arrow */}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#0284C7]">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-[#0F172A]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="p-4 rounded-xl bg-white border border-[#0284C7]/20 text-[#0F172A] placeholder:text-[#1E3A5F]/40 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all shadow-sm resize-y min-h-[150px]"
                  placeholder="How can we help?"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-none cursor-pointer bg-gradient-to-br from-[#0369A1] to-[#38BDF8] text-white text-[0.95rem] font-bold tracking-[0.1em] uppercase shadow-[0_2px_12px_rgba(2,132,199,0.30)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(2,132,199,0.40)] motion-safe:hover:-translate-y-[1px] motion-safe:active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}