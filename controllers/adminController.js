import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Admin Register (Optional: First admin)
// @route   POST /api/admin/register
// @access  Public (use carefully)
export const adminRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  // Check if admin exists
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin with this email already exists");
  }

  // Create admin
  const admin = await Admin.create({ name, email, password });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
      message: "Admin registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token: generateToken(admin._id),
    message: "Login successful",
  });
});







// @desc    Get logged-in admin/user role
// @route   GET /api/admin/me
// @access  Private
export const getAdminRole = asyncHandler(async (req, res) => {
  // req.admin should be set by auth middleware using token
  const admin = await Admin.findById(req.admin.id);

  if (!admin) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ role: admin.role });
});
