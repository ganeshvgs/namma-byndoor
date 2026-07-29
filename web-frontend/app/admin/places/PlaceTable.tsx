// path: web-frontend/components/admin/places/PlaceTable.tsx
"use client";

import { Place } from "./types";

interface PlaceTableProps {
  places: Place[];
  onEdit: (p: Place) => void;
  onDelete: (p: Place) => void;
  onPreview: (p: Place) => void;
  onRefresh: () => void;
}

export default function PlaceTable({ places, onEdit, onDelete, onPreview }: PlaceTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-indigo-500/15 bg-slate-900/40 backdrop-blur-md shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-slate-900/80">
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Destination</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Category</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">CMS Builder</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {places.map((place) => (
            <tr key={place._id} className="hover:bg-white/5 transition-colors group">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={place.coverImage || "https://placehold.co/100x100"} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                  <div>
                    <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{place.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">/{place.slug}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="px-2.5 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded-md border border-white/10">
                  {place.category?.name || "General"}
                </span>
              </td>
              <td className="p-4">
                 <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                   {place.contentSections?.length || 0} Sections
                 </span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center w-fit gap-1.5 ${place.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400 border border-white/10"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${place.status === "active" ? "bg-emerald-400" : "bg-slate-400"}`} />
                  {place.status === "active" ? "Live" : "Draft"}
                </span>
              </td>
              <td className="p-4 text-right space-x-2 whitespace-nowrap">
                <button onClick={() => onPreview(place)} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold">Preview</button>
                <button onClick={() => onEdit(place)} className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[11px] font-bold">Edit</button>
                <button onClick={() => onDelete(place)} className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}