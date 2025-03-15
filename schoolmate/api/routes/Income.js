import express from "express";
import {createIncome, getAllIncome, getIncomeById, updateIncome, deleteIncome} from "../controllers/Income.js";

const router = express.Router();

router.post("/", createIncome);
router.get("/", getAllIncome);
router.get("/:id", getIncomeById);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

export default router;
