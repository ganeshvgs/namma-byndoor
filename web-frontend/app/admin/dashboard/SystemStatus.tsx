// path: web-frontend/components/admin/dashboard/SystemStatus.tsx
"use client";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  latency: string;
  icon: React.ReactNode;
}

const SERVICES: ServiceStatus[] = [
  {
    name: "Database (MongoDB)",
    status: "operational",
    latency: "18ms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    name: "API Gateway",
    status: "operational",
    latency: "24ms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6v6m3-3v3M3 20.25h18" />
      </svg>
    ),
  },
  {
    name: "Cloudinary CDN",
    status: "operational",
    latency: "42ms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
  },
  {
    name: "Next.js Server",
    status: "operational",
    latency: "12ms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
];

export default function SystemStatus() {
  return (
    <div
      className="rounded-3xl p-6 sm:p-7 border border-indigo-500/15 shadow-xl flex flex-col justify-between"
      style={{
        background: "linear-gradient(160deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">System Status</h2>
          <p className="text-xs text-slate-400 mt-0.5">Live health indicators for core infrastructure</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          99.9% Uptime
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {SERVICES.map((service) => {
          const isOk = service.status === "operational";
          return (
            <div
              key={service.name}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800/90 text-slate-300 flex items-center justify-center">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-snug">{service.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: isOk ? "#34D399" : "#EF4444",
                        boxShadow: isOk ? "0 0 8px #34D399" : "0 0 8px #EF4444",
                      }}
                    />
                    <span className="text-[11px] font-medium text-slate-400 capitalize">
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-900/60 px-2 py-1 rounded-md border border-white/5">
                  {service.latency}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[11px] text-slate-500">
        <span>Last checked: Just now</span>
        <span>Server Region: ap-south-1 (Mumbai)</span>
      </div>
    </div>
  );
}