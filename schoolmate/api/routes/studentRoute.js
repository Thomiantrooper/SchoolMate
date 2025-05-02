import express from "express";
import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getStudentsByGrade,
  updateStudentMarks,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/add", addStudent);
router.get("/all", getStudents);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

router.get("/grade/:grade", getStudentsByGrade);
router.post("/:id/marks", updateStudentMarks);

export default router;
