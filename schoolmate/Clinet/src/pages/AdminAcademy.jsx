import { useState, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout";
import { 
  FiBook, 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiCheck,
  FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAcademy() {
  const { darkMode } = useContext(ThemeContext);
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      title: "React for Beginners", 
      instructor: "John Doe", 
      date: "2025-02-20",
      description: "Learn React fundamentals in this comprehensive beginner course",
      duration: "4 weeks",
      capacity: 30
    },
    { 
      id: 2, 
      title: "Node.js Masterclass", 
      instructor: "Jane Smith", 
      date: "2025-02-18",
      description: "Master backend development with Node.js and Express",
      duration: "6 weeks",
      capacity: 25
    },
    { 
      id: 3, 
      title: "Full-Stack Development", 
      instructor: "Mike Johnson", 
      date: "2025-02-15",
      description: "Complete course covering both frontend and backend development",
      duration: "8 weeks",
      capacity: 20
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    date: "",
    description: "",
    duration: "",
    capacity: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  // Add or Update Course
  const handleSaveCourse = (e) => {
    e.preventDefault();
    
    if (!newCourse.title || !newCourse.instructor || !newCourse.date) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      // Update existing course
      setCourses(courses.map(course => 
        course.id === editingId ? { ...newCourse, id: editingId } : course
      ));
    } else {
      // Add new course
      setCourses([...courses, { 
        ...newCourse, 
        id: Date.now() 
      }]);
    }
    
    setNewCourse({
      title: "",
      instructor: "",
      date: "",
      description: "",
      duration: "",
      capacity: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Delete Course
  const handleDeleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  // Edit Course
  const handleEditCourse = (course) => {
    setNewCourse(course);
    setEditingId(course.id);
    setShowForm(true);
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const currentDate = new Date();
    const courseDate = new Date(course.date);
    
    if (filter === "upcoming") return courseDate >= currentDate;
    if (filter === "past") return courseDate < currentDate;
    return true;
  });

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors ${
      darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <FiBook className="text-indigo-600" /> Academy Management
          </h1>
          <button 
            onClick={() => window.location.href = "/dashboard?tab=academy"} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <FiArrowLeft /> Back to Academy
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              <FiPlus /> Add Course
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All Courses</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {/* Course Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className={`w-full max-w-2xl rounded-xl shadow-xl p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingId ? "Edit Course" : "Add New Course"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveCourse} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Course Title*</label>
                      <input
                        type="text"
                        placeholder="React for Beginners"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Instructor*</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={newCourse.instructor}
                        onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date*</label>
                      <input
                        type="date"
                        value={newCourse.date}
                        onChange={(e) => setNewCourse({...newCourse, date: e.target.value})}
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration</label>
                      <input
                        type="text"
                        placeholder="4 weeks"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacity</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={newCourse.capacity}
                        onChange={(e) => setNewCourse({...newCourse, capacity: e.target.value})}
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      placeholder="Course description..."
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      rows="4"
                      className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <FiCheck /> {editingId ? "Update Course" : "Add Course"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses List */}
        <div className={`rounded-xl shadow-md overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center">
              <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">No courses found</p>
              <button 
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 mx-auto"
              >
                <FiPlus /> Add Your First Course
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}>
                  <tr>
                    <th className="p-4 text-left">Course</th>
                    <th className="p-4 text-left">Instructor</th>
                    <th className="p-4 text-left">Start Date</th>
                    <th className="p-4 text-left">Duration</th>
                    <th className="p-4 text-left">Capacity</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCourses.map((course) => (
                    <motion.tr 
                      key={course.id}
                      whileHover={{ backgroundColor: darkMode ? "rgba(55, 65, 81, 0.5)" : "rgba(243, 244, 246, 0.5)" }}
                      className={`${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-semibold">{course.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {course.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          {course.instructor}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {new Date(course.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">{course.duration}</td>
                      <td className="p-4">{course.capacity}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
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
    </div>
  );
}