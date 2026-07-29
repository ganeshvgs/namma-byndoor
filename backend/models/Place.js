// models/Place.js

/* =========================================================================
   WHAT CHANGED: 
   - Added `contentSectionSchema` to structure rich content entries.
   - Added `contentSections` array to the `placeSchema`.
   - Updated the `$text` index to search inside `contentSections.title` and `contentSections.content`.
   
   WHY IT CHANGED: 
   - To transform the platform from a simple CRUD API into a professional 
     Tourism CMS while maintaining strict validation for display ordering, 
     max lengths, and enum section types.
   
   BACKWARD COMPATIBILITY: 
   - The legacy `story` field remains untouched. Existing documents will 
     load without failure because `contentSections` defaults to an empty array.
========================================================================= */

import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// New Structured Content Section Schema
const contentSectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    sectionType: {
      type: String,
      required: true,
      enum: {
        values: [
          "overview", "history", "highlights", "thingsToDo", "travelTips",
          "nature", "culture", "food", "festivals", "wildlife",
          "photography", "howToReach", "nearbyPlaces", "interestingFacts",
          "faq", "custom"
        ],
        message: "{VALUE} is not a valid section type",
      },
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Section title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      trim: true,
      maxlength: [5000, "Section content cannot exceed 5000 characters"],
    },
    displayOrder: {
      type: Number,
      required: [true, "Display order is required"],
    },
    icon: {
      type: String,
      default: "",
    },
    themeColor: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, _id: false }
);

const placeSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    // Maintained for Backward Compatibility & Fallback Search
    story: {
      type: String,
      default: "",
    },
    // New Content Sections Array
    contentSections: {
      type: [contentSectionSchema],
      default: [],
      validate: [
        (val) => val.length <= 50,
        "Cannot exceed the maximum limit of 50 content sections",
      ],
    },
    coverImage: {
      type: String,
      default: "",
    },
    coverImagePublicId: {
      type: String,
      default: "",
    },
    galleryImages: [galleryImageSchema],
    video: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    googleMapsUrl: {
      type: String,
      default: "",
    },
    bestTime: {
      type: String,
      default: "",
    },
    openingHours: {
      type: String,
      default: "",
    },
    entryFee: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Updated Indexes for robust CMS searching
placeSchema.index({
  title: "text",
  shortDescription: "text",
  story: "text",
  tags: "text",
  "contentSections.title": "text",
  "contentSections.content": "text",
});
placeSchema.index({ slug: 1 });
placeSchema.index({ priority: 1 });
placeSchema.index({ category: 1 });
placeSchema.index({ status: 1 });
placeSchema.index({ featured: 1 });

export default mongoose.model("Place", placeSchema);