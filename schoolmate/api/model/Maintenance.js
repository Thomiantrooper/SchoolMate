import mongoose from "mongoose";

const maintenancePaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, required: true },
  date: { type: Date, required: true },
  month: { type: String, required: true },
  paidStatus: { type: Boolean, default: false },
  paymentSlipImage: { type: String, required: true }, // URL or path to image
});

export default mongoose.model("MaintenancePayment", maintenancePaymentSchema);