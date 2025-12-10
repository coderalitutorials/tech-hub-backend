import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourseById,
} from "../controllers/courseController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // <- multer middleware

const router = express.Router();

// Admin CRUD
router.post("/", protectAdmin, upload.single("image"), createCourse);
router.put("/:id", protectAdmin, upload.single("image"), updateCourse);
router.delete("/:id", protectAdmin, deleteCourse);

// Public fetch
router.get("/", getCourses);
router.get("/:id", getCourseById);

export default router;

