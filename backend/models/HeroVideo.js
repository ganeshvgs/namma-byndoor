import mongoose from "mongoose";

const heroVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    desktopVideoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    mobileVideoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HeroVideo = mongoose.model("HeroVideo", heroVideoSchema);

export default HeroVideo;