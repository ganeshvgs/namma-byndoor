// path: web-frontend/components/admin/places/PlaceTable.tsx
"use client";

import { useState } from "react";
import { Place } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

interface PlaceTableProps {
  places: Place[];
  onEdit: (p: Place) => void;
  onDelete: (p: Place) => void;
  onPreview: (p: Place) => void;
  onRefresh: () => void;
}

export default function PlaceTable({ places, onEdit, onDelete, onPreview, onRefresh }: PlaceTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggleStatus(place: Place) {
    if (loadingId) return;
    setLoadingId(place._id);
    try {
      await api.patch(`/api/places/${place._id}/status`);
      toast.success(`Updated status for "${place.title}".`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed toggle status.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleToggleFeatured(place: Place) {
    if (loadingId) return;
    setLoadingId(place._id);
    try {
      await api.patch(`/api/places/${place._id}/featured`);
      toast.success(`Updated featured state for "${place.title}".`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed toggle featured.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-indigo-500/15 overflow-hidden bg-slate-900/40 backdrop-blur-md shadow-xl overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3.5 px-4">Destination</th>
            <th className="py-3.5 px-4 hidden sm:table-cell">Category</th>
            <th className="py-3.5 px-4 text-center">Priority</th>
            <th className="py-3.5 px-4 text-center">Featured</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
          {places.map((place) => (
            <tr key={place._id} className="hover:bg-white/[0.03] transition-colors">
              <td className="py-3 px-4 min-w-[200px]">
                <div className="flex items-center gap-3">
                  <img
                    src={place.coverImage || "https://placehold.co/100x100?text=No+Img"}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover bg-slate-800 flex-shrink-0 border border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{place.title}</p>
                    <p className="text-xs text-slate-400 font-mono truncate">/{place.slug}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell whitespace-nowrap">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {place.category?.name || "General"}
                </span>
              </td>
              <td className="py-3 px-4 text-center font-mono font-bold text-white">
                P{place.priority}
              </td>
              <td className="py-3 px-4 text-center whitespace-nowrap">
                <button
                  onClick={() => handleToggleFeatured(place)}
                  disabled={loadingId === place._id}
                  className="px-2.5 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105 inline-flex items-center gap-1"
                  style={{
                    background: place.featured ? "rgba(245, 158, 11, 0.2)" : "rgba(100, 116, 139, 0.15)",
                    color: place.featured ? "#FBBF24" : "#94A3B8",
                    border: place.featured ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  ⭐ {place.featured ? "Yes" : "No"}
                </button>
              </td>
              <td className="py-3 px-4 text-center whitespace-nowrap">
                <button
                  onClick={() => handleToggleStatus(place)}
                  disabled={loadingId === place._id}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold transition-transform hover:scale-105 inline-flex items-center gap-1.5"
                  style={{
                    background: place.status === "active" ? "rgba(16, 185, 129, 0.15)" : "rgba(100, 116, 139, 0.15)",
                    color: place.status === "active" ? "#34D399" : "#94A3B8",
                    border: place.status === "active" ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {place.status === "active" ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="py-3 px-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-1.5">
                  <button onClick={() => onPreview(place)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300" title="Preview">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  </button>
                  <button onClick={() => onEdit(place)} className="p-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300" title="Edit">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
                  </button>
                  <button onClick={() => onDelete(place)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400" title="Delete">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}