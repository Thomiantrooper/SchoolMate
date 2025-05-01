import { useState, useContext } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { db, collection, addDoc } from "../pages/firebaseConfig";
import { ThemeContext } from "./ThemeLayout"; 
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate

export default function DashHome() {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext); 
  const navigate = useNavigate(); // <-- Initialize navigate

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", age: "", grade: "", section: "" });
  const [image, setImage] = useState(null);

  // Open & Close Modal
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewStudent({ name: "", age: "", grade: "", section: "" });
    setImage(null);
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Add Student to Firestore
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.age || !newStudent.grade || !newStudent.section) {
      alert("All fields are required!");
      return;
    }

    try {
      await addDoc(collection(db, "students"), { ...newStudent });
      alert("Student added successfully!");
      closeAddModal();
      navigate("/admin-student"); // <-- Redirect after adding
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  return (
    <motion.div
      className={`max-w-6xl mx-auto p-6 w-full rounded-lg shadow-lg ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold">Welcome to the School Dashboard</h1>
        <p className="mt-2">{darkMode ? "Dark Mode Enabled" : "Light Mode Enabled"}</p>
      </div>

      {/* Hero Section */}
      <motion.div
        className={`p-8 rounded-lg text-center shadow-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold">Manage Students with Ease</h2>
        <p className="mt-2 text-lg">Add, edit, and track student details efficiently.</p>
      </motion.div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div whileHover={{ scale: 1.05 }} className={`p-5 rounded-lg shadow-md ${darkMode ? "bg-gray-700 text-white" : "bg-blue-600 text-white"}`}>
          <h3 className="text-xl font-semibold">📋 Manage Students</h3>
          <p className="mt-2">Easily add, edit, and remove student records.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className={`p-5 rounded-lg shadow-md ${darkMode ? "bg-gray-600 text-white" : "bg-green-600 text-white"}`}>
          <h3 className="text-xl font-semibold">📖 View Student Details</h3>
          <p className="mt-2">Quickly find and access student profiles.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className={`p-5 rounded-lg shadow-md ${darkMode ? "bg-gray-500 text-white" : "bg-yellow-500 text-gray-900"}`}>
          <h3 className="text-xl font-semibold">🔄 Track Attendance</h3>
          <p className="mt-2">Monitor student attendance in real-time.</p>
        </motion.div>
      </div>

      {/* Add Student Button */}
      <div className="mt-8 flex justify-center">
        <motion.div whileHover={{ scale: 1.1 }}>
        <Button onClick={() => navigate("/admin-student")} gradientDuoTone="greenToBlue">
  Add Student
</Button>

        </motion.div>
      </div>

      {/* Add Student Modal */}
      <Modal show={isAddModalOpen} size="lg" onClose={closeAddModal}>
        <Modal.Header>Add New Student</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Label>Name</Label>
            <TextInput type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="w-full" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <TextInput type="number" value={newStudent.age} onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })} className="w-full" />
              </div>
              <div>
                <Label>Grade</Label>
                <TextInput type="text" value={newStudent.grade} onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })} className="w-full" />
              </div>
            </div>

            <Label>Section</Label>
            <TextInput type="text" value={newStudent.section} onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} className="w-full" />

            <Label>Upload Student Image</Label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded-lg" />

            {image && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="flex justify-center">
                <img src={image} alt="Student Preview" className="mt-4 w-40 h-40 object-cover rounded-lg border" />
              </motion.div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button gradientDuoTone="greenToBlue" onClick={handleAddStudent}>Add Student</Button>
          </motion.div>
          <Button color="gray" onClick={closeAddModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}
