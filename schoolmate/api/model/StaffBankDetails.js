import mongoose from "mongoose";

const StaffBankDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  bank: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  passbookImage: {
    type: String,
    required: false
  },
    salary: {
      type: Number,
    }
}, { timestamps: true });

export default mongoose.model("StaffBankDetails", StaffBankDetailsSchema);
