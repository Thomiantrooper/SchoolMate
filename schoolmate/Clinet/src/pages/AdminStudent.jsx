import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../components/ThemeLayout"; 

export default function AdminStudent() {
  const { darkMode } = useContext(ThemeContext);
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Johnson", grade: "A", enrolled: "2025-02-20" },
    { id: 2, name: "Bob Smith", grade: "B", enrolled: "2025-02-18" },
    { id: 3, name: "Charlie Brown", grade: "A", enrolled: "2025-02-15" },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    enrolled: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  // Add Student
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.enrolled) return;
    setStudents([...students, { ...newStudent, id: students.length + 1 }]);
    setNewStudent({ name: "", grade: "", enrolled: "" });
  };

  // Confirm Deletion
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  // Delete Student
  const handleDeleteStudent = () => {
    setStudents(students.filter((student) => student.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 bg-opacity-80 
        transition-all duration-300 shadow-md"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}>
        <h1 className="text-2xl font-bold">🎓 Admin Student Panel</h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.href = "/dashboard?tab=students"} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded shadow-md">
          Back to Students
        </motion.button>
      </div>

      {/* Add Student Form */}
      <div className="w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}>
        <h2 className="text-lg font-semibold mb-3">➕ Add New Student</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Student Name" 
            value={newStudent.name} 
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="border p-2 rounded bg-transparent focus:ring focus:ring-blue-300"
          />
          <input 
            type="text" 
            placeholder="Grade" 
            value={newStudent.grade} 
            onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            className="border p-2 rounded bg-transparent focus:ring focus:ring-blue-300"
          />
          <input 
            type="date" 
            value={newStudent.enrolled} 
            onChange={(e) => setNewStudent({ ...newStudent, enrolled: e.target.value })}
            className="border p-2 rounded bg-transparent focus:ring focus:ring-blue-300"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddStudent} 
          className="mt-3 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded shadow-md">
          Add Student
        </motion.button>
      </div>

      {/* Students Table */}
      <div className="w-full max-w-6xl p-4 rounded-lg shadow-md transition-all duration-300"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}>
        <h2 className="text-lg font-semibold mb-2">📋 Manage Students</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Grade</th>
              <th className="p-2">Enrolled Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <motion.tr 
                key={student.id} 
                className="border-b"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <td className="p-2 font-semibold">{student.name}</td>
                <td className="p-2">{student.grade}</td>
                <td className="p-2">{student.enrolled}</td>
                <td className="p-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => confirmDelete(student.id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-md">
                    ❌ Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold mb-4">⚠️ Confirm Deletion</h2>
            <p>Are you sure you want to delete this student?</p>
            <div className="flex justify-end gap-4 mt-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDeleteId(null)} 
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDeleteStudent} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
