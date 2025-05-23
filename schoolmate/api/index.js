import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import StudentPaymentRoute from "./routes/StudentPayment.route.js";
import cookieParser from "cookie-parser";
import leaveRoutes from "./routes/leaveRoute.js";
import LeaveRequest from "./model/LeaveRequest.js";
import workloadRoutes from "./routes/workload.js";
import staffbanksalary from "./routes/StaffBankSalaryDetails.js";
import Maintenance from "./routes/Maintenance.js";
import Income from "./routes/Income.js";
import "./cronJob.js";
import Exam from "./routes/exam.route.js";
import studentRoute from "./routes/studentRoute.js";
import subjectRoute from "./routes/subjectRoute.js";
import homeworkRoutes from "./routes/Homework.js";

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
app.use(cors());

// API Routes
app.use("/api/leave", leaveRoutes); // Adding the leave routes
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", StudentPaymentRoute);
app.use("/api/workload", workloadRoutes);
app.use("/api/salary", staffbanksalary);
app.use("/api/maintenance", Maintenance);
app.use("/api/income", Income);
app.use("/api/student", studentRoute);
app.use("/api/subject", subjectRoute);

app.use("/api/exam", Exam);
app.use("/api/homework", homeworkRoutes);
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

app.get("/api/leaveRequests", async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
