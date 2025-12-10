import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
    },
    image: {
      type: String,
      required: [true, "Course image is required"],
    },
    price: {
      type: String, // Free or amount
      required: [true, "Price is required"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
