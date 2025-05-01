import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  personalEmail: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  grade: { type: Number, required: true },
  section: { type: String, required: true },
  studentEmail: { type: String, required: true, unique: true },
  StudentPassword: { type: String, required: true },
});

export default mongoose.model("Student", StudentSchema);
