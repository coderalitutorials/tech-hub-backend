import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

// Helper: generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// =========================
// Create Blog
// =========================
export const createBlog = asyncHandler(async (req, res) => {
  const { title, subtitle, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Image is required");
  }

  // Upload to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "blogs" },
    async (error, result) => {
      if (error) {
        res.status(500);
        throw new Error("Cloudinary upload failed");
      }

      // Generate slug
      let slug = slugify(title);
      const existing = await Blog.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now()}`;

      const blog = await Blog.create({
        title,
        subtitle,
        content,
        imageUrl: result.secure_url,
        slug,
        createdBy: req.admin._id,
      });

      res.status(201).json({ success: true, message: "Blog created", blog });
    }
  );

  // Pipe buffer to Cloudinary
  uploadStream.end(req.file.buffer);
});

// =========================
// Update Blog
// =========================
export const updateBlog = asyncHandler(async (req, res) => {
  const { title, subtitle, content } = req.body;

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Upload new image if provided
  if (req.file) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blogs" },
      async (error, result) => {
        if (error) {
          res.status(500);
          throw new Error("Cloudinary upload failed");
        }

        // Update slug if title changed
        let finalSlug = blog.slug;
        if (title && title !== blog.title) {
          let newSlug = slugify(title);
          const existing = await Blog.findOne({ slug: newSlug });
          if (existing && existing._id.toString() !== req.params.id) {
            finalSlug = `${newSlug}-${Date.now()}`;
          } else {
            finalSlug = newSlug;
          }
        }

        blog.title = title || blog.title;
        blog.subtitle = subtitle || blog.subtitle;
        blog.content = content || blog.content;
        blog.slug = finalSlug;
        blog.imageUrl = result.secure_url;

        const updatedBlog = await blog.save();
        res.json({ success: true, message: "Blog updated", updatedBlog });
      }
    );

    return uploadStream.end(req.file.buffer);
  }

  // If no new image, just update text fields
  if (title && title !== blog.title) {
    let newSlug = slugify(title);
    const existing = await Blog.findOne({ slug: newSlug });
    blog.slug =
      existing && existing._id.toString() !== req.params.id
        ? `${newSlug}-${Date.now()}`
        : newSlug;
  }

  blog.title = title || blog.title;
  blog.subtitle = subtitle || blog.subtitle;
  blog.content = content || blog.content;

  const updatedBlog = await blog.save();
  res.json({ success: true, message: "Blog updated", updatedBlog });
});

// =========================
// Delete Blog
// =========================
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  await blog.deleteOne();
  res.json({ success: true, message: "Blog deleted" });
});

// =========================
// Get Blogs (Public)
// =========================
export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).populate("createdBy", "name");
  res.json({ success: true, blogs });
});

// =========================
// Get Blog by ID
// =========================
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.json({ success: true, blog });
});

// =========================
// Get Blog by Slug
// =========================
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.json({ success: true, blog });
});


