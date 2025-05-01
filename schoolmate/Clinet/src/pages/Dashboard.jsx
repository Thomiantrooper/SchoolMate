import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashSettings from '../components/DashSettings';
import DashHome from '../components/DashHome';
import DashStudents from '../components/DashStudents';
import DashFinance from '../components/DashFinance';
import DashAcademy from '../components/DashAcademy';
import DashStaff from '../components/DashStaff';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl);

    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState) setSidebarOpen(JSON.parse(savedSidebarState));

    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) setTasks(savedTasks);

    const savedNotifications = JSON.parse(localStorage.getItem('notifications'));
    if (savedNotifications) setNotifications(savedNotifications);
  }, [location.search]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    localStorage.setItem('sidebarState', JSON.stringify(!isSidebarOpen));
  };

  const chartData = {
    labels: ['Pending Tasks', 'Completed Tasks'],
    datasets: [
      {
        label: 'Task Status',
        data: [
          tasks.filter(task => task.status === 'pending').length,
          tasks.filter(task => task.status === 'completed').length,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 text-black">
      <div className={`md:w-56 bg-gray-800 text-white ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
        <DashSidebar setTab={setTab} />
      </div>

      <div className="flex-1 p-4">
        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Admin-Dashboard</h2>
          <div className="flex items-center space-x-4 relative">
            <button onClick={toggleSidebar} className="md:hidden text-gray-800">
              <span className="material-icons">menu</span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-700 relative"
              >
                <span className="material-icons">notifications</span>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs px-1.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((note, index) => (
                        <li
                          key={index}
                          className="p-3 text-sm border-b hover:bg-gray-100 text-gray-700"
                        >
                          {note.message}
                        </li>
                      ))
                    ) : (
                      <li className="p-3 text-sm text-gray-500">No notifications</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Image */}
            <button className="bg-gray-300 rounded-full p-1.5">
              <img src="/profile1.png" alt="Profile" className="rounded-full w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Centered Welcome Message */}
        {!tab && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome to the Dashboard!</h2>
            <p className="text-gray-600 mt-2">
              Here you can manage your tasks, view your profile, and access other features.
            </p>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setTab('home')}
              >
                Go to Home
              </button>
            </div>
          </div>
        )}

        {/* Task Chart */}
        {!tab && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Task Status Overview</h3>
            <div className="w-full h-64">
              <Bar data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        )}

        {/* Tab Content */}
        {tab === 'home' && <DashHome />}
        {tab === 'profile' && <DashProfile />}
        {tab === 'settings' && <DashSettings />}
        {tab === 'students' && <DashStudents />}
        {tab === 'finance' && <DashFinance />}
        {tab === 'academy' && <DashAcademy />}
        {tab === 'staff' && <DashStaff />}
      </div>
    </div>
  );
}
