// path: web-frontend/components/admin/dashboard/RecentActivity.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "videos" | "events" | "messages";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  status: string;
  statusColor: string;
  statusBg: string;
}

const MOCK_VIDEOS: ActivityItem[] = [
  { id: "v1", title: "Monsoon at Maravanthe Beach", subtitle: "Desktop & Mobile 4K Reels", timestamp: "2 hours ago", status: "Active", statusColor: "#34D399", statusBg: "rgba(52, 211, 153, 0.15)" },
  { id: "v2", title: "Kollur Mookambika Temple Festival", subtitle: "Cultural Heritage Showcase", timestamp: "Yesterday", status: "Active", statusColor: "#34D399", statusBg: "rgba(52, 211, 153, 0.15)" },
  { id: "v3", title: "Ottinene Sunset Viewpoint", subtitle: "Drone View 1080p", timestamp: "3 days ago", status: "Inactive", statusColor: "#94A3B8", statusBg: "rgba(148, 163, 184, 0.15)" },
];

const MOCK_EVENTS: ActivityItem[] = [
  { id: "e1", title: "Byndoor Beach Festival 2026", subtitle: "Someshwara Beach • 3 Days", timestamp: "Starts in 12 days", status: "Upcoming", statusColor: "#38BDF8", statusBg: "rgba(56, 189, 248, 0.15)" },
  { id: "e2", title: "Monsoon Trekking Expedition", subtitle: "Kshitijneshwara Hills • Guided", timestamp: "Aug 15, 2026", status: "Published", statusColor: "#818CF8", statusBg: "rgba(129, 140, 248, 0.15)" },
  { id: "e3", title: "Traditional Kambala Race", subtitle: "Regional Sports Ground", timestamp: "Completed", status: "Archived", statusColor: "#64748B", statusBg: "rgba(100, 116, 139, 0.15)" },
];

const MOCK_MESSAGES: ActivityItem[] = [
  { id: "m1", title: "Inquiry: Homestay listing at Padubidri", subtitle: "From: Rajesh Shetty (rajesh@shetty.in)", timestamp: "15 mins ago", status: "New", statusColor: "#F59E0B", statusBg: "rgba(245, 158, 11, 0.15)" },
  { id: "m2", title: "Feedback on Maravanthe highway update", subtitle: "From: Ananya Rao (ananya.r@gmail.com)", timestamp: "5 hours ago", status: "Read", statusColor: "#60A5FA", statusBg: "rgba(96, 165, 250, 0.15)" },
  { id: "m3", title: "Requesting media credentials for festival", subtitle: "From: Coastal News Network", timestamp: "1 day ago", status: "Replied", statusColor: "#34D399", statusBg: "rgba(52, 211, 153, 0.15)" },
];

export default function RecentActivity() {
  const [activeTab, setActiveTab] = useState<TabType>("videos");

  const currentData =
    activeTab === "videos" ? MOCK_VIDEOS : activeTab === "events" ? MOCK_EVENTS : MOCK_MESSAGES;

  return (
    <div
      className="rounded-3xl p-6 sm:p-7 border border-indigo-500/15 shadow-xl flex flex-col justify-between"
      style={{
        background: "linear-gradient(160deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Recent Activity</h2>
          <p className="text-xs text-slate-400 mt-0.5">Latest updates across your portal modules</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/5 self-start sm:self-center">
          {[
            { id: "videos", label: "Hero Videos" },
            { id: "events", label: "Events" },
            { id: "messages", label: "Messages" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activity-tab-pill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List items */}
      <div className="mt-5 space-y-3 min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {currentData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center flex-shrink-0 text-indigo-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">{item.timestamp}</span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border"
                    style={{
                      color: item.statusColor,
                      background: item.statusBg,
                      borderColor: `${item.statusColor}33`,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
        <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.16 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}