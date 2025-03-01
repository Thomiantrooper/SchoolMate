import { useState } from "react";

export default function AdminStudent() {
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

  // Add Student
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.enrolled) return;

    setStudents([...students, { ...newStudent, id: students.length + 1 }]);
    setNewStudent({ name: "", grade: "", enrolled: "" });
  };

  // Delete Student
  const handleDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div className="bg-gray-100 text-gray-900 p-6 flex flex-col items-center w-full min-h-screen">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">🎓 Admin Student Panel</h1>
        <button 
          onClick={() => window.location.href = "/dashboard?tab=students"} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded">
          Back to Students
        </button>
      </div>

      {/* Add Student Form */}
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3">➕ Add New Student</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Student Name" 
            value={newStudent.name} 
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input 
            type="text" 
            placeholder="Grade" 
            value={newStudent.grade} 
            onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            className="border p-2 rounded"
          />
          <input 
            type="date" 
            value={newStudent.enrolled} 
            onChange={(e) => setNewStudent({ ...newStudent, enrolled: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button 
          onClick={handleAddStudent} 
          className="mt-3 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded">
          Add Student
        </button>
      </div>

      {/* Students Table */}
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">📋 Manage Students</h2>
        <table className="w-full border-collapse shadow-md">
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
              <tr key={student.id} className="border-b">
                <td className="p-2 font-semibold">{student.name}</td>
                <td className="p-2">{student.grade}</td>
                <td className="p-2">{student.enrolled}</td>
                <td className="p-2">
                  <button 
                    onClick={() => handleDeleteStudent(student.id)} 
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
