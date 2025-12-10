import express from "express";
import { adminLogin, adminRegister, getAdminRole } from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register route (optional, only first admin)
router.post("/register", adminRegister);

// Login route
router.post("/login", adminLogin);

// Example protected route to get admin info
router.get("/me", protectAdmin, getAdminRole);

export default router;
