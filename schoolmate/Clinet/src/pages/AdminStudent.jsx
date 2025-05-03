import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Modal, TextInput, Label, Badge, Spinner, Alert, Avatar } from "flowbite-react";
import { ThemeContext } from "../components/ThemeLayout";
import axios from "axios";
import StudentSearchFilter from "../components/StudentSearchFilter";
import { filterStudents } from "../../../api/utils/studentFilters";
import { FiUser, FiMail, FiEdit2, FiTrash2, FiEye, FiPlus, FiUserPlus, FiUsers } from "react-icons/fi";

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
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    if (isNaN(age) || age < 10 || age > 20) {
      setValidationError("Age must be between 10 and 20.");
      return false;
    }

    const grade = parseInt(newStudent.grade);
    if (isNaN(grade) || grade < 6 || grade > 13) {
      setValidationError("Grade must be between 6 and 13.");
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
      
      fetchStudents();
      
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

      setSuccessMessage("Student added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
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
      
      setSuccessMessage("Student updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
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
        setSuccessMessage("Student deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting student:", error);
        setValidationError("Failed to delete student. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <FiUsers className="text-2xl text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Student Management</h1>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Manage all student records and information
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
          >
            <FiUserPlus className="mr-2" />
            Add Student
          </motion.button>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <Alert color="success">
                {successMessage}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

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
        <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center">
              <FiUsers className="mr-2" /> Student Records
            </h2>
            <div className="text-sm">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Spinner size="xl" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                {students.length === 0 ? "No students found" : "No students match your filters"}
              </div>
              <Button onClick={openAddModal} gradientDuoTone="cyanToBlue">
                <FiPlus className="mr-2" /> Add First Student
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className="p-4 text-left">Student</th>
                    <th className="p-4 text-left">Contact</th>
                    <th className="p-4 text-left">Details</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <motion.tr 
                      key={student._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <Avatar
                            placeholderInitials={getInitials(student.name)}
                            rounded
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              Grade {student.grade} - Section {student.section}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <FiMail className="mr-2 text-gray-500" />
                          <div>
                            <div className="text-sm">{student.personalEmail}</div>
                            <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {student.userId?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4">
                          <div>
                            <div className="text-xs text-gray-500">Age</div>
                            <div>{student.age}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Gender</div>
                            <div>{student.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge color="success" className="w-fit">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="xs" onClick={() => openEditModal(student)} disabled={isLoading}>
                            <FiEdit2 className="mr-1" /> Edit
                          </Button>
                          <Button size="xs" color="red" onClick={() => handleDeleteStudent(student._id)} disabled={isLoading}>
                            <FiTrash2 className="mr-1" /> Delete
                          </Button>
                          
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        show={isAddModalOpen || isEditModalOpen}
        size="xl"
        onClose={isAddModalOpen ? closeAddModal : closeEditModal}
        dismissible={!isLoading}
      >
        <Modal.Header>
          <div className="flex items-center">
            <FiUserPlus className="mr-2" />
            {isEditModalOpen ? "Edit Student" : "Add New Student"}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {validationError && (
              <Alert color="failure" className="mb-4">
                {validationError}
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="mb-2 flex items-center">
                  <FiUser className="mr-2" /> Full Name
                </Label>
                <TextInput
                  id="name"
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                  addon={<FiUser />}
                />
              </div>

              <div>
                <Label htmlFor="personalEmail" className="mb-2 flex items-center">
                  <FiMail className="mr-2" /> Personal Email
                </Label>
                <TextInput
                  id="personalEmail"
                  type="email"
                  value={newStudent.personalEmail}
                  onChange={(e) => setNewStudent({ ...newStudent, personalEmail: e.target.value })}
                  placeholder="john@example.com"
                  required
                  disabled={isEditModalOpen || isLoading}
                  addon={<FiMail />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="age">Age (10-20)</Label>
                <TextInput
                  id="age"
                  type="number"
                  value={newStudent.age}
                  onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                  min="10"
                  max="20"
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
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="grade">Grade (6-13)</Label>
                <TextInput
                  id="grade"
                  type="number"
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: parseInt(e.target.value) || "" })}
                  min="6"
                  max="13"
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
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Section</option>
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={String.fromCharCode(65 + i)}>
                      Section {String.fromCharCode(65 + i)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            onClick={isEditModalOpen ? handleEditStudent : handleAddStudent} 
            disabled={isLoading}
            gradientDuoTone={isEditModalOpen ? "purpleToBlue" : "tealToLime"}
            className="flex items-center"
          >
            {isLoading ? (
              <Spinner size="sm" className="mr-2" />
            ) : isEditModalOpen ? (
              <FiEdit2 className="mr-2" />
            ) : (
              <FiUserPlus className="mr-2" />
            )}
            {isEditModalOpen ? "Update" : "Add"} Student
          </Button>
          <Button 
            color="gray" 
            onClick={isAddModalOpen ? closeAddModal : closeEditModal} 
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}