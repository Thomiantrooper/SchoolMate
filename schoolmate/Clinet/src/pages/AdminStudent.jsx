import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { ThemeContext } from "../components/ThemeLayout";
import axios from "axios";
import StudentSearchFilter from "../components/StudentSearchFilter";
import { filterStudents } from "../../../api/utils/studentFilters";

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
  const [nextStudentNumber, setNextStudentNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterGender, setFilterGender] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/student/all");
      setStudents(response.data);

      // const highestStudentNumber = response.data.reduce((max, student) => {
      //   const studentNumber = parseInt(student.userId.email.match(/\d+/)[0], 10);
      //   return studentNumber > max ? studentNumber : max;
      // }, -1);

      // setNextStudentNumber(highestStudentNumber + 1);
    } catch (error) {
      console.error("Error fetching students:", error);
      setValidationError("Failed to fetch students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students using the utility function
  const filteredStudents = filterStudents(students, searchTerm, filterGrade, filterSection, filterGender);

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

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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

    if (!isEditModalOpen && students.some(student => student.personalEmail === newStudent.personalEmail)) {
      setValidationError("This email is already registered to another student.");
      return false;
    }

    const age = parseInt(newStudent.age);
    if (isNaN(age) || age < 1 || age > 25) {
      setValidationError("Age must be between 1 and 25.");
      return false;
    }

    const grade = parseInt(newStudent.grade);
    if (isNaN(grade) || grade < 1 || grade > 13) {
      setValidationError("Grade must be between 1 and 13.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const studentData = {
        ...newStudent,
        grade: parseInt(newStudent.grade),
      };
      
      const response = await axios.post("http://localhost:3000/api/student/add", studentData);
      
      // No need to generate email/password here anymore
      fetchStudents();
      //setNextStudentNumber(nextStudentNumber + 1);
      
      const { generatedEmail, generatedPassword } = response.data;
      
      const emailSubject = "Welcome to SchoolMate - Your Student Account Credentials";
      const emailBody = `Dear ${newStudent.name},\n\n` +
        `Welcome to SchoolMate! We're excited to have you join our learning community.\n\n` +
        `Your student account has been successfully created. Here are your login credentials:\n\n` +
        `Student Email: ${generatedEmail}\n` +
        `Password: ${generatedPassword}\n\n` +
        `To access your account, please visit our portal and log in using the credentials above.\n\n` +
        `For security reasons, we recommend changing your password after your first login.\n\n` +
        `If you have any questions or need assistance, please contact our support team.\n\n` +
        `We wish you a successful academic journey with us!\n\n` +
        `Best regards,\n` +
        `The SchoolMate Administration Team`;
      
      window.open(
        `mailto:${newStudent.personalEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
        '_blank'
      );

      closeAddModal();
    } catch (error) {
      console.error("Error adding student:", error);
      if (error.response && error.response.status === 409) {
        setValidationError(error.response.data.error); 
      } else {
        setValidationError("Failed to add student. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStudent = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
    const response = await axios.put(
      `http://localhost:3000/api/student/update/${selectedStudent._id}`,
      {
        name: newStudent.name,
        age: newStudent.age,
        gender: newStudent.gender,
        grade: newStudent.grade,
        section: newStudent.section,
      }
    );
    
    setStudents(students.map((student) =>
      student._id === selectedStudent._id ? response.data : student
    ));
    closeEditModal();
    } catch (error) {
      console.error("Error updating student:", error);
      if (error.response && error.response.status === 409) {
        setValidationError("This email is already registered to another student.");
      } else {
        setValidationError("Failed to update student. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:3000/api/student/delete/${id}`);
        setStudents(students.filter((student) => student._id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      } finally {
        setIsLoading(false);
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
        <div>
          <h1 className="text-2xl font-bold">🎓 Admin Student Panel</h1>
        </div>

        <div className="flex gap-8">
          {/* Add Student Button */}
          <div className="mt-8">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button onClick={openAddModal} gradientDuoTone="greenToBlue" disabled={isLoading}>
                {isLoading ? "Loading..." : "Add Student"}
              </Button>
            </motion.div>
          </div>
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => (window.location.href = "/dashboard?tab=students")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded shadow-md"
            >
              Back to Students
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search and Filter Component */}
      <StudentSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterGrade={filterGrade}
        setFilterGrade={setFilterGrade}
        filterSection={filterSection}
        setFilterSection={setFilterSection}
        filterGender={filterGender}
        setFilterGender={setFilterGender}
        darkMode={darkMode}
      />

      {/* Students Table */}
      <div
        className="w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
      >
        <h2 className="text-lg font-semibold mb-3">📚 Students List</h2>
        {isLoading ? (
          <div className="text-center py-4">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-4">
            {students.length === 0 ? "No students found" : "No students match your filters"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Personal Email</th>
                  <th className="p-2 text-left">Age</th>
                  <th className="p-2 text-left">Gender</th>
                  <th className="p-2 text-left">Grade</th>
                  <th className="p-2 text-left">Section</th>
                  <th className="p-2 text-left">Student Email</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents && filteredStudents.map((student) => (
                  <tr key={student._id} className="border-t">
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.personalEmail}</td>
                    <td className="p-2">{student.age}</td>
                    <td className="p-2">{student.gender}</td>
                    <td className="p-2">{student.grade}</td>
                    <td className="p-2">{student.section}</td>
                    <td className="p-2">{student.userId?.email}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button size="xs" onClick={() => openEditModal(student)} disabled={isLoading}>
                          Edit
                        </Button>
                        <Button size="xs" color="red" onClick={() => handleDeleteStudent(student._id)} disabled={isLoading}>
                          Delete
                        </Button>
                        <Button size="xs" color="green" disabled={isLoading}>
                          View Profile
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
            {validationError && (
              <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                {validationError}
              </div>
            )}

            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="personalEmail">Personal Email</Label>
              <TextInput
                id="personalEmail"
                type="email"
                value={newStudent.personalEmail}
                onChange={(e) => setNewStudent({ ...newStudent, personalEmail: e.target.value })}
                className="w-full"
                required
                disabled={isEditModalOpen || isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age (1-25)</Label>
                <TextInput
                  id="age"
                  type="number"
                  value={newStudent.age}
                  onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                  min="1"
                  max="25"
                  className="w-full"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={newStudent.gender}
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-transparent"
                  required
                  disabled={isLoading}
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
                <Label htmlFor="grade">Grade (1-13)</Label>
                <TextInput
                  id="grade"
                  type="number"
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: parseInt(e.target.value) || "" })}
                  min="1"
                  max="13"
                  className="w-full"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <select
                  id="section"
                  value={newStudent.section}
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-transparent"
                  required
                  disabled={isLoading}
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
          <Button onClick={isEditModalOpen ? handleEditStudent : handleAddStudent} disabled={isLoading}>
            {isLoading ? "Processing..." : isEditModalOpen ? "Update" : "Add"} Student
          </Button>
          <Button color="gray" onClick={isAddModalOpen ? closeAddModal : closeEditModal} disabled={isLoading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}