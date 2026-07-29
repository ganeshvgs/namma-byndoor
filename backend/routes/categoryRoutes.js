import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controllers/categoryController.js";

const router = express.Router();

/* =========================================================
   PUBLIC CACHE
========================================================= */

const publicCache = (
  req,
  res,
  next
) => {
  res.set(
    "Cache-Control",
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
  );

  next();
};

/* =========================================================
   PUBLIC
========================================================= */

router.get(
  "/",
  publicCache,
  getCategories
);

router.get(
  "/:id",
  publicCache,
  getCategory
);

/* =========================================================
   ADMIN
========================================================= */

router.post(
  "/",
  authMiddleware,
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCategory
);

router.patch(
  "/:id/status",
  authMiddleware,
  toggleCategoryStatus
);

export default router;