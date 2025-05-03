import React, { useState, useEffect, useCallback } from "react";
import { 
  FaSearch, FaMoon, FaSun, FaSort, FaSortUp, FaSortDown, 
  FaUserGraduate, FaEnvelope, FaChartLine, FaUserCheck, 
  FaUserTimes, FaSync, FaSpinner, FaTimes, FaFilter, 
  FaInfoCircle, FaCalendarAlt, FaBook
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
    const grades = ["10", "10", "10", "10", "10"];
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
            <p className={`mt-2 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <FaInfoCircle className="text-indigo-500" />
              Manage and track student academic performance and attendance
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
              >
                {autoRefresh ? <FaSpinner className="animate-spin" /> : <FaSync />}
                <span className="hidden md:inline">{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                <FaUserGraduate className={`text-xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Students</div>
                <div className="text-2xl font-bold">{students.length}</div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <FaUserCheck className={`text-xl ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Students</div>
                <div className="text-2xl font-bold">{students.filter(s => s.active).length}</div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <FaChartLine className={`text-xl ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Avg Attendance</div>
                <div className="text-2xl font-bold">
                  {students.length > 0 
                    ? Math.round(students.reduce((acc, curr) => acc + parseInt(curr.attendance), 0) / students.length) + '%' 
                    : '0%'}
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <FaCalendarAlt className={`text-xl ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-2xl font-bold">{formatRefreshTime(lastRefresh)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-lg shadow mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              {/* <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              <input
                type="text"
                placeholder="Search students by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:ring-indigo-500' 
                    : 'bg-white border-gray-300 focus:ring-indigo-500'
                }`}
              />
            </div>
            
            <div className="relative">
              {/* <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              <select 
                value={filterStatus} 
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border appearance-none focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:ring-indigo-500' 
                    : 'bg-white border-gray-300 focus:ring-indigo-500'
                }`}
              >
                <option value="All">All Students</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>
            
            <div className={`p-3 rounded-lg flex items-center justify-between ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div>
                <div className="text-sm text-gray-500">Showing</div>
                <div className="font-medium">
                  {filteredStudents.length > 0 ? indexOfFirstStudent + 1 : 0} -{' '}
                  {Math.min(indexOfLastStudent, filteredStudents.length)} of{' '}
                  {filteredStudents.length}
                </div>
              </div>
              {autoRefresh && (
                <div className="flex items-center gap-1 text-green-500">
                  <FaSpinner className="animate-spin" />
                  <span className="text-xs hidden md:inline">Live updating</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className={`rounded-lg shadow-lg mb-8 overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-600 text-white'}`}>
                <tr>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-indigo-700 transition-colors"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Name {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-indigo-700 transition-colors"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      Email {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-indigo-700 transition-colors"
                    onClick={() => requestSort('grade')}
                  >
                    <div className="flex items-center">
                      Grade {getSortIcon('grade')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-indigo-700 transition-colors"
                    onClick={() => requestSort('attendance')}
                  >
                    <div className="flex items-center">
                      Attendance {getSortIcon('attendance')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-indigo-700 transition-colors"
                    onClick={() => requestSort('active')}
                  >
                    <div className="flex items-center">
                      Status {getSortIcon('active')}
                    </div>
                  </th>
                  <th className="p-4 text-left">Actions</th>
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
                      className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <td 
                        className="p-4 cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.age} years</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />
                          <span className="truncate max-w-[180px]">{student.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full font-medium ${
                          student.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          student.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          student.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          student.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {student.grade}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FaChartLine className="text-gray-400" />
                          <div className="w-full">
                            <div className="text-sm font-medium">{student.attendance}</div>
                            <div className={`h-1 rounded-full mt-1 ${
                              parseInt(student.attendance) > 90 ? 'bg-green-500' :
                              parseInt(student.attendance) > 80 ? 'bg-blue-500' :
                              parseInt(student.attendance) > 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} style={{ width: student.attendance }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {student.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleActiveStatus(student.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              student.active 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                            }`}
                            title={student.active ? 'Deactivate student' : 'Activate student'}
                          >
                            {student.active ? <FaUserTimes /> : <FaUserCheck />}
                          </button>
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title="View details"
                          >
                            <FaInfoCircle />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FaSearch className="text-2xl opacity-50" />
                        No students found matching your criteria
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setFilterStatus('All');
                            setCurrentPage(1);
                          }}
                          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredStudents.length > studentsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-full transition-colors ${
                      currentPage === number 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages || totalPages === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
              className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedStudent.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {selectedStudent.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500">{selectedStudent.age} years</span>
                      <span className={`px-3 py-1 rounded-full font-medium ${
                        selectedStudent.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        selectedStudent.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        selectedStudent.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        selectedStudent.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        Grade: {selectedStudent.grade}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FaEnvelope className="text-indigo-500" /> Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <div className="font-medium">{selectedStudent.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FaChartLine className="text-indigo-500" /> Academic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Grade</div>
                        <div className="font-medium">{selectedStudent.grade}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Attendance</div>
                        <div className="font-medium">{selectedStudent.attendance}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Last Active</div>
                        <div className="font-medium">{selectedStudent.lastActive}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg mb-6 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaBook className="text-indigo-500" /> Enrolled Subjects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.subjects.map((subject, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? 'bg-indigo-900 text-indigo-200' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      toggleActiveStatus(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      selectedStudent.active 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
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