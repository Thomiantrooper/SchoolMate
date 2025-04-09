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

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

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
