// models/Place.js
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
    story: {
      type: String,
      default: "",
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

placeSchema.index({
  title: "text",
  shortDescription: "text",
  story: "text",
  tags: "text",
});

placeSchema.index({ slug: 1 });
placeSchema.index({ priority: 1 });
placeSchema.index({ category: 1 });
placeSchema.index({ status: 1 });
placeSchema.index({ featured: 1 });

export default mongoose.model("Place", placeSchema);