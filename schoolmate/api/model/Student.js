import mongoose from "mongoose";

const MarkSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  grade: { type: Number, required: true },
  firstTerm: { type: Number, min: 0, max: 100 },
  secondTerm: { type: Number, min: 0, max: 100 },
  thirdTerm: { type: Number, min: 0, max: 100 },
});

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

  marks: [MarkSchema], // Embed marks here
});

export default mongoose.model("Student", StudentSchema);
