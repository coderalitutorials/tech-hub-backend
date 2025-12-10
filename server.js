import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

// Import Routes
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import courseContentRoutes from "./routes/courseContentRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "https://tech-hub-backend-9gs2.vercel.app", // replace with your Vite frontend URL
    methods:  ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // allowed HTTP methods
    credentials: true // if you want to send cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses/content", courseContentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Error middleware
import { errorHandler } from "./middlewares/errorMiddleware.js";
app.use(errorHandler);

// Important for Vercel Serverless Function
export default app;
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




