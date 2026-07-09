// controllers/placeController.js
import mongoose from "mongoose";
import Place from "../models/Place.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

/* ===========================================
   Create Place
=========================================== */
export const createPlace = async (req, res) => {
  try {
    const {
      category,
      title,
      slug,
      shortDescription,
      story,
      coverImage,
      coverImagePublicId,
      galleryImages,
      video,
      latitude,
      longitude,
      googleMapsUrl,
      bestTime,
      openingHours,
      entryFee,
      tags,
      featured,
      priority,
      status,
    } = req.body;

    if (!title || !slug || !category || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: "Title, Slug, Category, and Short Description are required.",
      });
    }

    let categoryDoc;
    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({ name: category });
    }

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const existingTitle = await Place.findOne({
      title: new RegExp(`^${title}$`, "i"),
    });

    if (existingTitle) {
      return res.status(400).json({
        success: false,
        message: "Place title already exists.",
      });
    }

    const existingSlug = await Place.findOne({ slug });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists.",
      });
    }

    const place = await Place.create({
      category: categoryDoc._id,
      title,
      slug,
      shortDescription,
      story,
      coverImage,
      coverImagePublicId,
      galleryImages: galleryImages || [],
      video,
      latitude,
      longitude,
      googleMapsUrl,
      bestTime,
      openingHours,
      entryFee,
      tags: tags || [],
      featured,
      priority,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Place created successfully.",
      place,
    });
  } catch (err) {
    console.error("createPlace Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   Get All Places
=========================================== */
export const getPlaces = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      status,
      featured,
      sort = "priority",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { story: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    let sortOption = {};
    switch (sort) {
      case "title":
        sortOption = { title: 1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { priority: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [total, places] = await Promise.all([
      Place.countDocuments(query),
      Place.find(query)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      places,
    });
  } catch (err) {
    console.error("getPlaces Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   Get Single Place
=========================================== */
/* ===========================================
   Get Single Place by MongoDB ID or Slug
=========================================== */
export const getPlace = async (req, res) => {
  try {
    const { id } = req.params;

    let place;

    // Admin requests may use MongoDB ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      place = await Place.findById(id).populate(
        "category",
        "name slug description icon coverImage"
      );
    } else {
      // Public place pages use the readable slug
      place = await Place.findOne({
        slug: id.toLowerCase().trim(),
        status: "active",
      }).populate(
        "category",
        "name slug description icon coverImage"
      );
    }

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    return res.status(200).json({
      success: true,
      place,
    });
  } catch (err) {
    console.error("getPlace Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve place.",
      error: err.message,
    });
  }
};

/* ===========================================
   Update Place
=========================================== */
export const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    const {
      category,
      title,
      slug,
      shortDescription,
      story,
      coverImage,
      coverImagePublicId,
      galleryImages,
      video,
      latitude,
      longitude,
      googleMapsUrl,
      bestTime,
      openingHours,
      entryFee,
      tags,
      featured,
      priority,
      status,
    } = req.body;

    if (category) {
      let categoryDoc;
      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryDoc = await Category.findById(category);
      } else {
        categoryDoc = await Category.findOne({ name: category });
      }

      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
      place.category = categoryDoc._id;
    }

    if (title && title !== place.title) {
      const duplicateTitle = await Place.findOne({
        title: new RegExp(`^${title}$`, "i"),
        _id: { $ne: place._id },
      });

      if (duplicateTitle) {
        return res.status(400).json({
          success: false,
          message: "Place title already exists.",
        });
      }
      place.title = title;
    }

    if (slug && slug !== place.slug) {
      const duplicateSlug = await Place.findOne({
        slug,
        _id: { $ne: place._id },
      });

      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists.",
        });
      }
      place.slug = slug;
    }

    if (
      coverImagePublicId &&
      place.coverImagePublicId &&
      coverImagePublicId !== place.coverImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(place.coverImagePublicId);
      } catch (err) {
        console.error("Cloudinary destroy error:", err.message);
      }
    }

    if (shortDescription !== undefined) place.shortDescription = shortDescription;
    if (story !== undefined) place.story = story;
    if (coverImage !== undefined) place.coverImage = coverImage;
    if (coverImagePublicId !== undefined) place.coverImagePublicId = coverImagePublicId;
    if (galleryImages !== undefined) place.galleryImages = galleryImages;
    if (video !== undefined) place.video = video;
    if (latitude !== undefined) place.latitude = latitude;
    if (longitude !== undefined) place.longitude = longitude;
    if (googleMapsUrl !== undefined) place.googleMapsUrl = googleMapsUrl;
    if (bestTime !== undefined) place.bestTime = bestTime;
    if (openingHours !== undefined) place.openingHours = openingHours;
    if (entryFee !== undefined) place.entryFee = entryFee;
    if (tags !== undefined) place.tags = tags;
    if (featured !== undefined) place.featured = featured;
    if (priority !== undefined) place.priority = priority;
    if (status !== undefined) place.status = status;

    await place.save({ runValidators: true });

    const updatedPlace = await Place.findById(place._id).populate(
      "category",
      "name slug"
    );

    return res.status(200).json({
      success: true,
      message: "Place updated successfully.",
      place: updatedPlace,
    });
  } catch (err) {
    console.error("updatePlace Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   Delete Place
=========================================== */
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    const deletePromises = [];

    if (place.coverImagePublicId) {
      deletePromises.push(cloudinary.uploader.destroy(place.coverImagePublicId));
    }

    if (place.galleryImages && place.galleryImages.length > 0) {
      for (const img of place.galleryImages) {
        if (img.publicId) {
          deletePromises.push(cloudinary.uploader.destroy(img.publicId));
        }
      }
    }

    await Promise.allSettled(deletePromises);
    await place.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Place deleted successfully.",
    });
  } catch (err) {
    console.error("deletePlace Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   Toggle Status
=========================================== */
export const toggleStatus = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    place.status = place.status === "active" ? "inactive" : "active";
    await place.save({ runValidators: true });

    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      place,
    });
  } catch (err) {
    console.error("toggleStatus Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   Toggle Featured
=========================================== */
export const toggleFeatured = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    place.featured = !place.featured;
    await place.save({ runValidators: true });

    return res.status(200).json({
      success: true,
      message: "Featured updated successfully.",
      place,
    });
  } catch (err) {
    console.error("toggleFeatured Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};