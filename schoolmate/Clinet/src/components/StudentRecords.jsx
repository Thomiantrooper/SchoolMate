import React, { useState, useEffect, useCallback } from "react";
import { 
  FaSearch, FaMoon, FaSun, FaSort, FaSortUp, FaSortDown, 
  FaUserGraduate, FaEnvelope, FaChartLine, FaUserCheck, 
  FaUserTimes, FaSync, FaSpinner 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const StudentRecords = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(8);
  const [darkMode, setDarkMode] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Dummy data generator
  const generateDummyStudents = useCallback(() => {
    const firstNames = ["Aarav", "Nethmi", "Kavindu", "Dineth", "Imesha", "Sahan", "Dilini", "Yasiru", "Oneli", "Ravindu"];
    const lastNames = ["Perera", "Fernando", "Silva", "Karunaratne", "Dissanayake", "Gamage", "Rathnayake", "Alwis", "Wijesekara", "Pathirana"];
    const grades = ["A", "B", "C", "D", "E"];
    const subjects = ["Mathematics", "Science", "English", "History", "Sinhala", "ICT", "Drama"];
    
    return Array.from({ length: 15 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const age = Math.floor(Math.random() * 8) + 12; // 12-19 years
      const active = Math.random() > 0.3; // 70% chance of being active
      
      return {
        id: i + 1,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`,
        age,
        grade: grades[Math.floor(Math.random() * grades.length)],
        attendance: `${Math.floor(Math.random() * 30) + 70}%`, // 70-99%
        active,
        subjects: [...subjects]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 2), // 2-4 subjects
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      };
    });
  }, []);

  // Fetch data with auto-refresh capability
  const fetchData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const storedStudents = JSON.parse(localStorage.getItem('students'));
      if (storedStudents && !autoRefresh) {
        setStudents(storedStudents);
      } else {
        const newStudents = generateDummyStudents();
        setStudents(newStudents);
        localStorage.setItem('students', JSON.stringify(newStudents));
      }
      setIsLoading(false);
      setLastRefresh(new Date());
    }, 500); // Simulate network delay
  }, [autoRefresh, generateDummyStudents]);

  // Initial load and auto-refresh setup
  useEffect(() => {
    fetchData();
    
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchData, 1000); // Refresh every 1 second
    }
    
    return () => clearInterval(intervalId);
  }, [fetchData, autoRefresh]);

  // Save to localStorage when students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter students based on search and status
  const filteredStudents = sortedStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subjects.some(subject => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Active' && student.active) ||
      (filterStatus === 'Inactive' && !student.active);
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle student active status
  const toggleActiveStatus = (id) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, active: !student.active } : student
    ));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  // Format last refresh time
  const formatRefreshTime = (date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <FaUserGraduate className="text-indigo-600" /> Student Records
            </h1>
            <p className="text-gray-500 mt-2">
              Manage and track student academic performance and attendance
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-full flex items-center gap-2 ${autoRefresh ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                {autoRefresh ? <FaSpinner className="animate-spin" /> : <FaSync />}
                <span className="hidden md:inline">{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'}`}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
        </div>

        {/* Last refresh indicator */}
        <div className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Last refreshed: {formatRefreshTime(lastRefresh)}
          {autoRefresh && <span className="ml-2 text-green-500">• Auto-refresh enabled</span>}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Students</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
          
          <div className={`p-3 rounded-lg shadow text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-xl font-bold">{filteredStudents.length}</div>
            <div className="text-sm text-gray-500">Students Found</div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg mb-8">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-indigo-600 text-white'}`}>
              <tr>
                <th 
                  className="p-3 text-left cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Name {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer"
                  onClick={() => requestSort('email')}
                >
                  <div className="flex items-center">
                    Email {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer"
                  onClick={() => requestSort('grade')}
                >
                  <div className="flex items-center">
                    Grade {getSortIcon('grade')}
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer"
                  onClick={() => requestSort('attendance')}
                >
                  <div className="flex items-center">
                    Attendance {getSortIcon('attendance')}
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer"
                  onClick={() => requestSort('active')}
                >
                  <div className="flex items-center">
                    Status {getSortIcon('active')}
                  </div>
                </th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <FaSpinner className="animate-spin" /> Loading students...
                    </div>
                  </td>
                </tr>
              ) : currentStudents.length > 0 ? (
                currentStudents.map(student => (
                  <motion.tr 
                    key={student.id}
                    whileHover={{ backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)' }}
                    className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <td 
                      className="p-3 cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.age} years</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {student.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full ${
                        student.grade === 'A' ? 'bg-green-100 text-green-800' :
                        student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        student.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FaChartLine className="text-gray-400" />
                        {student.attendance}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleActiveStatus(student.id)}
                        className={`p-2 rounded-full ${
                          student.active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {student.active ? <FaUserTimes /> : <FaUserCheck />}
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No students found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-10 h-10 rounded-full ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {number}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedStudent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedStudent.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500">{selectedStudent.age} years</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        <span>{selectedStudent.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Academic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Grade</div>
                        <div className="font-medium">{selectedStudent.grade}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Attendance</div>
                        <div className="font-medium">{selectedStudent.attendance}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Last Active</div>
                        <div className="font-medium">{selectedStudent.lastActive}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Enrolled Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.subjects.map((subject, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      toggleActiveStatus(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      selectedStudent.active ? 
                        'bg-red-100 text-red-800 hover:bg-red-200' : 
                        'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {selectedStudent.active ? (
                      <>
                        <FaUserTimes /> Deactivate
                      </>
                    ) : (
                      <>
                        <FaUserCheck /> Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentRecords;