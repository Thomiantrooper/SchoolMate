import express from "express";
import {
  addSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/add", addSubject);
router.get("/all", getSubjects);
router.put("/update/:id", updateSubject);
router.delete("/delete/:id", deleteSubject);

export default router;
