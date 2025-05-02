import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 6,
      max: 13,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", SubjectSchema);
export default Subject;
