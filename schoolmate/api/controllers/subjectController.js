import Subject from "../model/Subject.js";

// Function to generate the next subject code
const generateSubjectCode = async () => {
  const lastSubject = await Subject.findOne()
    .sort({ subjectCode: -1 })
    .limit(1);
  let nextNumber = 1;

  if (lastSubject && lastSubject.subjectCode) {
    const lastCode = lastSubject.subjectCode;
    if (lastCode.startsWith("SM")) {
      const lastNumber = parseInt(lastCode.substring(2), 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
  }

  return `SM${nextNumber.toString().padStart(3, "0")}`;
};

// Add Subject
export const addSubject = async (req, res) => {
  try {
    const { subjectName, grade } = req.body;

    // Validate input
    if (!subjectName || !grade) {
      return res
        .status(400)
        .json({ error: "Subject name and grade are required" });
    }

    const gradeNumber = parseInt(grade);
    if (isNaN(gradeNumber) || gradeNumber < 6 || gradeNumber > 13) {
      return res.status(400).json({ error: "Grade must be between 6 and 13" });
    }

    // Generate the subject code
    const subjectCode = await generateSubjectCode();

    // Create new subject
    const newSubject = new Subject({
      subjectCode,
      subjectName,
      grade: gradeNumber,
    });

    const savedSubject = await newSubject.save();

    res.status(201).json({
      message: "Subject created successfully",
      subject: savedSubject,
    });
  } catch (error) {
    console.error("Add Subject Error:", error);

    if (error.code === 11000 && error.keyPattern?.subjectCode) {
      return res.status(409).json({ error: "Subject code already exists" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all Subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ grade: 1, subjectName: 1 });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// In your subject controller
export const getSubjectsByGrade = async (req, res) => {
  try {
    const subjects = await Subject.find({ grade: req.params.grade });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Subject
export const updateSubject = async (req, res) => {
  try {
    const { subjectName, grade } = req.body;

    // Validate input
    if (!subjectName || !grade) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const gradeNumber = parseInt(grade);
    if (isNaN(gradeNumber) || gradeNumber < 6 || gradeNumber > 13) {
      return res.status(400).json({ error: "Grade must be between 6 and 13" });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName, grade: gradeNumber },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error("Update Subject Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Subject
export const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

    if (!deletedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
