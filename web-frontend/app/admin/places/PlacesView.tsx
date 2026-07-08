// path: web-frontend/components/admin/places/PlacesView.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Place, ViewMode, PlaceSortField, PlaceStatusFilter } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";
import PlaceSkeleton from "./PlaceSkeleton";
import PlaceEmptyState from "./PlaceEmptyState";
import PlaceControls from "./PlaceControls";
import PlaceCard from "./PlaceCard";
import PlaceTable from "./PlaceTable";
import PlaceModal from "./PlaceModal";
import PlacePreviewModal from "./PlacePreviewModal";
import PlaceDeleteDialog from "./PlaceDeleteDialog";
import PlacePagination from "./PlacePagination";

const PAGE_SIZE = 6;

interface PlacesApiResponse {
  success: boolean;
  places: Place[];
  total: number;
  page: number;
  pages: number;
}

export default function PlacesView() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter & View States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<PlaceStatusFilter>("all");
  const [sortField, setSortField] = useState<PlaceSortField>("priority-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Place | null>(null);
  const [previewing, setPreviewing] = useState<Place | null>(null);
  const [deleting, setDeleting] = useState<Place | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const catRes = await api.get<{ success: boolean; categories: { _id: string; name: string }[] }>("/api/categories");
      if (Array.isArray(catRes.categories) && catRes.categories.length > 0) {
        setCategories(catRes.categories);
      } else {
        setCategories([{ _id: "c1", name: "Beaches" }, { _id: "c2", name: "Temples" }, { _id: "c3", name: "Hills & Trekking" }]);
      }
    } catch {
      setCategories([{ _id: "c1", name: "Beaches" }, { _id: "c2", name: "Temples" }, { _id: "c3", name: "Hills & Trekking" }]);
    }
  }, []);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: PAGE_SIZE.toString(),
      });

      if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());
      if (categoryFilter !== "all") queryParams.append("category", categoryFilter);
      
      if (statusFilter === "active" || statusFilter === "inactive") {
        queryParams.append("status", statusFilter);
      } else if (statusFilter === "featured") {
        queryParams.append("featured", "true");
      }

      let backendSort = "priority";
      if (sortField === "title-asc" || sortField === "title-desc") backendSort = "title";
      if (sortField === "newest") backendSort = "newest";
      if (sortField === "priority-desc") backendSort = "oldest";
      queryParams.append("sort", backendSort);

      const res = await api.get<PlacesApiResponse>(`/api/places?${queryParams.toString()}`);
      if (res && Array.isArray(res.places)) {
        let sortedPlaces = [...res.places];
        if (sortField === "priority-asc") {
          sortedPlaces.sort((a, b) => (a.priority || 1) - (b.priority || 1));
        } else if (sortField === "priority-desc") {
          sortedPlaces.sort((a, b) => (b.priority || 1) - (a.priority || 1));
        } else if (sortField === "title-asc") {
          sortedPlaces.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } else if (sortField === "title-desc") {
          sortedPlaces.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        }

        setPlaces(sortedPlaces);
        setTotalItems(res.total || sortedPlaces.length);
        setTotalPages(res.pages || 1);
      } else {
        setPlaces([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load places.");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, statusFilter, sortField]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sortField]);

  const isFilterActive = Boolean(searchQuery.trim() || categoryFilter !== "all" || statusFilter !== "all");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-400">
            Regional Places
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Publish, categorize, and showcase coastal destinations and heritage spots.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Add Destination
        </button>
      </div>

      {/* Control Bar */}
      <PlaceControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        availableCategories={categories}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortField={sortField}
        onSortChange={setSortField}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={totalItems}
      />

      {/* Main Content Area */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <PlaceSkeleton viewMode={viewMode} count={PAGE_SIZE} />
        ) : places.length === 0 ? (
          <PlaceEmptyState
            key="empty"
            onAdd={() => { setEditing(null); setModalOpen(true); }}
            isFiltered={isFilterActive}
            onResetFilters={() => { setSearchQuery(""); setCategoryFilter("all"); setStatusFilter("all"); }}
          />
        ) : viewMode === "table" ? (
          <PlaceTable
            key="table"
            places={places}
            onEdit={(p) => { setEditing(p); setModalOpen(true); }}
            onDelete={setDeleting}
            onPreview={setPreviewing}
            onRefresh={fetchPlaces}
          />
        ) : (
          <div key="grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {places.map((place) => (
              <PlaceCard
                key={place._id}
                place={place}
                onEdit={(p) => { setEditing(p); setModalOpen(true); }}
                onDelete={setDeleting}
                onPreview={setPreviewing}
                onRefresh={fetchPlaces}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && places.length > 0 && (
        <PlacePagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
      )}

      {/* Modals */}
      <PlaceModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} onSaved={fetchPlaces} availableCategories={categories} />
      <PlacePreviewModal place={previewing} onClose={() => setPreviewing(null)} />
      <PlaceDeleteDialog place={deleting} onClose={() => setDeleting(null)} onDeleted={fetchPlaces} />
    </div>
  );
}