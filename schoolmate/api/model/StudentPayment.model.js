import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  email: { type: String, required: true },
  grade: { type: String, required: true },
  bank: { type: String, required: true },
  branch: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  method: { type: String, required: true },
  date: { type: Date, default: Date.now },
  slipImage: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    default: "pending" // Set default value as "Pending"
  },
});

export default mongoose.model("Payment", PaymentSchema);
