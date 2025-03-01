import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  bank: { type: String, required: true },
  branch: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  slipImage: { type: String, required: true }, // Store file path or URL
});

export default mongoose.model("Payment", PaymentSchema);
