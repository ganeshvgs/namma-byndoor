// path: web-frontend/components/admin/categories/CategoriesView.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, SortField, FilterStatus } from "./types";
import { api, ApiError } from "../../lib/api";
import { toast } from "../Toast";
import CategorySkeleton from "./CategorySkeleton";
import CategoryEmptyState from "./CategoryEmptyState";
import CategoryControls from "./CategoryControls";
import CategoryCard from "./CategoryCard";
import CategoryModal from "./CategoryModal";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import CategoryPagination from "./CategoryPagination";

const PAGE_SIZE = 6;

export default function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, Sort & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("priority-asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; categories: Category[] }>("/api/categories");
      setCategories(Array.isArray(res.categories) ? res.categories : []);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortField]);

  // Memoized Filter & Sort Engine
  const processedCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        // Status Filter
        if (statusFilter !== "all" && cat.status !== statusFilter) return false;
        // Search Filter (by Name, Slug or Description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = cat.name?.toLowerCase().includes(q);
          const matchSlug = cat.slug?.toLowerCase().includes(q);
          const matchDesc = cat.description?.toLowerCase().includes(q);
          return matchName || matchSlug || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortField) {
          case "priority-asc":
            return (a.priority || 1) - (b.priority || 1);
          case "priority-desc":
            return (b.priority || 1) - (a.priority || 1);
          case "name-asc":
            return (a.name || "").localeCompare(b.name || "");
          case "name-desc":
            return (b.name || "").localeCompare(a.name || "");
          case "newest":
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          default:
            return 0;
        }
      });
  }, [categories, statusFilter, searchQuery, sortField]);

  // Pagination slice
  const totalPages = Math.ceil(processedCategories.length / PAGE_SIZE);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processedCategories.slice(start, start + PAGE_SIZE);
  }, [processedCategories, currentPage]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setModalOpen(true);
  }

  const isFilterActive = Boolean(searchQuery.trim() || statusFilter !== "all");

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-black leading-tight"
            style={{
              background: "linear-gradient(135deg, #F8FAFC 30%, #93C5FD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Categories
          </h1>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Manage navigation taxonomies and group content across regional modules.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap self-start sm:self-auto"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
            boxShadow: "0 0 24px rgba(99,102,241,0.4)",
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Category
        </motion.button>
      </div>

      {/* Search, Filter & Sort Bar */}
      <CategoryControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortField={sortField}
        onSortChange={setSortField}
        totalResults={processedCategories.length}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => <CategorySkeleton key={i} />)
          ) : paginatedCategories.length === 0 ? (
            <CategoryEmptyState
              key="empty"
              onAdd={openAdd}
              isFiltered={isFilterActive}
              onResetFilters={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            />
          ) : (
            paginatedCategories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onEdit={openEdit}
                onDelete={setDeleting}
                onStatusToggled={fetchCategories}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {!loading && processedCategories.length > 0 && (
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={processedCategories.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create / Edit Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={fetchCategories}
      />

      {/* Delete Confirmation Dialog */}
      <CategoryDeleteDialog
        category={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={fetchCategories}
      />
    </div>
  );
}