import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

// Load environment variables from .env file
dotenv.config();



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch((err) => {
    console.error("Mongo DB connection error:", err);
  });

const app = express();

// Middleware to parse incoming JSON
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
