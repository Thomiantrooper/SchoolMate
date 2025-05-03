import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { FiRefreshCw, FiSun, FiMoon, FiMail, FiPlus, FiEdit2, FiUsers, FiPieChart, FiBarChart2, FiX } from 'react-icons/fi';

const AiWorkDashboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [task, setTask] = useState("");
  const [editModal, setEditModal] = useState({
    isOpen: false,
    teacher: null,
    taskCount: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cachedTeachers = localStorage.getItem('teachers');
    const cachedStudents = localStorage.getItem('students');

    if (cachedTeachers && cachedStudents) {
      setTeachers(JSON.parse(cachedTeachers));
      setStudents(JSON.parse(cachedStudents));
      setLastUpdated(new Date().toLocaleString());
    } else {
      await fetchUsers();
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/users');
      const data = await res.json();
      const filteredTeachers = data.filter((user) => user.email.includes('staff'));
      const filteredStudents = data.filter((user) => user.email.includes('std'));

      const updatedTeachers = filteredTeachers.map(teacher => ({
        ...teacher,
        studentsHandled: Math.floor(Math.random() * 30) + 5,
        tasksAssigned: teacher.tasksAssigned || Math.floor(Math.random() * 10),
      }));

      setTeachers(updatedTeachers);
      setStudents(filteredStudents);
      localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
      localStorage.setItem('students', JSON.stringify(filteredStudents));
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalStorage = (teachersData) => {
    localStorage.setItem('teachers', JSON.stringify(teachersData));
  };

  const addTask = (teacherUsername) => {
    const updatedTeachers = teachers.map(teacher =>
      teacher.username === teacherUsername
        ? { ...teacher, tasksAssigned: teacher.tasksAssigned + 1 }
        : teacher
    );
    setTeachers(updatedTeachers);
    updateLocalStorage(updatedTeachers);
  };

  const openEditModal = (teacher) => {
    setEditModal({
      isOpen: true,
      teacher,
      taskCount: teacher.tasksAssigned
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      teacher: null,
      taskCount: 0
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editModal.teacher) {
      const updatedTeachers = teachers.map(t =>
        t.username === editModal.teacher.username
          ? { ...t, tasksAssigned: Number(editModal.taskCount) }
          : t
      );
      setTeachers(updatedTeachers);
      updateLocalStorage(updatedTeachers);
      closeEditModal();
    }
  };

  const resetData = () => {
    localStorage.removeItem('teachers');
    localStorage.removeItem('students');
    fetchUsers();
  };

  const recommendTeacher = () => {
    if (teachers.length === 0) return null;
    const bestTeacher = teachers.reduce((min, teacher) =>
      teacher.tasksAssigned < min.tasksAssigned ? teacher : min
    );
    return bestTeacher.username;
  };

  const openEmailClient = (teacherEmail) => {
    const subject = encodeURIComponent('Task Recommendation');
    const body = encodeURIComponent(`Dear ${teacherEmail},\n\nYou have been recommended for a new task: ${task}\n\nBest regards,\nAI Work Dashboard`);
    const mailtoLink = `mailto:${teacherEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const chartData = {
    labels: teachers.map((teacher) => teacher.username),
    datasets: [
      {
        label: 'Workload Distribution',
        data: teachers.map((teacher) => teacher.tasksAssigned),
        fill: false,
        borderColor: isDarkMode ? '#3b82f6' : '#2563eb',
        backgroundColor: isDarkMode ? '#1e40af' : '#93c5fd',
        tension: 0.3,
      },
    ],
  };

  const usersChartData = {
    labels: ['Teachers', 'Students'],
    datasets: [
      {
        label: 'User Distribution',
        data: [teachers.length, students.length],
        backgroundColor: isDarkMode ? ['#ec4899', '#3b82f6'] : ['#f472b6', '#60a5fa'],
        borderColor: isDarkMode ? ['#be185d', '#1d4ed8'] : ['#db2777', '#2563eb'],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: teachers.map((teacher) => teacher.username),
    datasets: [
      {
        label: 'Task Load',
        data: teachers.map((teacher) => teacher.tasksAssigned),
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.7)' : 'rgba(37, 99, 235, 0.7)',
        borderColor: isDarkMode ? '#3b82f6' : '#2563eb',
        borderWidth: 1,
      },
    ],
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#111827',
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        }
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">AI Work Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {lastUpdated || 'Never'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button
              onClick={resetData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FiRefreshCw className="w-5 h-5" />
              <span>Refresh Data</span>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <>
                  <FiSun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <FiMoon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : (
          <>
            {/* Task Recommendation Card */}
            <div className={`p-6 rounded-xl shadow-md mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiMail className="text-blue-500" />
                Task Recommendation
              </h2>
              
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter task details..."
                  className={`flex-grow px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                
                <button
                  onClick={() => openEmailClient(teachers[0]?.email)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiMail className="w-5 h-5" />
                  <span>Send Recommendation</span>
                </button>
              </div>
              
              {recommendTeacher() && (
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Recommended Teacher:</span> {recommendTeacher()}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div 
                onClick={() => navigate('/ai-schedule')}
                className={`p-6 rounded-xl shadow-md cursor-pointer transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
              >
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <FiUsers className="text-green-500" />
                  Balance Workload
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Optimize and distribute tasks evenly among teachers
                </p>
              </div>
              
              <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <FiUsers className="text-purple-500" />
                  Teachers
                </h3>
                <p className="text-2xl font-bold">{teachers.length}</p>
              </div>
              
              <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <FiUsers className="text-amber-500" />
                  Students
                </h3>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>

            {/* Teachers Table */}
            <div className={`p-6 rounded-xl shadow-md mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Teachers Workload</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="py-3 px-4 text-left rounded-tl-lg">Teacher</th>
                      <th className="py-3 px-4 text-left">Tasks</th>
                      <th className="py-3 px-4 text-left">Students</th>
                      <th className="py-3 px-4 text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher, index) => (
                      <tr 
                        key={teacher.username} 
                        className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${index === teachers.length - 1 ? 'rounded-b-lg' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{teacher.username}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${teacher.tasksAssigned > 8 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : teacher.tasksAssigned > 5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                            {teacher.tasksAssigned} tasks
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {teacher.studentsHandled} students
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => addTask(teacher.username)}
                              className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                              title="Add Task"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(teacher)}
                              className="p-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                              title="Edit Tasks"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* User Distribution Chart */}
              <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <FiPieChart className="text-purple-500" />
                  <h3 className="text-lg font-medium">User Distribution</h3>
                </div>
                <div className="h-64">
                  <Doughnut 
                    data={usersChartData} 
                    options={chartOptions}
                  />
                </div>
              </div>
              
              {/* Task Load Chart */}
              <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <FiBarChart2 className="text-blue-500" />
                  <h3 className="text-lg font-medium">Task Load Per Teacher</h3>
                </div>
                <div className="h-64">
                  <Bar 
                    data={barChartData} 
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
            
            {/* Workload Distribution Chart */}
            <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Workload Distribution Over Time</h3>
              <div className="h-80">
                <Line 
                  data={chartData} 
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Edit Task Modal */}
            {editModal.isOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className={`rounded-xl shadow-xl w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium">Edit Task Count</h3>
                    <button 
                      onClick={closeEditModal}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleEditSubmit} className="p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Teacher: {editModal.teacher?.username}
                      </label>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Current Tasks: {editModal.teacher?.tasksAssigned}
                      </label>
                      <input
                        type="number"
                        value={editModal.taskCount}
                        onChange={(e) => setEditModal({...editModal, taskCount: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AiWorkDashboard;