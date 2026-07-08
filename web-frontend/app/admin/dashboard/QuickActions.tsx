// path: web-frontend/components/admin/dashboard/QuickActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface QuickActionItem {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  accent: string;
}

const ACTIONS: QuickActionItem[] = [
  {
    label: "Add Category",
    description: "Create a new classification tag",
    href: "/admin/categories",
    accent: "#3B82F6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    label: "Add Place",
    description: "Publish a new regional destination",
    href: "/admin/places",
    accent: "#6366F1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    label: "Add Event",
    description: "Schedule upcoming festivities",
    href: "/admin/events",
    accent: "#0EA5E9",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: "Upload Gallery",
    description: "Add high-res imagery to CDN",
    href: "/admin/gallery",
    accent: "#10B981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    label: "Manage Hero Videos",
    description: "Reorder homepage video reels",
    href: "/admin/hero-videos",
    accent: "#F59E0B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-9.375C2.25 8.004 2.754 7.5 3.375 7.5h17.25C21.246 7.5 21.75 8.004 21.75 8.625v9.75c0 .621-.504 1.125-1.125 1.125m0 0h-1.5m-15.75 0a1.125 1.125 0 011.125-1.125h13.5A1.125 1.125 0 0121 18.375M15 12l-4.5 2.598V9.402L15 12z" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Quick Actions</h2>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fast Operations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ACTIONS.map((action, idx) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(action.href)}
            className="group relative flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-200 overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.14)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Top accent border line */}
            <div
              className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ background: action.accent }}
            />

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300"
              style={{ background: `linear-gradient(135deg, ${action.accent}, #3B82F6)` }}
            >
              {action.icon}
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              {action.label}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {action.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}