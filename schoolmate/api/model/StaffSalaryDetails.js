import mongoose from "mongoose";

const StaffSalaryDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  EPF: {
    employee: {
      type: Number,
      required: true
    },
    employer: {
      type: Number,
      required: true
    }
  },
  ETF: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  },
  leaveSalary: {
    type: Number,
    default: 0
  },
  total: { 
    type: Number,
    default: 0
  }, 
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("StaffSalaryDetails", StaffSalaryDetailsSchema);
