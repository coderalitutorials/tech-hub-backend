import asyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

// @desc Create a new course
// @route POST /api/courses
// @access Admin
export const createCourse = asyncHandler(async (req, res) => {
  const { title, price, rating } = req.body;

  if (!title || !price) {
    res.status(400);
    throw new Error("Title and Price are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Course image is required");
  }

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload_stream(
    { folder: "techhub_courses" },
    async (error, result) => {
      if (error) {
        res.status(500);
        throw new Error("Cloudinary upload failed");
      }

      const course = await Course.create({
        title,
        image: result.secure_url,
        price,
        rating: rating || 0,
      });

      res.status(201).json({
        message: "Course created successfully",
        course,
      });
    }
  );

  // Pipe multer buffer to cloudinary
  result.end(req.file.buffer);
});

// @desc Update course
// @route PUT /api/courses/:id
// @access Admin
// export const updateCourse = asyncHandler(async (req, res) => {
//   const course = await Course.findById(req.params.id);
//   if (!course) {
//     res.status(404);
//     throw new Error("Course not found");
//   }

//   const { title, price, rating, published } = req.body;

//   course.title = title || course.title;
//   course.price = price || course.price;
//   course.rating = rating !== undefined ? rating : course.rating;
//   course.published = published !== undefined ? published : course.published;

//   // If new image uploaded, replace via Cloudinary
//   if (req.file) {
//     const result = await cloudinary.uploader.upload_stream(
//       { folder: "techhub_courses" },
//       async (error, result) => {
//         if (error) {
//           res.status(500);
//           throw new Error("Cloudinary upload failed");
//         }
//         course.image = result.secure_url;
//         const updatedCourse = await course.save();
//         res.json({
//           message: "Course updated successfully",
//           course: updatedCourse,
//         });
//       }
//     );
//     return result.end(req.file.buffer);
//   }

//   const updatedCourse = await course.save();
//   res.json({
//     message: "Course updated successfully",
//     course: updatedCourse,
//   });
// });





export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // multer + FormData fields are always strings
  const { title, price, rating, published } = req.body;

  course.title = title || course.title;
  course.price = price || course.price;
  course.rating = rating !== undefined ? Number(rating) : course.rating;
  course.published =
    published !== undefined
      ? published === "true" || published === true
      : course.published;

  // Image upload
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "techhub_courses" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    course.image = result.secure_url;
  }

  const updatedCourse = await course.save();
  res.json({
    message: "Course updated successfully",
    course: updatedCourse,
  });
});



// @desc Delete course
// @route DELETE /api/courses/:id
// @access Admin
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json({ message: "Course deleted successfully" });
});


// @desc Get all courses (Public)
// @route GET /api/courses
// @access Public
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json(courses);
});

// @desc Get single course by ID
// @route GET /api/courses/:id
// @access Public
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.json(course);
});

