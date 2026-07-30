import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createPlace,
  getPlaces,
  getPlace,
  updatePlace,
  deletePlace,
  toggleStatus,
  toggleFeatured,
} from "../controllers/placeController.js";

const router = express.Router();

/* =========================================================
   CACHE MIDDLEWARE
========================================================= */

const publicCache = (req, res, next) => {
  res.set(
    "Cache-Control",
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
  );

  next();
};

const noCache = (req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  next();
};

/* =========================================================
   ADMIN READ ROUTES
========================================================= */

/*
  IMPORTANT:
  Admin must never use cached place data.

  GET:
  /api/places/admin/all
*/

router.get(
  "/admin/all",
  authMiddleware,
  noCache,
  getPlaces
);

/* =========================================================
   PUBLIC ROUTES
========================================================= */

router.get(
  "/",
  publicCache,
  getPlaces
);

router.get(
  "/:id",
  publicCache,
  getPlace
);

/* =========================================================
   ADMIN CRUD
========================================================= */

router.post(
  "/",
  authMiddleware,
  noCache,
  createPlace
);

router.put(
  "/:id",
  authMiddleware,
  noCache,
  updatePlace
);

router.delete(
  "/:id",
  authMiddleware,
  noCache,
  deletePlace
);

/* =========================================================
   ADMIN ACTIONS
========================================================= */

router.patch(
  "/:id/status",
  authMiddleware,
  noCache,
  toggleStatus
);

router.patch(
  "/:id/featured",
  authMiddleware,
  noCache,
  toggleFeatured
);

export default router;