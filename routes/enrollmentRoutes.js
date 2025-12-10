import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createEnrollment,
  getEnrollments,
  deleteEnrollment,
} from "../controllers/enrollmentController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: submit enrollment with 2 images
router.post(
  "/",
  upload.fields([
    { name: "passportSizePhoto", maxCount: 1 },
    { name: "cnicPhoto", maxCount: 1 },
  ]),
  createEnrollment
);

// Admin routes
router.get("/", protectAdmin, getEnrollments);
router.delete("/:id", protectAdmin, deleteEnrollment);

export default router;
