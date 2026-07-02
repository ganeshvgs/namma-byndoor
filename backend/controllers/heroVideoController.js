import HeroVideo from "../models/HeroVideo.js";

/*
    GET /api/hero-videos
*/
export const getHeroVideos = async (req, res) => {
  try {
    const videos = await HeroVideo.find().sort({
      priority: 1,
    });

    res.status(200).json({
      success: true,
      videos: videos.map((video) => ({
        _id: video._id,
        title: video.title,
        desktopUrl: video.desktopVideoUrl,
        mobileUrl: video.mobileVideoUrl,
        priority: video.priority,
        status: video.isActive ? "active" : "inactive",
      })),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hero videos.",
    });
  }
};

/*
    POST /api/hero-videos
*/
export const createHeroVideo = async (req, res) => {
  try {
    const {
      title,
      desktopUrl,
      mobileUrl,
      priority,
      status,
    } = req.body;

    if (
      !title ||
      !desktopUrl ||
      !mobileUrl ||
      !priority
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const exists = await HeroVideo.findOne({
      priority,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Priority already exists.",
      });
    }

    const video = await HeroVideo.create({
      title,
      desktopVideoUrl: desktopUrl,
      mobileVideoUrl: mobileUrl,
      priority,
      isActive: status === "active",
    });

    res.status(201).json({
      success: true,
      message: "Hero video created.",
      video: {
        _id: video._id,
        title: video.title,
        desktopUrl: video.desktopVideoUrl,
        mobileUrl: video.mobileVideoUrl,
        priority: video.priority,
        status: video.isActive ? "active" : "inactive",
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create hero video.",
    });
  }
};

/*
    PUT /api/hero-videos/:id
*/
export const updateHeroVideo = async (req, res) => {
  try {
    const {
      title,
      desktopUrl,
      mobileUrl,
      priority,
      status,
    } = req.body;

    const duplicate = await HeroVideo.findOne({
      priority,
      _id: {
        $ne: req.params.id,
      },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Priority already exists.",
      });
    }

    const video = await HeroVideo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desktopVideoUrl: desktopUrl,
        mobileVideoUrl: mobileUrl,
        priority,
        isActive: status === "active",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero video updated.",
      video: {
        _id: video._id,
        title: video.title,
        desktopUrl: video.desktopVideoUrl,
        mobileUrl: video.mobileVideoUrl,
        priority: video.priority,
        status: video.isActive ? "active" : "inactive",
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update hero video.",
    });
  }
};

/*
    DELETE /api/hero-videos/:id
*/
export const deleteHeroVideo = async (req, res) => {
  try {
    const video = await HeroVideo.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero video deleted.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete hero video.",
    });
  }
};