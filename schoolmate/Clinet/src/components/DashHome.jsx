import { useState, useContext } from "react";
import { Button, Modal, TextInput, Label, Card } from "flowbite-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { db, collection, addDoc } from "../pages/firebaseConfig";
import { ThemeContext } from "./ThemeLayout"; 
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBook, FiCalendar, FiPlus, FiUpload, FiX } from "react-icons/fi";

export default function DashHome() {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext); 
  const navigate = useNavigate();

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
      navigate("/admin-student");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  return (
    <motion.div
      className={`max-w-7xl mx-auto p-6 w-full ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.h1 
          className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          School Management Dashboard
        </motion.h1>
        <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Streamline your school administration with powerful tools
        </p>
      </div>

      {/* Hero Section */}
      <motion.div
        className={`p-8 rounded-xl mb-10 text-center relative overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-gradient-to-r from-indigo-600 to-purple-600"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent via-white/10 animate-pulse"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Manage Students with Ease</h2>
          <p className="text-xl text-white/90 mb-6">Add, edit, and track student details efficiently.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              gradientDuoTone="cyanToBlue" 
              size="lg"
              onClick={() => navigate("?tab=students")}
              className="shadow-lg"
            >
              <FiUsers className="mr-2" /> View Students
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            icon: <FiUsers size={24} />,
            title: "Student Management",
            description: "Manage all student records",
            color: "blue",
            action: () => navigate("?tab=students")
          },
          {
            icon: <FiBook size={24} />,
            title: "Subjects",
            description: "View and manage subjects",
            color: "green",
            action: () => navigate("?tab=subjects")
          },
          {
            icon: <FiCalendar size={24} />,
            title: "Attendance",
            description: "Track student attendance",
            color: "purple",
            action: () => {}
          },
         
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={feature.action}
          >
            <Card 
              className={`cursor-pointer h-full transition-all ${
                darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-${feature.color}-100 text-${feature.color}-600`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {feature.title}
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {feature.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
        >
          <h4 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Students</h4>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>1,248</p>
          <div className={`h-2 mt-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <div className="h-full rounded-full bg-green-500 w-3/4"></div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
        >
          <h4 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Active Classes</h4>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>24</p>
          <div className={`h-2 mt-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <div className="h-full rounded-full bg-blue-500 w-2/3"></div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
        >
          <h4 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Attendance Today</h4>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>92%</p>
          <div className={`h-2 mt-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <div className="h-full rounded-full bg-yellow-500 w-9/10"></div>
          </div>
        </motion.div>
      </div>

      {/* Add Student Modal */}
      <Modal show={isAddModalOpen} size="xl" onClose={closeAddModal} popup>
        <Modal.Header className="border-b p-4">
          <div className="flex items-center">
            <FiUsers className="mr-2" />
            <h3 className="text-xl font-semibold">Add New Student</h3>
          </div>
          
          
        </Modal.Header>
        <Modal.Body className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" value="Full Name" className="mb-2 block" />
              <TextInput 
                id="name"
                type="text" 
                value={newStudent.name} 
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} 
                placeholder="Enter student's full name"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" value="Age" className="mb-2 block" />
                <TextInput 
                  id="age"
                  type="number" 
                  value={newStudent.age} 
                  onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })} 
                  placeholder="Enter age"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="grade" value="Grade" className="mb-2 block" />
                <TextInput 
                  id="grade"
                  type="text" 
                  value={newStudent.grade} 
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })} 
                  placeholder="Enter grade"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="section" value="Section" className="mb-2 block" />
              <TextInput 
                id="section"
                type="text" 
                value={newStudent.section} 
                onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} 
                placeholder="Enter section"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="image" value="Student Photo" className="mb-2 block" />
              <label 
                htmlFor="image"
                className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer ${
                  darkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FiUpload className="mb-2" />
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {image ? "Change image" : "Click to upload or drag and drop"}
                </p>
                <input 
                  id="image"
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden"
                />
              </label>
            </div>

            {image && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex justify-center mt-4"
              >
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Student Preview" 
                    className="w-40 h-40 object-cover rounded-lg border"
                  />
                  <button 
                    onClick={() => setImage(null)}
                    className={`absolute -top-2 -right-2 p-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end p-4 border-t">
          <Button color="gray" onClick={closeAddModal} className="mr-2">
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              gradientDuoTone="greenToBlue" 
              onClick={handleAddStudent}
              disabled={!newStudent.name || !newStudent.age || !newStudent.grade || !newStudent.section}
            >
              Add Student
            </Button>
          </motion.div>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}