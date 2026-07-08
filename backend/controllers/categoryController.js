// path: controllers/categoryController.js

import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Create Category
 */
export const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      icon,
      coverImage,
      coverImagePublicId,
      priority,
      status,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required.",
      });
    }

    const existingName = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    const existingSlug = await Category.findOne({ slug });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists.",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      coverImage,
      coverImagePublicId,
      priority,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get Categories
 * Search + Pagination + Sorting
 */
export const getCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      sort = "priority",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }

    let sortOption = { priority: 1 };

    switch (sort) {
      case "name":
        sortOption = { name: 1 };
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

    const total = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      categories,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get Single Category
 */
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Update Category
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (
      req.body.coverImagePublicId &&
      category.coverImagePublicId &&
      req.body.coverImagePublicId !== category.coverImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(category.coverImagePublicId);
      } catch (err) {
        console.log(err);
      }
    }

    const duplicateName = await Category.findOne({
      name: new RegExp(`^${req.body.name}$`, "i"),
      _id: {
        $ne: category._id,
      },
    });

    if (duplicateName) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    const duplicateSlug = await Category.findOne({
      slug: req.body.slug,
      _id: {
        $ne: category._id,
      },
    });

    if (duplicateSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists.",
      });
    }

    Object.assign(category, req.body);

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Delete Category
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (category.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(category.coverImagePublicId);
      } catch (err) {
        console.log(err);
      }
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Toggle Status
 */
export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    category.status =
      category.status === "active"
        ? "inactive"
        : "active";

    await category.save();

    res.json({
      success: true,
      message: "Status updated successfully.",
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};