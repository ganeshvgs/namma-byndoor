export type SectionType =
  | "overview"
  | "history"
  | "highlights"
  | "thingsToDo"
  | "travelTips"
  | "nature"
  | "culture"
  | "food"
  | "festivals"
  | "wildlife"
  | "photography"
  | "howToReach"
  | "nearbyPlaces"
  | "interestingFacts"
  | "faq"
  | "custom";

export interface ContentSection {
  id: string;
  sectionType: SectionType;
  title: string;
  content: string;
  displayOrder: number;
  icon?: string;
  themeColor?: string;
  visible: boolean;
}

export interface GalleryImage {
  image: string;
  publicId?: string;
}

export interface PlaceCategoryRef {
  _id?: string;
  name?: string;
}

export interface PlaceDetails {
  _id: string;
  category: PlaceCategoryRef | string;
  title: string;
  slug: string;
  shortDescription?: string;
  story?: string;
  contentSections?: ContentSection[];
  coverImage: string;
  galleryImages?: GalleryImage[];
  video?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  bestTime?: string;
  openingHours?: string;
  entryFee?: string;
  tags?: string[];
  featured?: boolean;
  priority?: number;
  status: "active" | "inactive" | string;
}

export interface PlaceApiResponse {
  success?: boolean;
  place?: PlaceDetails;
  data?: PlaceDetails;
}