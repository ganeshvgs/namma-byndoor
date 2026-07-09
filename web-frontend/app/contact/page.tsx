// app/contact/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES & INTERFACES ---
type TabType = "message" | "experience" | "suggest" | "report";

interface TabOption {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: TabOption[] = [
  { id: "message", label: "Send Message", icon: "📩" },
  { id: "experience", label: "Share Experience", icon: "⭐" },
  { id: "suggest", label: "Suggest Place", icon: "📍" },
  { id: "report", label: "Report Issue", icon: "⚠" },
];

// --- ANIMATION VARIANTS ---
const tabContentVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    scale: 0.98,
    transition: { duration: 0.25, ease: "easeIn" }
  }
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

export default function ContactFeedbackPage() {
  const [activeTab, setActiveTab] = useState<TabType>("message");

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#0F172A] selection:bg-[#38BDF8]/20 selection:text-[#0284C7] font-sans pb-24 relative overflow-hidden">
      
      {/* Background Radial Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-[#0284C7]/15 to-[#38BDF8]/20 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[100px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 right-[-10%] w-[600px] h-[600px] bg-[#0284C7]/10 rounded-full blur-[140px] -z-10" />

      {/* --- HERO SECTION --- */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm backdrop-blur-md">
            COMMUNITY
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#0F172A]">
            Contact & Feedback
          </h1>
          <p className="text-base md:text-lg text-[#0F172A]/70 max-w-2xl mx-auto leading-relaxed font-normal">
            Help us improve Namma Byndoor by sharing your questions, experiences, suggestions, and reports.
          </p>
        </motion.div>
      </section>

      {/* --- SINGLE PREMIUM GLASS CONTAINER --- */}
      <section className="px-4 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.6)] rounded-[32px] p-6 md:p-10 shadow-[0_20px_50px_rgba(2,132,199,0.08)] backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Subtle Inner Border Glow */}
          <div className="absolute inset-0 rounded-[32px] border border-white/40 pointer-events-none" />

          {/* --- TAB NAVIGATION --- */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#0F172A]/[0.04] border border-white/50 rounded-2xl mb-8 backdrop-blur-md">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors duration-200 z-10 focus:outline-none ${
                    isActive ? "text-white font-semibold" : "text-[#0F172A]/70 hover:text-[#0F172A]"
                  }`}
                >
                  {/* Active Sliding Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-xl shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* --- DYNAMIC FORM AREA --- */}
          <div className="relative min-h-[420px]">
            <AnimatePresence mode="wait">
              {activeTab === "message" && <SendMessageTab key="message" />}
              {activeTab === "experience" && <ShareExperienceTab key="experience" />}
              {activeTab === "suggest" && <SuggestPlaceTab key="suggest" />}
              {activeTab === "report" && <ReportIssueTab key="report" />}
            </AnimatePresence>
          </div>

        </motion.div>
      </section>
    </div>
  );
}

/* =========================================================================
   TAB 1: SEND MESSAGE
   ========================================================================= */
function SendMessageTab() {
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return <SuccessState title="Message Sent!" message="Thank you for contacting Namma Byndoor. We will get back to you shortly." onReset={() => setSubmitted(false)} />;

  return (
    <motion.form
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Full Name" placeholder="e.g. Ganesh Gowda" required />
        <InputField label="Email Address" type="email" placeholder="name@example.com" required />
      </div>
      <InputField label="Subject" placeholder="How can we help you?" required />
      
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-[#0F172A]/70 font-medium">
          <label>Message <span className="text-[#0284C7]">*</span></label>
          <span>{charCount}/{maxChars}</span>
        </div>
        <textarea
          rows={4}
          maxLength={maxChars}
          required
          onChange={(e) => setCharCount(e.target.value.length)}
          placeholder="Write your message here..."
          className="w-full p-3.5 rounded-xl bg-white/60 border border-[rgba(255,255,255,0.8)] focus:bg-white focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/15 outline-none transition-all duration-200 text-sm text-[#0F172A] placeholder:text-[#0F172A]/30 resize-none shadow-inner"
        />
      </div>

      <SubmitButton label="Send Message" />
    </motion.form>
  );
}

/* =========================================================================
   TAB 2: SHARE EXPERIENCE
   ========================================================================= */
function ShareExperienceTab() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState("😍");

  const emojis = [
    { label: "Amazing", icon: "😍" },
    { label: "Happy", icon: "😊" },
    { label: "Neutral", icon: "😐" },
    { label: "Disappointed", icon: "😞" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return <SuccessState title="Thank You!" message="Your experience has been shared and will inspire fellow travelers." onReset={() => setSubmitted(false)} />;

  return (
    <motion.form
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Rating & Emoji Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white/40 border border-white/60">
        {/* Star Rating */}
        <div className="space-y-2 text-center md:text-left">
          <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
            Overall Rating
          </label>
          <div className="flex items-center justify-center md:justify-start gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                type="button"
                key={star}
                whileHover={{ scale: 1.2, rotate: -8 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl focus:outline-none p-1"
              >
                <span className={`transition-colors duration-150 ${
                  star <= (hoverRating || rating) ? "text-[#0284C7] drop-shadow-sm" : "text-gray-300"
                }`}>
                  ★
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Emoji Selector */}
        <div className="space-y-2 text-center md:text-left">
          <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
            How did you feel?
          </label>
          <div className="flex items-center justify-center md:justify-start gap-2">
            {emojis.map((item) => (
              <button
                type="button"
                key={item.icon}
                onClick={() => setSelectedEmoji(item.icon)}
                className={`p-2 rounded-xl text-xl transition-all duration-200 border ${
                  selectedEmoji === item.icon 
                    ? "bg-[#0284C7]/15 border-[#0284C7] scale-110 shadow-sm" 
                    : "bg-white/60 border-transparent hover:bg-white scale-100 opacity-60 hover:opacity-100"
                }`}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <InputField label="Experience Title" placeholder="e.g. Magical Sunset at Maravanthe" required />
      
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
          Your Story <span className="text-[#0284C7]">*</span>
        </label>
        <textarea
          rows={4}
          required
          placeholder="Describe your journey, favorite spots, and local hospitality..."
          className="w-full p-3.5 rounded-xl bg-white/60 border border-[rgba(255,255,255,0.8)] focus:bg-white focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/15 outline-none transition-all duration-200 text-sm text-[#0F172A] placeholder:text-[#0F172A]/30 resize-none shadow-inner"
        />
      </div>

      <InputField label="Your Name (Optional)" placeholder="e.g. Traveler / Anonymous" />

      <SubmitButton label="Submit Feedback" />
    </motion.form>
  );
}

/* =========================================================================
   TAB 3: SUGGEST PLACE
   ========================================================================= */
function SuggestPlaceTab() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return <SuccessState title="Suggestion Received!" message="Our curation team will review the location and add it to our hidden gems." onReset={() => setSubmitted(false)} />;

  return (
    <motion.form
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Place Name" placeholder="e.g. Someshwara Beach" required />
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
            Category <span className="text-[#0284C7]">*</span>
          </label>
          <select 
            required
            className="w-full p-3.5 rounded-xl bg-white/60 border border-[rgba(255,255,255,0.8)] focus:bg-white focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/15 outline-none transition-all duration-200 text-sm text-[#0F172A]"
          >
            <option value="">Select Category</option>
            <option value="beach">Beach & Coastline</option>
            <option value="temple">Temple & Heritage</option>
            <option value="nature">Nature & Waterfall</option>
            <option value="viewpoint">Sunset / Viewpoint</option>
            <option value="other">Other Hidden Gem</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Village / Location" placeholder="e.g. Byndoor, Udupi" required />
        <InputField label="Google Maps Link (Optional)" placeholder="https://maps.google.com/..." />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
          Why should people visit? <span className="text-[#0284C7]">*</span>
        </label>
        <textarea
          rows={3}
          required
          placeholder="What makes this place special? Any tips for getting there?"
          className="w-full p-3.5 rounded-xl bg-white/60 border border-[rgba(255,255,255,0.8)] focus:bg-white focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/15 outline-none transition-all duration-200 text-sm text-[#0F172A] placeholder:text-[#0F172A]/30 resize-none shadow-inner"
        />
      </div>

      <DragAndDropUpload label="Upload Place Photos" />

      <SubmitButton label="Submit Suggestion" />
    </motion.form>
  );
}

/* =========================================================================
   TAB 4: REPORT ISSUE
   ========================================================================= */
function ReportIssueTab() {
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    "Wrong Information",
    "Incorrect Location",
    "Garbage / Cleanliness",
    "Road Damage / Access",
    "Safety Concern",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return <SuccessState title="Report Submitted" message="We take community reports seriously and will investigate immediately." onReset={() => setSubmitted(false)} />;

  return (
    <motion.form
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
            Issue Type <span className="text-[#0284C7]">*</span>
          </label>
          <select 
            required
            className="w-full p-3.5 rounded-xl bg-white/60 border border-[rgba(255,255,255,0.8)] focus:bg-white focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/15 outline-none transition-all duration-200 text-sm text-[#0F172A]"
          >
            <option value="">Select an Issue</option>
            {issueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <InputField label="Location / Landmark" placeholder="Where is this issue located?" required />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
          Issue Description <span className="text-[#0284C7]">*</span>
        </label>
        <textarea
          rows={3}
          required
          placeholder="Please provide details so our ground team or moderators can address it..."
          className="w-full p-3.5 rounded-xl bg-white/60 border border-[rgba(255,255,255,0.8)] focus:bg-white focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/15 outline-none transition-all duration-200 text-sm text-[#0F172A] placeholder:text-[#0F172A]/30 resize-none shadow-inner"
        />
      </div>

      <DragAndDropUpload label="Upload Photo Proof (Recommended)" />

      <SubmitButton label="Submit Report" variant="warning" />
    </motion.form>
  );
}

/* =========================================================================
   REUSABLE UI COMPONENTS
   ========================================================================= */

// Standard Input Field
function InputField({ label, type = "text", placeholder, required = false }: { label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
        {label} {required && <span className="text-[#0284C7]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full p-3.5 rounded-xl bg-white/60 border border-[rgba(255,255,255,0.8)] focus:bg-white focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/15 outline-none transition-all duration-200 text-sm text-[#0F172A] placeholder:text-[#0F172A]/30 shadow-inner"
      />
    </div>
  );
}

// Premium Drag & Drop Area
function DragAndDropUpload({ label }: { label: string }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#0F172A]/70 uppercase tracking-wider block">
        {label}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
          isDragging 
            ? "border-[#0284C7] bg-[#0284C7]/10 scale-[1.01]" 
            : "border-[#0F172A]/15 bg-white/30 hover:bg-white/50 hover:border-[#38BDF8]"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] text-lg">
          📁
        </div>
        {file ? (
          <p className="text-sm font-semibold text-[#0284C7]">{file}</p>
        ) : (
          <>
            <p className="text-sm text-[#0F172A]/80 font-medium">
              <span className="text-[#0284C7] font-semibold underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-[#0F172A]/40">PNG, JPG, WEBP up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}

// Animated Blue Gradient Button
function SubmitButton({ label, variant = "primary" }: { label: string; variant?: "primary" | "warning" }) {
  return (
    <motion.button
      type="submit"
      whileHover={{ scale: 1.015, translateY: -1 }}
      whileTap={{ scale: 0.985 }}
      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg tracking-wide transition-all duration-200 relative overflow-hidden group ${
        variant === "warning"
          ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-orange-500/20 hover:shadow-orange-500/30"
          : "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] shadow-[#0284C7]/25 hover:shadow-[#0284C7]/40"
      }`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {label}
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
      {/* Subtle top glare effect */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.button>
  );
}

// Shared Success Animation Screen
function SuccessState({ title, message, onReset }: { title: string; message: string; onReset: () => void }) {
  return (
    <motion.div
      variants={successVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white text-2xl shadow-lg shadow-[#0284C7]/30"
      >
        ✓
      </motion.div>
      <h3 className="text-2xl font-bold text-[#0F172A]">{title}</h3>
      <p className="text-sm text-[#0F172A]/70 max-w-sm">{message}</p>
      <button
        onClick={onReset}
        className="mt-4 px-6 py-2.5 rounded-xl bg-white/80 border border-white hover:bg-white text-xs font-semibold text-[#0284C7] shadow-sm transition-all"
      >
        Submit Another
      </button>
    </motion.div>
  );
}