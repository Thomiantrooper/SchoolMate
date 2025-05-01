import Homework from "../model/Homework.js";
import multer from "multer";
import path from "path";

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save to uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// File Filter - Allow only PDFs and Images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, JPG, and PNG files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });

// Create Homework
export const createHomework = async (req, res) => {
  try {
    const { teacher, subject, class: className, description, dueDate, postDate } = req.body;

    const attachments = req.files ? req.files.map(file => file.filename) : [];

    const homework = new Homework({
      teacher,
      subject,
      class: className,
      description,
      dueDate,
      postDate,
      attachments,
    });

    const savedHomework = await homework.save();
    res.status(201).json(savedHomework);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Homework
export const getAllHomework = async (req, res) => {
  try {
    const homeworkList = await Homework.find().populate("teacher");
    res.status(200).json(homeworkList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Homework
export const getHomeworkById = async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id).populate("teacher");
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }
    res.status(200).json(homework);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Homework
export const updateHomework = async (req, res) => {
  try {
    const { teacher, subject, class: className, description, dueDate, postDate } = req.body;

    const updatedData = {
      teacher,
      subject,
      class: className,
      description,
      dueDate,
      postDate,
    };

    // If new attachments uploaded, update
    if (req.files && req.files.length > 0) {
      updatedData.attachments = req.files.map(file => file.filename);
    }

    const updatedHomework = await Homework.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedHomework) {
      return res.status(404).json({ message: "Homework not found" });
    }
    res.status(200).json(updatedHomework);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Homework
export const deleteHomework = async (req, res) => {
  try {
    const deletedHomework = await Homework.findByIdAndDelete(req.params.id);
    if (!deletedHomework) {
      return res.status(404).json({ message: "Homework not found" });
    }
    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
