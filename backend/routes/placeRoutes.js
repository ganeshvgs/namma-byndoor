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
   PUBLIC CACHE
========================================================= */

/*
  Browser:
      cache for 60 seconds

  CDN / Vercel:
      cache for 5 minutes

  stale-while-revalidate:
      stale response may be served while a fresh copy is
      generated in the background.

  This only applies to PUBLIC GET endpoints.
*/

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
  createPlace
);

router.put(
  "/:id",
  authMiddleware,
  updatePlace
);

router.delete(
  "/:id",
  authMiddleware,
  deletePlace
);

/* =========================================================
   ADMIN ACTIONS
========================================================= */

router.patch(
  "/:id/status",
  authMiddleware,
  toggleStatus
);

router.patch(
  "/:id/featured",
  authMiddleware,
  toggleFeatured
);

export default router;