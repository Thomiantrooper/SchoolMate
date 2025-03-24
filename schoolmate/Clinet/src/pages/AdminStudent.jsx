import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { ThemeContext } from "../components/ThemeLayout";
import axios from "axios";

export default function AdminStudent() {
  const { darkMode } = useContext(ThemeContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    personalEmail: "",
    age: "",
    gender: "",
    grade: "",
    section: "",
  });
  const [validationError, setValidationError] = useState("");
  const [nextStudentNumber, setNextStudentNumber] = useState(0); // Track the next student number

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students and determine the next student number
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/student/all");
      setStudents(response.data);

      // Find the highest student number
      const highestStudentNumber = response.data.reduce((max, student) => {
        const studentNumber = parseInt(student.studentEmail.match(/\d+/)[0], 10);
        return studentNumber > max ? studentNumber : max;
      }, -1);

      // Set the next student number
      setNextStudentNumber(highestStudentNumber + 1);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetStudentForm();
    setValidationError("");
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setNewStudent(student);
    setIsEditModalOpen(true);
    setValidationError("");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    resetStudentForm();
    setValidationError("");
  };

  const resetStudentForm = () => {
    setNewStudent({
      name: "",
      personalEmail: "",
      age: "",
      gender: "",
      grade: "",
      section: "",
    });
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate form fields
  const validateForm = () => {
    if (
      !newStudent.name ||
      !newStudent.personalEmail ||
      !newStudent.age ||
      !newStudent.gender ||
      !newStudent.grade ||
      !newStudent.section
    ) {
      setValidationError("Please fill in all fields before submitting.");
      return false;
    }

    if (!validateEmail(newStudent.personalEmail)) {
      setValidationError("Please enter a valid personal email address.");
      return false;
    }

    setValidationError("");
    return true;
  };

  // Add a new student
  const handleAddStudent = async () => {
    if (!validateForm()) return;

    try {
      // Generate the next student email
      const studentEmail = `std_${String(nextStudentNumber).padStart(2, "0")}@gmail.com`;

      // Add the generated student email to the newStudent object
      const studentWithEmail = { ...newStudent, studentEmail, StudentPassword: "defaultPassword" }; // Add a default password

      // Send the request to add the student
      const response = await axios.post("http://localhost:3000/api/student/add", studentWithEmail);

      // Update the students list
      setStudents([...students, response.data]);

      // Increment the next student number
      setNextStudentNumber(nextStudentNumber + 1);

      // Close the modal and reset the form
      closeAddModal();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Edit an existing student
  const handleEditStudent = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/api/student/update/${selectedStudent._id}`,
        newStudent
      );
      setStudents(students.map((student) =>
        student._id === selectedStudent._id ? response.data : student
      ));
      closeEditModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Delete a student
  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/student/delete/${id}`);
        setStudents(students.filter((student) => student._id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  return (
    <div
      className={`p-6 flex flex-col items-center w-full min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
    >
      {/* Header */}
      <div
        className="w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 bg-opacity-80 transition-all duration-300"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
      >
        <h1 className="text-2xl font-bold">🎓 Admin Student Panel</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => (window.location.href = "/dashboard?tab=students")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded shadow-md"
        >
          Back to Students
        </motion.button>
      </div>

      {/* Add Student Button */}
      <div className="mt-8 flex justify-center">
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button onClick={openAddModal} gradientDuoTone="greenToBlue">
            Add Student
          </Button>
        </motion.div>
      </div>

      {/* Students Table */}
      <div
        className="w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
      >
        <h2 className="text-lg font-semibold mb-3">📚 Students List</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Personal Email</th>
              <th className="p-2">Age</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Grade</th>
              <th className="p-2">Section</th>
              <th className="p-2">Student Email</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.personalEmail}</td>
                <td className="p-2">{student.age}</td>
                <td className="p-2">{student.gender}</td>
                <td className="p-2">{student.grade}</td>
                <td className="p-2">{student.section}</td>
                <td className="p-2">{student.studentEmail}</td>
                <td className="p-2">
                  <div className="flex">
                    <Button onClick={() => openEditModal(student)}>Edit</Button>
                    <Button color="red" onClick={() => handleDeleteStudent(student._id)}>
                      Delete
                    </Button>
                    <Button color="green">View Profile</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        show={isAddModalOpen || isEditModalOpen}
        size="lg"
        onClose={isAddModalOpen ? closeAddModal : closeEditModal}
      >
        <Modal.Header>{isEditModalOpen ? "Edit Student" : "Add New Student"}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {/* Validation Error Message */}
            {validationError && <div className="text-red-500 text-sm mb-4">{validationError}</div>}

            <Label>Name</Label>
            <TextInput
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full"
              required
            />

            <Label>Personal Email</Label>
            <TextInput
              type="email"
              value={newStudent.personalEmail}
              onChange={(e) => setNewStudent({ ...newStudent, personalEmail: e.target.value })}
              className="w-full"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <TextInput
                  type="number"
                  value={newStudent.age}
                  onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                  min="1"
                  max="25"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  value={newStudent.gender}
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Grade</Label>
                <TextInput
                  type="number"
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  min="1"
                  max="13"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label>Section</Label>
                <select
                  value={newStudent.section}
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-transparent"
                  required
                >
                  <option value="">Select Section</option>
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={String.fromCharCode(65 + i)}>
                      {String.fromCharCode(65 + i)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={isEditModalOpen ? handleEditStudent : handleAddStudent}>
            {isEditModalOpen ? "Update" : "Add"} Student
          </Button>
          <Button color="gray" onClick={isAddModalOpen ? closeAddModal : closeEditModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}