import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // multer middleware

const router = express.Router();

// ------------------------
// Public Routes
// ------------------------
router.get("/slug/:slug", getBlogBySlug); // specific route first
router.get("/:id", getBlogById);
router.get("/", getBlogs);

// ------------------------
// Admin Protected Routes
// ------------------------
// ✅ upload.single first, then protectAdmin
router.post("/create", upload.single("image"), protectAdmin, createBlog);
router.put("/:id", upload.single("image"), protectAdmin, updateBlog);
router.delete("/:id", protectAdmin, deleteBlog);

export default router;




