"use client";

import { useEffect, useState } from "react";
import { Place } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";

interface PlaceCardProps {
  place: Place;
  onEdit: (p: Place) => void;
  onDelete: (p: Place) => void;
  onPreview: (p: Place) => void;
  onRefresh: () => Promise<void> | void;
}

export default function PlaceCard({
  place,
  onEdit,
  onDelete,
  onPreview,
  onRefresh,
}: PlaceCardProps) {
  const [statusLoading, setStatusLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  // Safely parse boolean in case the API returns a stringified "false" or "true"
  const isFeaturedValue = place.featured === true || String(place.featured) === "true";
  
  // Local featured state gives immediate visual feedback
  const [isFeatured, setIsFeatured] = useState(isFeaturedValue);

  // Keep local state synced when parent refreshes/replaces the place
  useEffect(() => {
    setIsFeatured(place.featured === true || String(place.featured) === "true");
  }, [place.featured]);

  async function handleToggleStatus() {
    if (statusLoading) return;

    setStatusLoading(true);

    try {
      await api.patch(`/api/places/${place._id}/status`);

      toast.success(
        `"${place.title}" is now ${
          place.status === "active" ? "inactive" : "active"
        }.`
      );

      // Await refresh to prevent race conditions before unlocking UI
      await onRefresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Failed to toggle status."
      );
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleToggleFeatured() {
    if (featuredLoading) return;

    const previousValue = isFeatured;
    const nextValue = !previousValue;

    // Optimistic update
    setIsFeatured(nextValue);
    setFeaturedLoading(true);

    try {
      const response = await api.patch<{
        success: boolean;
        message: string;
        place: Place;
      }>(
        `/api/places/${place._id}/featured`,
        {
          featured: nextValue,
        }
      );

      toast.success(
        nextValue
          ? `"${place.title}" added to Featured Places.`
          : `"${place.title}" removed from Featured Places.`
      );

      // Await refresh to prevent race conditions before unlocking UI
      await onRefresh();
    } catch (err) {
      // Roll back if backend fails
      setIsFeatured(previousValue);

      toast.error(
        err instanceof ApiError
          ? err.message
          : "Failed to update featured state."
      );
    } finally {
      setFeaturedLoading(false);
    }
  }

  const sectionsCount = place.contentSections?.length || 0;

  return (
    <div
      className={`
        group relative rounded-3xl overflow-hidden flex flex-col
        bg-slate-900/40 backdrop-blur-md
        shadow-xl transition-all duration-300

        ${
          isFeatured
            ? "border border-amber-400/50 shadow-amber-500/10"
            : "border border-indigo-500/15 hover:border-indigo-500/30 hover:shadow-indigo-500/10"
        }
      `}
    >
      {/* Featured top accent */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 z-30" />
      )}

      {/* =====================================================
          COVER IMAGE
      ===================================================== */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={
            place.coverImage ||
            "https://placehold.co/600x400?text=No+Image"
          }
          alt={place.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* =====================================================
            LEFT BADGES
        ===================================================== */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              {place.category?.name || "General"}
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-900/80 text-slate-300 border border-white/10 backdrop-blur-md">
              P{place.priority}
            </span>
          </div>

          {sectionsCount > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300 border border-white/20 backdrop-blur-md flex items-center gap-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-3 h-3"
              >
                <path d="M4 6h16M4 12h16M4 18h7" />
              </svg>

              CMS {sectionsCount} Sections
            </span>
          )}
        </div>

        {/* =====================================================
            RIGHT STATUS
        ===================================================== */}
        <div className="absolute top-3 right-3">
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={statusLoading}
            className={`
              px-2.5 py-1 rounded-full text-xs font-bold
              backdrop-blur-md transition-all
              flex items-center gap-1.5

              ${
                statusLoading
                  ? "opacity-60 cursor-wait"
                  : "hover:scale-105"
              }
            `}
            style={{
              background:
                place.status === "active"
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(15, 23, 42, 0.75)",

              color:
                place.status === "active"
                  ? "#34D399"
                  : "#94A3B8",

              border:
                place.status === "active"
                  ? "1px solid rgba(52, 211, 153, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
            }}
            title={
              place.status === "active"
                ? "Click to deactivate"
                : "Click to activate"
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />

            {statusLoading
              ? "Updating..."
              : place.status === "active"
              ? "Active"
              : "Inactive"}
          </button>
        </div>

        {/* =====================================================
            FEATURED INDICATOR
        ===================================================== */}

        {isFeatured && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-black/20">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="m12 2.5 2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.1l-5.72 3.01 1.09-6.37-4.63-4.51 6.4-.93L12 2.5Z" />
              </svg>

              FEATURED
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            className={`
              text-lg font-bold transition-colors line-clamp-1
              ${
                isFeatured
                  ? "text-white group-hover:text-amber-300"
                  : "text-white group-hover:text-indigo-400"
              }
            `}
          >
            {place.title}
          </h3>

          <p className="text-xs text-slate-400 font-mono mt-0.5">
            /{place.slug}
          </p>

          <p className="text-sm text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {place.shortDescription}
          </p>
        </div>

        {/* =====================================================
            FEATURED CONTROL
        ===================================================== */}
        <div>
          <button
            type="button"
            onClick={handleToggleFeatured}
            disabled={featuredLoading}
            aria-pressed={isFeatured}
            className={`
              w-full rounded-xl px-3.5 py-2.5
              flex items-center justify-between gap-3
              border transition-all duration-200

              ${
                featuredLoading
                  ? "opacity-70 cursor-wait"
                  : "hover:scale-[1.01]"
              }

              ${
                isFeatured
                  ? "bg-amber-500/15 border-amber-400/30 text-amber-300 hover:bg-amber-500/20"
                  : "bg-slate-800/60 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center

                  ${
                    isFeatured
                      ? "bg-amber-400 text-slate-950"
                      : "bg-white/5 text-slate-500"
                  }
                `}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isFeatured ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12 2.5 2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.1l-5.72 3.01 1.09-6.37-4.63-4.51 6.4-.93L12 2.5Z"
                  />
                </svg>
              </div>

              <div className="text-left">
                <p className="text-xs font-bold">
                  {featuredLoading
                    ? "Updating..."
                    : isFeatured
                    ? "Featured Place"
                    : "Not Featured"}
                </p>

                <p className="text-[10px] opacity-70 mt-0.5">
                  {isFeatured
                    ? "Shown in Featured Places"
                    : "Not shown in Featured Places"}
                </p>
              </div>
            </div>

            {/* Switch */}
            <div
              className={`
                relative w-10 h-5 rounded-full flex-shrink-0
                transition-colors duration-200

                ${
                  isFeatured
                    ? "bg-amber-400"
                    : "bg-slate-700"
                }
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-4 h-4 rounded-full
                  bg-white shadow
                  transition-all duration-200

                  ${
                    isFeatured
                      ? "left-[22px]"
                      : "left-0.5"
                  }
                `}
              />
            </div>
          </button>
        </div>

        {/* =====================================================
            GALLERY + TAGS
        ===================================================== */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          {place.galleryImages &&
            place.galleryImages.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-hidden">
                {place.galleryImages
                  .slice(0, 4)
                  .map((imgObj, i) => (
                    <img
                      key={imgObj.publicId || i}
                      src={imgObj.image}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover bg-slate-800 border border-white/10 flex-shrink-0"
                    />
                  ))}

                {place.galleryImages.length > 4 && (
                  <span className="text-[10px] font-bold text-slate-400 pl-1">
                    +{place.galleryImages.length - 4} more
                  </span>
                )}
              </div>
            )}

          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {place.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onPreview(place)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path
                fillRule="evenodd"
                d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>

            Preview
          </button>

          <button
            type="button"
            onClick={() => onEdit(place)}
            className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>

            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(place)}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>

            Delete
          </button>
        </div>
      </div>
    </div>
  );
}