import express from "express";
import { addStudent, getStudents, deleteStudent } from "../controllers/studentController.js";

const router = express.Router();

router.post("/add", addStudent);
router.get("/all", getStudents);
router.delete("/delete/:id", deleteStudent);

export default router;
