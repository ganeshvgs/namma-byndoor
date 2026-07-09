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

/* Public */
router.get("/", getCategories);
router.get("/:id", getCategory);

/* Admin Only */
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.patch(
  "/:id/status",
  authMiddleware,
  toggleCategoryStatus
);

export default router;