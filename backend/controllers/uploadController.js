import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  console.log("FILE:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "namma-byndoor",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("========== CLOUDINARY ERROR ==========");
            console.error(error);
            console.error("======================================");
            return reject(error);
          }

          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    console.log("UPLOAD SUCCESS:", result);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("========== UPLOAD ERROR ==========");
    console.error(err);
    console.error("==================================");

    return res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};