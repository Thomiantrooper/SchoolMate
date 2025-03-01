import { useState, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout"; 

export default function AdminAcademy() {
  const { darkMode } = useContext(ThemeContext);
  const [courses, setCourses] = useState([
    { id: 1, title: "React for Beginners", instructor: "John Doe", date: "2025-02-20" },
    { id: 2, title: "Node.js Masterclass", instructor: "Jane Smith", date: "2025-02-18" },
    { id: 3, title: "Full-Stack Development", instructor: "Mike Johnson", date: "2025-02-15" },
  ]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    date: "",
  });

  // Add Course
  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor || !newCourse.date) return;

    setCourses([...courses, { ...newCourse, id: courses.length + 1 }]);
    setNewCourse({ title: "", instructor: "", date: "" });
  };

  // Delete Course
  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      
      {/* Header */}
      <div className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h1 className="text-2xl font-bold">📚 Admin Academy Panel</h1>
        <button 
          onClick={() => window.location.href = "/dashboard?tab=academy"} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded">
          Back to Academy
        </button>
      </div>

      {/* Add Course Form */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-3">➕ Add New Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Course Title" 
            value={newCourse.title} 
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
          />
          <input 
            type="text" 
            placeholder="Instructor Name" 
            value={newCourse.instructor} 
            onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
          />
          <input 
            type="date" 
            value={newCourse.date} 
            onChange={(e) => setNewCourse({ ...newCourse, date: e.target.value })}
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
          />
        </div>
        <button 
          onClick={handleAddCourse} 
          className="mt-3 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded">
          Add Course
        </button>
      </div>

      {/* Courses Table */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-2">📋 Manage Courses</h2>
        <table className="w-full border-collapse shadow-md">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
              <th className="p-2">Title</th>
              <th className="p-2">Instructor</th>
              <th className="p-2">Start Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                <td className="p-2 font-semibold">{course.title}</td>
                <td className="p-2">{course.instructor}</td>
                <td className="p-2">{course.date}</td>
                <td className="p-2">
                  <button 
                    onClick={() => handleDeleteCourse(course.id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
