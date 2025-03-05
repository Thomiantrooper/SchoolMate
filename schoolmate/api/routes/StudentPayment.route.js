import express from "express";
import { makePayment, getPayments, getStudentPaymentDetails, updatePaymentStatus } from "../controllers/StudentPayment.controller.js";

const router = express.Router();

router.post("/pay", makePayment); // Submit fee payment
router.get("/", getPayments); // Fetch all payments
router.get('/:id', getStudentPaymentDetails);
router.put("/:id", updatePaymentStatus);

export default router;
