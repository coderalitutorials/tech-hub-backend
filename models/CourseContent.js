import mongoose from "mongoose";

const daySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: true }
);

const weekSchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, required: true },
    weekTitle: { type: String, required: true },
    days: [daySchema],
  },
  { _id: true }
);

const courseContentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    trainerName: { type: String },
    courseTitle: { type: String },
    weeks: [weekSchema],
  },
  { timestamps: true }
);

const CourseContent = mongoose.model("CourseContent", courseContentSchema);
export default CourseContent;
