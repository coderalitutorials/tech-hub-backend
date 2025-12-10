import express from "express";
import {
  getCourseContent,
  createWeek,
  updateWeek,
  deleteWeek,
  addDayToWeek,
  updateDay,
  deleteDay,
  updateCourseContent,
} from "../controllers/courseContentController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: get syllabus
router.get("/:courseId", getCourseContent);

// Admin: manage content
router.post("/:courseId/week", protectAdmin, createWeek);
router.put("/:courseId/week/:weekId", protectAdmin, updateWeek);
router.delete("/:courseId/week/:weekId", protectAdmin, deleteWeek);

router.post("/:courseId/week/:weekId/day", protectAdmin, addDayToWeek);
router.put("/:courseId/week/:weekId/day/:dayId", protectAdmin, updateDay);
router.delete("/:courseId/week/:weekId/day/:dayId", protectAdmin, deleteDay);
// Admin: update course info
router.patch("/:courseId", protectAdmin, updateCourseContent);

export default router;
