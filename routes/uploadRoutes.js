import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin protected route
router.post("/image", protectAdmin, upload.single("image"), uploadImage);

export default router;
