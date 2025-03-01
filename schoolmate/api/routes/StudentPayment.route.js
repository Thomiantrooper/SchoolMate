import express from "express";
import { makePayment, getPayments } from "../controllers/StudentPayment.controller.js";

const router = express.Router();

router.post("/pay", makePayment); // Submit fee payment
router.get("/", getPayments); // Fetch all payments

export default router;
