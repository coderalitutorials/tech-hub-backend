// import asyncHandler from "express-async-handler";
// import CourseContent from "../models/CourseContent.js";
// import Course from "../models/Course.js";

// // Helper: fetch or create CourseContent doc for a course
// const getOrCreateContentDoc = async (courseId) => {
//   let doc = await CourseContent.findOne({ courseId });
//   if (!doc) {
//     const course = await Course.findById(courseId);
//     if (!course) return null;
//     doc = await CourseContent.create({
//       courseId,
//       trainerName: course.trainer || "",
//       courseTitle: course.title || "",
//       weeks: [],
//     });
//   }
//   return doc;
// };

// // @desc  Get course syllabus (public)
// // @route GET /api/courses/:courseId/content
// // @access Public
// export const getCourseContent = asyncHandler(async (req, res) => {
//   const { courseId } = req.params;
//   const doc = await CourseContent.findOne({ courseId }).lean();
//   if (!doc) return res.status(404).json({ message: "Syllabus not found" });
//   res.json(doc);
// });

// // ---------------- Admin CRUD ----------------

// // @desc  Create a new week for a course
// // @route POST /api/admin/courses/:courseId/content/week
// // @access Admin
// export const createWeek = asyncHandler(async (req, res) => {
//   const { courseId } = req.params;
//   const { weekNumber, weekTitle } = req.body;

//   if (!weekTitle) {
//     res.status(400);
//     throw new Error("weekTitle is required");
//   }

//   const doc = await getOrCreateContentDoc(courseId);
//   if (!doc) {
//     res.status(404);
//     throw new Error("Course not found");
//   }

//   // Determine default weekNumber if not provided
//   const nextWeekNumber =
//     weekNumber !== undefined ? Number(weekNumber) : doc.weeks.length + 1;

//   const newWeek = {
//     weekNumber: nextWeekNumber,
//     weekTitle,
//     days: [],
//   };

//   doc.weeks.push(newWeek);
//   await doc.save();

//   res.status(201).json({ message: "Week added", week: doc.weeks[doc.weeks.length - 1] });
// });

// // @desc  Update a week
// // @route PUT /api/admin/courses/:courseId/content/week/:weekId
// // @access Admin
// export const updateWeek = asyncHandler(async (req, res) => {
//   const { courseId, weekId } = req.params;
//   const { weekNumber, weekTitle } = req.body;

//   const doc = await CourseContent.findOne({ courseId });
//   if (!doc) {
//     res.status(404);
//     throw new Error("Course content not found");
//   }

//   const week = doc.weeks.id(weekId);
//   if (!week) {
//     res.status(404);
//     throw new Error("Week not found");
//   }

//   if (weekTitle !== undefined) week.weekTitle = weekTitle;
//   if (weekNumber !== undefined) week.weekNumber = Number(weekNumber);

//   await doc.save();
//   res.json({ message: "Week updated", week });
// });

// // @desc  Delete a week
// // @route DELETE /api/admin/courses/:courseId/content/week/:weekId
// // @access Admin
// export const deleteWeek = asyncHandler(async (req, res) => {
//   const { courseId, weekId } = req.params;
//   const doc = await CourseContent.findOne({ courseId });
//   if (!doc) {
//     res.status(404);
//     throw new Error("Course content not found");
//   }

//   const week = doc.weeks.id(weekId);
//   if (!week) {
//     res.status(404);
//     throw new Error("Week not found");
//   }

//   week.remove();
//   await doc.save();
//   res.json({ message: "Week deleted" });
// });

// // ---------------- Day operations ----------------

// // @desc  Add a day to a week
// // @route POST /api/admin/courses/:courseId/content/week/:weekId/day
// // @access Admin
// export const addDayToWeek = asyncHandler(async (req, res) => {
//   const { courseId, weekId } = req.params;
//   const { dayNumber, title, description } = req.body;

//   if (!title) {
//     res.status(400);
//     throw new Error("day title is required");
//   }

//   const doc = await CourseContent.findOne({ courseId });
//   if (!doc) {
//     res.status(404);
//     throw new Error("Course content not found");
//   }

//   const week = doc.weeks.id(weekId);
//   if (!week) {
//     res.status(404);
//     throw new Error("Week not found");
//   }

//   // default dayNumber to next index if not provided
//   const nextDayNumber = dayNumber !== undefined ? Number(dayNumber) : (week.days.length + 1);

//   const newDay = {
//     dayNumber: nextDayNumber,
//     title,
//     description: description || "",
//   };

//   week.days.push(newDay);
//   await doc.save();

//   res.status(201).json({ message: "Day added", day: week.days[week.days.length - 1] });
// });

// // @desc  Update a day
// // @route PUT /api/admin/courses/:courseId/content/week/:weekId/day/:dayId
// // @access Admin
// export const updateDay = asyncHandler(async (req, res) => {
//   const { courseId, weekId, dayId } = req.params;
//   const { dayNumber, title, description } = req.body;

//   const doc = await CourseContent.findOne({ courseId });
//   if (!doc) {
//     res.status(404);
//     throw new Error("Course content not found");
//   }

//   const week = doc.weeks.id(weekId);
//   if (!week) {
//     res.status(404);
//     throw new Error("Week not found");
//   }

//   const day = week.days.id(dayId);
//   if (!day) {
//     res.status(404);
//     throw new Error("Day not found");
//   }

//   if (dayNumber !== undefined) day.dayNumber = Number(dayNumber);
//   if (title !== undefined) day.title = title;
//   if (description !== undefined) day.description = description;

//   await doc.save();
//   res.json({ message: "Day updated", day });
// });

// // @desc  Delete a day
// // @route DELETE /api/admin/courses/:courseId/content/week/:weekId/day/:dayId
// // @access Admin
// export const deleteDay = asyncHandler(async (req, res) => {
//   const { courseId, weekId, dayId } = req.params;

//   const doc = await CourseContent.findOne({ courseId });
//   if (!doc) {
//     res.status(404);
//     throw new Error("Course content not found");
//   }

//   const week = doc.weeks.id(weekId);
//   if (!week) {
//     res.status(404);
//     throw new Error("Week not found");
//   }

//   const day = week.days.id(dayId);
//   if (!day) {
//     res.status(404);
//     throw new Error("Day not found");
//   }

//   day.remove();
//   await doc.save();
//   res.json({ message: "Day deleted" });
// });


import asyncHandler from "express-async-handler";
import CourseContent from "../models/CourseContent.js";
import Course from "../models/Course.js";

// Helper: fetch or create CourseContent doc for a course
const getOrCreateContentDoc = async (courseId) => {
  let doc = await CourseContent.findOne({ courseId });
  if (!doc) {
    const course = await Course.findById(courseId);
    if (!course) return null;
    doc = await CourseContent.create({
      courseId,
      trainerName: course.trainer || "",
      courseTitle: course.title || "",
      weeks: [],
    });
  }
  return doc;
};

// ---------------- Public ----------------

// @desc  Get course syllabus
// @route GET /api/courses/content/:courseId
// @access Public
export const getCourseContent = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const doc = await CourseContent.findOne({ courseId }).lean();
  if (!doc) return res.status(404).json({ message: "Syllabus not found" });
  res.json(doc);
});

// ---------------- Admin CRUD ----------------

// @desc  Create a new week for a course
// @route POST /api/courses/content/:courseId/week
// @access Admin
export const createWeek = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { weekNumber, weekTitle } = req.body;

  if (!weekTitle) {
    res.status(400);
    throw new Error("weekTitle is required");
  }

  const doc = await getOrCreateContentDoc(courseId);
  if (!doc) {
    res.status(404);
    throw new Error("Course not found");
  }

  const nextWeekNumber = weekNumber !== undefined ? Number(weekNumber) : doc.weeks.length + 1;

  const newWeek = {
    weekNumber: nextWeekNumber,
    weekTitle,
    days: [],
  };

  doc.weeks.push(newWeek);
  await doc.save();

  res.status(201).json({ message: "Week added", week: doc.weeks[doc.weeks.length - 1] });
});

// @desc  Update a week
// @route PUT /api/courses/content/:courseId/week/:weekId
// @access Admin
export const updateWeek = asyncHandler(async (req, res) => {
  const { courseId, weekId } = req.params;
  const { weekNumber, weekTitle } = req.body;

  const doc = await CourseContent.findOne({ courseId });
  if (!doc) {
    res.status(404);
    throw new Error("Course content not found");
  }

  const week = doc.weeks.id(weekId);
  if (!week) {
    res.status(404);
    throw new Error("Week not found");
  }

  if (weekTitle !== undefined) week.weekTitle = weekTitle;
  if (weekNumber !== undefined) week.weekNumber = Number(weekNumber);

  await doc.save();
  res.json({ message: "Week updated", week });
});

// @desc  Delete a week
// @route DELETE /api/courses/content/:courseId/week/:weekId
// @access Admin
export const deleteWeek = asyncHandler(async (req, res) => {
  const { courseId, weekId } = req.params;

  const doc = await CourseContent.findOne({ courseId });
  if (!doc) {
    res.status(404);
    throw new Error("Course content not found");
  }

  const weekIndex = doc.weeks.findIndex((w) => w._id.toString() === weekId);
  if (weekIndex === -1) {
    res.status(404);
    throw new Error("Week not found");
  }

  doc.weeks.splice(weekIndex, 1);
  await doc.save();

  res.json({ message: "Week deleted" });
});

// ---------------- Day operations ----------------

// @desc  Add a day to a week
// @route POST /api/courses/content/:courseId/week/:weekId/day
// @access Admin
export const addDayToWeek = asyncHandler(async (req, res) => {
  const { courseId, weekId } = req.params;
  const { dayNumber, title, description } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("day title is required");
  }

  const doc = await CourseContent.findOne({ courseId });
  if (!doc) {
    res.status(404);
    throw new Error("Course content not found");
  }

  const week = doc.weeks.id(weekId);
  if (!week) {
    res.status(404);
    throw new Error("Week not found");
  }

  const nextDayNumber = dayNumber !== undefined ? Number(dayNumber) : week.days.length + 1;

  const newDay = {
    dayNumber: nextDayNumber,
    title,
    description: description || "",
  };

  week.days.push(newDay);
  await doc.save();

  res.status(201).json({ message: "Day added", day: week.days[week.days.length - 1] });
});

// @desc  Update a day
// @route PUT /api/courses/content/:courseId/week/:weekId/day/:dayId
// @access Admin
export const updateDay = asyncHandler(async (req, res) => {
  const { courseId, weekId, dayId } = req.params;
  const { dayNumber, title, description } = req.body;

  const doc = await CourseContent.findOne({ courseId });
  if (!doc) {
    res.status(404);
    throw new Error("Course content not found");
  }

  const week = doc.weeks.id(weekId);
  if (!week) {
    res.status(404);
    throw new Error("Week not found");
  }

  const day = week.days.id(dayId);
  if (!day) {
    res.status(404);
    throw new Error("Day not found");
  }

  if (dayNumber !== undefined) day.dayNumber = Number(dayNumber);
  if (title !== undefined) day.title = title;
  if (description !== undefined) day.description = description;

  await doc.save();
  res.json({ message: "Day updated", day });
});

// @desc  Delete a day
// @route DELETE /api/courses/content/:courseId/week/:weekId/day/:dayId
// @access Admin
export const deleteDay = asyncHandler(async (req, res) => {
  const { courseId, weekId, dayId } = req.params;

  const doc = await CourseContent.findOne({ courseId });
  if (!doc) {
    res.status(404).json({ message: "Course content not found" });
    return;
  }

  const week = doc.weeks.find((w) => w._id.toString() === weekId);
  if (!week) {
    res.status(404).json({ message: "Week not found" });
    return;
  }

  const dayIndex = week.days.findIndex((d) => d._id.toString() === dayId);
  if (dayIndex === -1) {
    res.status(404).json({ message: "Day not found" });
    return;
  }

  week.days.splice(dayIndex, 1);
  await doc.save();

  res.json({ message: "Day deleted" });
});



// @desc  Update course info (trainerName & courseTitle)
// @route PATCH /api/courses/content/:courseId
// @access Admin
export const updateCourseContent = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { trainerName, courseTitle } = req.body;

  const doc = await CourseContent.findOne({ courseId });
  if (!doc) {
    res.status(404);
    throw new Error("Course content not found");
  }

  if (trainerName !== undefined) doc.trainerName = trainerName;
  if (courseTitle !== undefined) doc.courseTitle = courseTitle;

  await doc.save();

  res.json({ message: "Course info updated", courseContent: doc });
});
