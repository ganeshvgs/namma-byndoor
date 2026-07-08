// path: web-frontend/components/admin/places/types.ts

export interface Place {
  _id: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  title: string;
  slug: string;
  shortDescription: string;
  story: string;
  coverImage: string;
  coverImagePublicId: string;
  galleryImages: {
    image: string;
    publicId: string;
  }[];
  video?: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string;
  bestTime?: string;
  openingHours?: string;
  entryFee?: string;
  tags: string[];
  featured: boolean;
  priority: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export type PlaceFormData = Omit<Place, "_id" | "createdAt" | "updatedAt" | "category" | "latitude" | "longitude"> & {
  category: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

export type ViewMode = "grid" | "table";

export type PlaceSortField = "priority-asc" | "priority-desc" | "title-asc" | "title-desc" | "newest";

export type PlaceStatusFilter = "all" | "active" | "inactive" | "featured";