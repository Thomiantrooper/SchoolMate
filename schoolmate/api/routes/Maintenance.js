import express from "express";
import {
  createMaintenancePayment,
  getMaintenancePayments,
  updateMaintenancePayment,
  deleteMaintenancePayment,
} from "../controllers/Maintenance.js"

const router = express.Router();

// Create a new maintenance payment
router.post('/maintenance-payment', createMaintenancePayment);

// Get all payments for a specific month
router.get('/maintenance-payments/:month', getMaintenancePayments);

// Update payment status and details
router.put('/maintenance-payment/:paymentId', updateMaintenancePayment);

// Delete a payment record
router.delete('/maintenance-payment/:paymentId', deleteMaintenancePayment);

export default router;
