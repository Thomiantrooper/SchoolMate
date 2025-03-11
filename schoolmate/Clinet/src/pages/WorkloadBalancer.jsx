import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { AiOutlineMessage } from 'react-icons/ai'; // Chatbot Icon
import { Link } from 'react-router-dom'; // For navigation to chatbot

const WorkloadBalancing = () => {
  // Dummy Data for teachers
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'John Doe', tasksAssigned: 5 },
    { id: 2, name: 'Jane Smith', tasksAssigned: 3 },
    { id: 3, name: 'Michael Johnson', tasksAssigned: 7 },
    { id: 4, name: 'Emily Davis', tasksAssigned: 4 },
    { id: 5, name: 'David Brown', tasksAssigned: 6 },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1' },
    { id: 2, title: 'Task 2' },
    { id: 3, title: 'Task 3' },
    { id: 4, title: 'Task 4' },
    { id: 5, title: 'Task 5' },
  ]);

  const [workload, setWorkload] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const chartData = {
    labels: teachers.map(teacher => teacher.name),
    datasets: [
      {
        label: 'Workload Distribution',
        data: teachers.map(teacher => teacher.tasksAssigned),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleWorkloadBalance = () => {
    // Logic for balancing workload would be here (mocked for now)
    setWorkload({
      1: 5,
      2: 3,
      3: 7,
      4: 4,
      5: 6,
    });
  };

  return (
    <div className={`workload-balancing-container p-6 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-3xl font-bold mb-4 animate__animated animate__fadeIn">Workload Balancer</h2>

      {/* Teacher Table */}
      <div className="teacher-list mb-6">
        <h3 className="text-2xl mb-2">Teachers</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Tasks Assigned</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{teacher.name}</td>
                <td className="py-2 px-4">{teacher.tasksAssigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workload Chart */}
      <div className="workload-chart mb-6">
        <h3 className="text-2xl mb-2">Workload Distribution</h3>
        <Line data={chartData} />
      </div>

      {/* Button to Balance Workload */}
      <div className="workload-balance-btn mb-6">
        <button
          onClick={handleWorkloadBalance}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300"
        >
          Balance Workload
        </button>
      </div>

      {/* Chatbot Button */}
      <div className="chatbot-btn flex items-center justify-between mt-4">
        
        <div className="ml-4">
          <label>Dark Mode</label>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className="ml-2"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkloadBalancing;
