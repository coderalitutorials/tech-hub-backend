import asyncHandler from "express-async-handler";
import Enrollment from "../models/Enrollment.js";
import cloudinary from "../config/cloudinary.js";

// =========================
// Create Enrollment (Public)
// =========================
export const createEnrollment = asyncHandler(async (req, res) => {
  const {
    candidateName,
    fatherName,
    cnic,
    branch,
    dateOfBirth,
    studentPhone,
    alternativePhone,
    email,
    domicile,
    address,
    educationLevel,
    otherEducation,
    courseFirstPreference,
    courseSecondPreference,
  } = req.body;

  if (!req.files || !req.files.passportSizePhoto || !req.files.cnicPhoto) {
    res.status(400);
    throw new Error("Passport photo and CNIC photo are required");
  }

  // Check if CNIC already exists
  const existing = await Enrollment.findOne({ cnic });
  if (existing) {
    res.status(400);
    throw new Error("Enrollment with this CNIC already exists");
  }

  // Upload passport photo
  const uploadPassport = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "enrollments" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.files.passportSizePhoto[0].buffer);
  });

  // Upload CNIC photo
  const uploadCNIC = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "enrollments" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.files.cnicPhoto[0].buffer);
  });

  const enrollment = await Enrollment.create({
    candidateName,
    fatherName,
    cnic,
    branch,
    dateOfBirth,
    studentPhone,
    alternativePhone,
    email,
    domicile,
    address,
    educationLevel,
    otherEducation,
    courseFirstPreference,
    courseSecondPreference,
    passportSizePhoto: uploadPassport.secure_url,
    cnicPhoto: uploadCNIC.secure_url,
  });

  res.status(201).json({ success: true, enrollment });
});

// =========================
// Get All Enrollments (Admin)
// =========================
export const getEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find().sort({ createdAt: -1 });
  res.json({ success: true, enrollments });
});

// =========================
// Delete Enrollment (Admin)
// =========================
export const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment not found");
  }
  await enrollment.deleteOne();
  res.json({ success: true, message: "Enrollment deleted" });
});
