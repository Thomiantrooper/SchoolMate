import express from "express";
import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/add", addStudent);
router.get("/all", getStudents);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
