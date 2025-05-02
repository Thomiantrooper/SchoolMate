import Student from "../model/Student.js";
import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";

// Add student
export const addStudent = async (req, res) => {
  try {
    const { name, personalEmail, age, gender, grade, section } = req.body;

    // Get all students and extract the max number used
    const allStudents = await Student.find({}).populate("userId", "email");
    const maxNumber = allStudents.reduce((max, student) => {
      const match = student.userId?.email?.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        return num > max ? num : max;
      }
      return max;
    }, -1);

    let attemptCount = 0;
    let nextStudentNumber = maxNumber + 1;
    let studentEmail = "";
    let studentPassword = "";
    let savedUser = null;

    // Try generating a unique student email (up to 2 attempts)
    while (attemptCount < 2) {
      studentEmail = `std_${String(nextStudentNumber).padStart(
        2,
        "0"
      )}@gmail.com`;
      const existingUser = await User.findOne({ email: studentEmail });

      if (!existingUser) {
        studentPassword = studentEmail.split("@")[0];
        const hashedPassword = bcryptjs.hashSync(studentPassword, 10);

        // Try saving the user
        const newUser = new User({
          username: name,
          email: studentEmail,
          password: hashedPassword,
        });

        try {
          savedUser = await newUser.save();
          break; // success, move on
        } catch (err) {
          console.error("User Save Error:", err.message);
          return res.status(500).json({ error: "Failed to save user." });
        }
      }

      // Try with the next number
      nextStudentNumber++;
      attemptCount++;
    }

    if (!savedUser) {
      return res.status(409).json({
        error:
          "Could not generate a unique student email after multiple attempts.",
      });
    }

    // Now create the student record
    try {
      const newStudent = new Student({
        userId: savedUser._id,
        name,
        personalEmail,
        age,
        gender,
        grade,
        section,
        studentEmail,
        StudentPassword: studentPassword,
      });

      const savedStudent = await newStudent.save();

      res.status(201).json({
        generatedEmail: studentEmail,
        generatedPassword: studentPassword,
      });
    } catch (studentError) {
      // Rollback: delete user if student creation fails
      await User.findByIdAndDelete(savedUser._id);
      console.error("Student Save Error:", studentError.message);
      res
        .status(500)
        .json({ error: "Student creation failed, user rolled back." });
    }
  } catch (error) {
    console.error("Add Student Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all Students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("userId", "name email");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by user ID
export const getStudentByUserId = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Students ByGrade
export const getStudentsByGrade = async (req, res) => {
  try {
    const query = { grade: req.params.grade };
    const projection = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    const students = await Student.find(query, projection);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student marks
export const updateStudentMarks = async (req, res) => {
  try {
    const { subject, grade, marks } = req.body;
    const studentId = req.params.id;

    // Validate input
    if (!subject || !grade) {
      return res.status(400).json({ error: "Subject and grade are required" });
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Validate marks
    const validateMark = (mark) => {
      if (mark === null || mark === undefined || mark === "") return null;
      const num = Number(mark);
      return num >= 0 && num <= 100 ? num : null;
    };

    const validatedMarks = {
      firstTerm: validateMark(marks.firstTerm),
      secondTerm: validateMark(marks.secondTerm),
      thirdTerm: validateMark(marks.thirdTerm),
    };

    // Check if marks for this subject already exist
    const existingMarkIndex = student.marks.findIndex(
      (m) => m.subject === subject
    );

    if (existingMarkIndex >= 0) {
      // Update existing marks
      student.marks[existingMarkIndex] = {
        subject,
        grade: Number(grade),
        ...validatedMarks,
      };
    } else {
      // Add new marks
      student.marks.push({
        subject,
        grade: Number(grade),
        ...validatedMarks,
      });
    }

    // Save the updated student
    const updatedStudent = await student.save();

    res.status(200).json({
      message: "Marks updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({
      error: "Failed to update marks",
      details: error.message,
    });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const { name, age, gender, grade, section } = req.body; // Only allow these fields

    // Find the student first
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update the User document (only username, not email)
    if (name) {
      await User.findByIdAndUpdate(student.userId, { username: name });
    }

    // Update the Student document (excluding personalEmail)
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, grade, section }, // Explicitly list updatable fields
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Student and corresponding User
export const deleteStudent = async (req, res) => {
  try {
    // Find the student first
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete the student
    await Student.findByIdAndDelete(req.params.id);

    // Delete the associated user
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }

    res.status(200).json({ message: "Student and user deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
