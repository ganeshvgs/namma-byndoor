// path: web-frontend/components/admin/categories/types.ts

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  coverImage: string;
  priority: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryFormData = Omit<Category, "_id" | "createdAt" | "updatedAt">;

export type SortField = "priority-asc" | "priority-desc" | "name-asc" | "name-desc" | "newest";

export type FilterStatus = "all" | "active" | "inactive";