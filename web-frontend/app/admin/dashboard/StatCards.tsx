// path: web-frontend/components/admin/dashboard/StatCards.tsx
"use client";

import { motion } from "framer-motion";

export interface StatItem {
  id: string;
  label: string;
  count: number | string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  borderColor: string;
}

interface StatCardsProps {
  stats: StatItem[];
  loading?: boolean;
}

// Skeleton loader matching your existing dark slate design
function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between h-36 animate-pulse"
      style={{
        background: "rgba(30, 41, 59, 0.5)",
        border: "1px solid rgba(99, 102, 241, 0.1)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-700/70 rounded-lg w-24" />
        <div className="w-10 h-10 rounded-xl bg-slate-700/60" />
      </div>
      <div>
        <div className="h-8 bg-slate-700/80 rounded-xl w-16 mb-2" />
        <div className="h-3 bg-slate-700/50 rounded-lg w-32" />
      </div>
    </div>
  );
}

export default function StatCards({ stats, loading = false }: StatCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <StatCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="group relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-all duration-300"
          style={{
            background: "linear-gradient(160deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: `1px solid ${stat.borderColor}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Subtle background glow on hover */}
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
            style={{ background: stat.gradient }}
          />

          <div className="flex items-center justify-between gap-3 z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
              {stat.label}
            </span>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: stat.iconBg }}
            >
              {stat.icon}
            </div>
          </div>

          <div className="mt-4 z-10">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {stat.count}
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              {stat.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}