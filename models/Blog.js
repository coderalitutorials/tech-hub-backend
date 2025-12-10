import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Cloudinary URL
    slug: { type: String, unique: true }, // SEO slug
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);

