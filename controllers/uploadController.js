import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Admin
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: "techhub" },
      (error, result) => {
        if (error) {
          throw new Error(error.message);
        } else {
          res.status(201).json({
            url: result.secure_url,
            message: "Image uploaded successfully",
          });
        }
      }
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500);
    throw new Error("Cloudinary upload failed: " + error.message);
  }
});
