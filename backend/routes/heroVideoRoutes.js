import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
  getHeroVideos,
  createHeroVideo,
  updateHeroVideo,
  deleteHeroVideo,
} from "../controllers/heroVideoController.js";

const router = express.Router();
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
/*
    GET Hero Videos
*/
router.get("/", publicCache, getHeroVideos);

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