import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
  getHeroVideos,
  createHeroVideo,
  updateHeroVideo,
  deleteHeroVideo,
} from "../controllers/heroVideoController.js";

const router = express.Router();

/*
    GET Hero Videos
*/
router.get("/", getHeroVideos);

/*
    Create Hero Video
*/
router.post("/", protect, createHeroVideo);

/*
    Update Hero Video
*/
router.put("/:id", protect, updateHeroVideo);

/*
    Delete Hero Video
*/
router.delete("/:id", protect, deleteHeroVideo);

export default router;