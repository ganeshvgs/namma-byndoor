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

router.get("/", authMiddleware, getCategories);
router.get("/:id", authMiddleware, getCategory);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.patch("/:id/status", authMiddleware, toggleCategoryStatus);

export default router;