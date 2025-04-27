import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import emailjs from 'emailjs-com';

const AiWorkDashboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [task, setTask] = useState(""); // Task details

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

  const editTask = (teacherUsername, newTaskCount) => {
    const updatedTeachers = teachers.map(teacher =>
      teacher.username === teacherUsername
        ? { ...teacher, tasksAssigned: Number(newTaskCount) }
        : teacher
    );
    setTeachers(updatedTeachers);
    updateLocalStorage(updatedTeachers);
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
        borderColor: 'rgba(75,192,192,1)',
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
        backgroundColor: ['#ff6384', '#36a2eb'],
      },
    ],
  };

  const barChartData = {
    labels: teachers.map((teacher) => teacher.username),
    datasets: [
      {
        label: 'Task Load',
        data: teachers.map((teacher) => teacher.tasksAssigned),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const topTeachers = [...teachers]
    .sort((a, b) => b.tasksAssigned - a.tasksAssigned)
    .slice(0, 3);

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">AI Work Dashboard</h2>
        <div className="flex gap-4 items-center">
          <button
            onClick={resetData}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-all"
          >
            Reset Data
          </button>
          <div className="flex items-center">
            <span className="mr-2 text-sm">Dark Mode</span>
            <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-center">User Distribution</h3>
              <Doughnut data={usersChartData} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-center">Task Load Per Teacher</h3>
              <Bar data={barChartData} />
            </div>
          </div>

          <div className="workload-chart mb-6 mt-6">
            <h3 className="text-2xl mb-2 text-center">Workload Distribution</h3>
            <Line data={chartData} />
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Top 3 Teachers (by Workload)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden shadow-md">
                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <tr>
                    <th className="py-2 px-4">Username</th>
                    <th className="py-2 px-4">Tasks Assigned</th>
                    <th className="py-2 px-4">Students Handled</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.username} className="text-center">
                      <td className="py-2 px-4">{teacher.username}</td>
                      <td className="py-2 px-4">{teacher.tasksAssigned}</td>
                      <td className="py-2 px-4">{teacher.studentsHandled}</td>
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-xs"
                          onClick={() => addTask(teacher.username)}
                        >
                          + Task
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded text-xs"
                          onClick={() => {
                            const newTask = prompt('Enter new task count:');
                            if (newTask !== null) editTask(teacher.username, newTask);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 text-center text-green-500 font-semibold">
            Recommended Teacher for New Task: <span className="underline">{recommendTeacher()}</span>
          </div>

          <div className="mt-6 text-sm text-center text-gray-500">
            Last Updated: {lastUpdated}
          </div>

          <div className="mt-4 flex justify-center items-center">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task details"
              className="p-2 rounded border"
            />
            <button
              onClick={() => openEmailClient(teachers[0]?.email)} // Open email client for the first teacher
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 ml-2 rounded"
            >
              Open Email Client with Task Recommendation
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AiWorkDashboard;
