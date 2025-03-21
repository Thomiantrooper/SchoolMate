import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'flowbite-react';

const AiWorkDashboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/user/users');
      const data = await res.json();
      const filteredTeachers = data.filter((user) => user.email.includes('staff'));
      const filteredStudents = data.filter((user) => user.email.includes('std'));
      setTeachers(filteredTeachers);
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const chartData = {
    labels: teachers.map((teacher) => teacher.username),
    datasets: [
      {
        label: 'Workload Distribution',
        data: teachers.map((teacher) => teacher.tasksAssigned || Math.floor(Math.random() * 10)),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
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
        data: teachers.map((teacher) => teacher.tasksAssigned || Math.floor(Math.random() * 10)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      <h2 className="text-3xl font-bold mb-4 text-center">AI Work Dashboard</h2>

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

      <div className="workload-balance-btn mb-6 flex justify-center">
        <button
          onClick={() => navigate('/ai-schedule')}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300"
        >
          Balance Workload
        </button>
      </div>

      <div className="chatbot-btn flex items-center justify-center mt-4">
        <label>Dark Mode</label>
        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="ml-2" />
      </div>
    </div>
  );
};

export default AiWorkDashboard;
