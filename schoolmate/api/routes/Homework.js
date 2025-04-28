import express from "express";
import {
  createHomework,
  getAllHomework,
  getHomeworkById,
  updateHomework,
  deleteHomework,
  upload
} from "../controllers/Homework.js"; // (fix your path if different)

const router = express.Router();

// POST - Create homework with multiple attachments
router.post("/", upload.array("attachments", 5), createHomework);

// GET - Fetch all homework
router.get("/", getAllHomework);

// GET - Fetch single homework
router.get("/:id", getHomeworkById);

// PUT - Update homework with multiple attachments
router.put("/:id", upload.array("attachments", 5), updateHomework);

// DELETE - Delete homework
router.delete("/:id", deleteHomework);

export default router;
