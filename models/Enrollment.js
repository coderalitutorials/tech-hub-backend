import mongoose from "mongoose";

// All available courses in your institute
const courseOptions = [
  "Cloud Computing - Azure",
  "Cloud Computing - AWS",
  "Full Stack Development - JavaScript",
  "Full Stack Development - MEAN",
  "Full Stack Development - MERN",
  "Digital Forensic & Cyber Security",
  "Cyber Security (CEH, CHFI)",
  "Google UX Design",
  "Graphic Designer / UI UX Design",
  "Advance Python Programming & Application",
  "Advance Web Application Development",
];

const enrollmentSchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    cnic: { type: String, required: true, unique: true },
    branch: {
      type: String,
      required: true,
      enum: ["Faisalabad", "Shahdara", "Kasur", "Bahawalpur", "Quetta"],
    },
    dateOfBirth: { type: Date, required: true },
    studentPhone: { type: String, required: true },
    alternativePhone: { type: String },
    email: { type: String },
    domicile: { type: String, required: true },
    address: { type: String, required: true },

    educationLevel: {
      type: String,
      required: true,
      enum: ["FA", "FSc", "ICS", "ICom", "BA", "BSc", "BCom", "BS", "MSc", "MCom"],
    },
    otherEducation: { type: String },

    courseFirstPreference: {
      type: String,
      required: true,
      enum: courseOptions,
    },
    courseSecondPreference: {
      type: String,
      enum: courseOptions,
    },

    passportSizePhoto: { type: String, required: true }, // Cloudinary URL
    cnicPhoto: { type: String, required: true }, // Cloudinary URL
  },
  { timestamps: true } // createdAt & updatedAt automatically
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
