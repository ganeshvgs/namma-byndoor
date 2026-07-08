// routes/placeRoutes.js
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

/* ===========================================
   CRUD
=========================================== */
router.get("/", getPlaces);
router.get("/:id", getPlace);
router.post("/", authMiddleware, createPlace);
router.put("/:id", authMiddleware, updatePlace);
router.delete("/:id", authMiddleware, deletePlace);

/* ===========================================
   Extra APIs
=========================================== */
router.patch("/:id/status", authMiddleware, toggleStatus);
router.patch("/:id/featured", authMiddleware, toggleFeatured);

export default router;