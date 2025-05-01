import React, { useState, useEffect } from "react";

// Component for Pagination, Collapsible Info, and more
const StudentRecords = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', grade: '', attendance: '' });
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  // Load from localStorage or set dummy data
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('students'));
    if (storedStudents) {
      setStudents(storedStudents);
    } else {
      setStudents([
        { id: 1, name: "John Doe", grade: "A", attendance: "95%", active: true, imageUrl: "https://via.placeholder.com/50", age: 20, location: "Colombo", performance: "Excellent", enrollmentDate: "2023-01-10" },
        { id: 2, name: "Jane Smith", grade: "B+", attendance: "90%", active: true, imageUrl: "https://via.placeholder.com/50", age: 22, location: "Kandy", performance: "Good", enrollmentDate: "2022-11-05" },
        { id: 3, name: "Alice Johnson", grade: "A-", attendance: "92%", active: false, imageUrl: "https://via.placeholder.com/50", age: 19, location: "Galle", performance: "Excellent", enrollmentDate: "2023-03-14" },
        // More sample students
        { id: 4, name: "Bob Brown", grade: "B", attendance: "85%", active: true, imageUrl: "https://via.placeholder.com/50", age: 21, location: "Negombo", performance: "Good", enrollmentDate: "2022-09-30" },
        { id: 5, name: "Mary White", grade: "C+", attendance: "78%", active: false, imageUrl: "https://via.placeholder.com/50", age: 23, location: "Kurunegala", performance: "Average", enrollmentDate: "2021-08-12" },
      ]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const handleStartEditing = (id) => {
    const student = students.find(s => s.id === id);
    setEditingId(id);
    setEditValues({ name: student.name, grade: student.grade, attendance: student.attendance });
  };

  const handleSaveEditing = (id) => {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, ...editValues } : student
    );
    setStudents(updatedStudents);
    setEditingId(null);
    setEditValues({ name: '', grade: '', attendance: '' });
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditValues({ name: '', grade: '', attendance: '' });
  };

  const handleSort = (field) => {
    setSortField(field);
    const sorted = [...students].sort((a, b) => {
      if (a[field] > b[field]) return 1;
      else if (a[field] < b[field]) return -1;
      else return 0;
    });
    setStudents(sorted);
  };

  const calculateAverageAttendance = () => {
    const total = students.reduce((sum, student) => {
      const attendanceNumber = parseInt(student.attendance.replace('%', '')) || 0;
      return sum + attendanceNumber;
    }, 0);
    return students.length ? (total / students.length).toFixed(2) : 0;
  };

  const clearAllRecords = () => {
    if (window.confirm("Clear all student records?")) {
      setStudents([]);
      localStorage.removeItem('students');
    }
  };

  const exportToCSV = () => {
    const csvRows = [
      ["ID", "Name", "Grade", "Attendance", "Active", "Age", "Location", "Performance", "Enrollment Date"],
      ...students.map(s => [s.id, s.name, s.grade, s.attendance, s.active ? "Active" : "Inactive", s.age, s.location, s.performance, s.enrollmentDate])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || (filterStatus === 'Active' && student.active) || (filterStatus === 'Inactive' && !student.active);
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddStudent = (newStudent) => {
    setStudents([...students, { ...newStudent, id: students.length + 1 }]);
    setShowAddStudentForm(false);
  };

  return (
    <div style={{
      padding: "20px",
      maxWidth: "1100px",
      margin: "0 auto",
      backgroundColor: darkMode ? "#121212" : "#ffffff",
      color: darkMode ? "#ffffff" : "#000000",
      transition: "all 0.3s ease"
    }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}>🎓 Student Records</h2>

      {/* Dark mode toggle button */}
      <button 
        onClick={() => setDarkMode(!darkMode)} 
        style={{
          padding: "8px 20px",
          marginBottom: "20px",
          backgroundColor: darkMode ? "#f44336" : "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Toggle Dark Mode
      </button>

      {/* Search, Sort, Filter */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "20px",
        backgroundColor: darkMode ? "#333333" : "#f9f9f9",
        padding: "10px",
        borderRadius: "8px"
      }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "40%",
            minWidth: "200px",
            backgroundColor: darkMode ? "#555555" : "#fff",
            color: darkMode ? "#fff" : "#000",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => handleSort('name')} style={{
            marginRight: "10px", 
            padding: "8px", 
            backgroundColor: darkMode ? "#333" : "#f44336", 
            color: "#fff", 
            border: "none", 
            borderRadius: "5px"
          }}>
            Sort by Name
          </button>
          <button onClick={() => handleSort('grade')} style={{
            padding: "8px", 
            backgroundColor: darkMode ? "#333" : "#f44336", 
            color: "#fff", 
            border: "none", 
            borderRadius: "5px"
          }}>
            Sort by Grade
          </button>
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{
          marginTop: "10px",
          padding: "8px",
          backgroundColor: darkMode ? "#555" : "#fff",
          color: darkMode ? "#fff" : "#000",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}>
          <option value="All">All Students</option>
          <option value="Active">Active Only</option>
          <option value="Inactive">Inactive Only</option>
        </select>
      </div>

      {/* Add Student Form */}
      {showAddStudentForm ? (
        <div>
          <AddStudentForm onSubmit={handleAddStudent} />
        </div>
      ) : (
        <button onClick={() => setShowAddStudentForm(true)} style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: darkMode ? "#4CAF50" : "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: "5px"
        }}>
          Add New Student
        </button>
      )}

      {/* Student Records Box */}
      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        backgroundColor: darkMode ? "#333333" : "#f9f9f9"
      }}>
        <h3>🔍 Search and Filter</h3>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              width: "40%",
              backgroundColor: darkMode ? "#555" : "#fff",
              color: darkMode ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "5px"
            }}
          />
          <button onClick={clearAllRecords} style={{
            padding: "8px 20px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}>
            Clear All
          </button>
        </div>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px"
        }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.attendance}</td>
                <td>{student.active ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => handleDeleteStudent(student.id)} style={{
                    padding: "5px 10px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "5px", marginRight: "10px"
                  }}>
                    Delete
                  </button>
                  <button onClick={() => handleStartEditing(student.id)} style={{
                    padding: "5px 10px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px"
                  }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{ padding: "10px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", margin: "0 5px" }}>
            Previous
          </button>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: "10px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", margin: "0 5px" }}>
            Next
          </button>
        </div>

        <h4>Average Attendance: {calculateAverageAttendance()}%</h4>

        {/* Export to CSV */}
        <button onClick={exportToCSV} style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px"
        }}>
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default StudentRecords;
