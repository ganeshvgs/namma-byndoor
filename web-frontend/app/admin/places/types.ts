// path: web-frontend/components/admin/places/types.ts

export type ViewMode = "grid" | "table";
export type PlaceSortField = "priority-asc" | "priority-desc" | "title-asc" | "title-desc" | "newest";
export type PlaceStatusFilter = "all" | "active" | "inactive" | "featured";

export type SectionType = 
  | "overview" | "history" | "highlights" | "thingsToDo" 
  | "travelTips" | "nature" | "culture" | "food" 
  | "festivals" | "wildlife" | "photography" | "howToReach" 
  | "nearbyPlaces" | "interestingFacts" | "faq" | "custom";

export interface ContentSection {
  id: string;
  sectionType: SectionType;
  title: string;
  content: string;
  displayOrder: number;
  visible: boolean;
  icon?: string;
  themeColor?: string;
}

export interface Place {
  _id: string;
  category: { _id: string; name: string; slug?: string } | null;
  title: string;
  slug: string;
  shortDescription: string;
  story: string;
  contentSections: ContentSection[];
  coverImage: string;
  coverImagePublicId?: string;
  galleryImages: { image: string; publicId: string }[];
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

export type PlaceFormData = Omit<Place, "_id" | "category" | "createdAt" | "updatedAt"> & {
  category: string;
  latitude: number | string;
  longitude: number | string;
};