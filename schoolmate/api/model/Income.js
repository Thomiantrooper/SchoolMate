import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    bank: { type: String, required: true },
    branch: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, required: true },
    slipImage: { type: String, required: true }, // Store image URL
    reason: { type: String, required: true },
    month: { type: String, required: true },
    status: { type: String, enum: ["pending", "paid", "denied"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Income", incomeSchema);
