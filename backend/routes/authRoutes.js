import express from "express";
import { loginAdmin, getProfile } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
    POST  /api/auth/login
*/
router.post("/login", loginAdmin);

/*
    GET   /api/auth/me
    Protected Route
*/
router.get("/me", protect, getProfile);

export default router;