import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'; // Import for chart.js auto registration

const WorkloadBalancing = () => {
  const [teachers, setTeachers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workload, setWorkload] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch teachers and tasks on component mount
    fetchTeachers();
    fetchTasks();
  }, []);

  // Fetch teacher data
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers');  // API to get teachers data
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teachers", error);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');  // API to get tasks
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  // Function to trigger the workload balancing
  const handleWorkloadBalance = async () => {
    try {
      const response = await axios.post('/api/workload/balance', { teachers, tasks });
      setWorkload(response.data);  // Assuming API will return balanced workload
    } catch (error) {
      console.error("Error balancing workload", error);
    }
  };

  // Sample chart data based on the current workload
  const chartData = {
    labels: teachers.map(teacher => teacher.name),
    datasets: [
      {
        label: 'Workload Distribution',
        data: teachers.map(teacher => workload[teacher.id] || 0),  // Number of tasks assigned to each teacher
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="workload-balancing-container p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Workload Balancer</h2>
      
      <div className="teacher-list mb-6">
        <h3 className="text-2xl">Teachers</h3>
        <ul className="list-disc pl-4">
          {loading ? (
            <p>Loading teachers...</p>
          ) : (
            teachers.map((teacher) => (
              <li key={teacher.id} className="mb-2">
                <span>{teacher.name}</span> - <span>{workload[teacher.id] || 0} Tasks</span>
              </li>
            ))
          )}
        </ul>
      </div>
      
      <div className="task-list mb-6">
        <h3 className="text-2xl">Tasks</h3>
        <ul className="list-disc pl-4">
          {tasks.map((task) => (
            <li key={task.id} className="mb-2">{task.title}</li>
          ))}
        </ul>
      </div>

      <div className="workload-chart mb-6">
        <h3 className="text-2xl">Workload Distribution</h3>
        <Line data={chartData} />
      </div>

      <div className="workload-balance-btn mt-4">
        <button
          onClick={handleWorkloadBalance}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Balance Workload
        </button>
      </div>
    </div>
  );
};

export default WorkloadBalancing;
