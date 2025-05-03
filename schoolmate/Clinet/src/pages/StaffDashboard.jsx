import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import StaffSidebar from "../components/StaffSidebar";
import StaffModule from "../components/StaffModule";
import StaffPayment from "../components/StaffPayment";
import StaffContact from "../components/StaffContact";
import StaffLeave from "../components/StaffLeave";
import { FiSun, FiCloud, FiCloudRain, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { BsCheckCircle, BsClock, BsExclamationCircle } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const getTimeOfDayGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
};

const weatherIcons = {
  sunny: <FiSun className="text-amber-400" />,
  rainy: <FiCloudRain className="text-blue-400" />,
  cloudy: <FiCloud className="text-gray-400" />
};

const weatherData = {
  location: "Colombo",
  temperature: "30°C",
  condition: "sunny",
};

export default function StaffDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [staffUser, setStaffUser] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setStaffUser(currentUser);
    }

    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [currentUser, location.search]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Refined Sidebar */}
      <div className="w-56 min-w-56 max-w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <StaffSidebar />
      </div>

      {/* Elegant Content Area */}
      <div className="flex-grow p-5 relative overflow-y-auto">
        {staffUser ? (
          <div className="text-gray-800 dark:text-gray-100 max-w-5xl mx-auto">
            {/* Sophisticated Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {getTimeOfDayGreeting()}, <span className="text-blue-600 dark:text-blue-400">{staffUser.username}</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              {/* Premium Weather Widget */}
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 mt-3 sm:mt-0">
                <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                  {weatherIcons[weatherData.condition] || weatherIcons.sunny}
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">{weatherData.temperature}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{weatherData.condition}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <MetricCard 
                title="Completed Tasks" 
                value="24" 
                icon={<BsCheckCircle className="text-emerald-500" />}
                progress={80}
                color="emerald"
              />
              <MetricCard 
                title="Ongoing Tasks" 
                value="5" 
                icon={<BsClock className="text-blue-500" />}
                progress={20}
                color="blue"
              />
              <MetricCard 
                title="Pending Tasks" 
                value="3" 
                icon={<BsExclamationCircle className="text-amber-500" />}
                progress={10}
                color="amber"
              />
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Task Progress */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                    <FiTrendingUp className="inline mr-2 text-blue-500" />
                    Task Progress
                  </h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400">This Week</span>
                </div>
                <div className="space-y-4">
                  <ProgressItem title="Module Development" progress={80} color="blue" />
                  <ProgressItem title="Student Assessments" progress={65} color="purple" />
                  <ProgressItem title="Research Work" progress={45} color="green" />
                  <ProgressItem title="Administration" progress={30} color="amber" />
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                    <IoMdNotificationsOutline className="inline mr-2 text-blue-500" />
                    Notifications
                  </h2>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">3 New</span>
                </div>
                <div className="space-y-3">
                  <NotificationItem 
                    icon={<IoMdNotificationsOutline className="text-blue-500" />}
                    title="New Task Assigned"
                    description="You've been assigned to teach CS101"
                    time="2h ago"
                  />
                  <NotificationItem 
                    icon={<FiCalendar className="text-purple-500" />}
                    title="Upcoming Meeting"
                    description="Faculty meeting tomorrow"
                    time="5h ago"
                  />
                  <NotificationItem 
                    icon={<RiMoneyDollarCircleLine className="text-emerald-500" />}
                    title="Payment Processed"
                    description="Salary for this month"
                    time="1d ago"
                  />
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="mt-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                <FiCalendar className="inline mr-2 text-blue-500" />
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <EventItem 
                  title="Faculty Meeting"
                  date="Tomorrow, 10:00 AM"
                  color="blue"
                />
                <EventItem 
                  title="Student Presentations"
                  date="Friday, 2:00 PM"
                  color="purple"
                />
                <EventItem 
                  title="Semester Review"
                  date="Jun 15, 9:00 AM"
                  color="green"
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {tab === "home" && <StaffHome />}
              {tab === "module" && <StaffModule />}
              {tab === "payment" && <StaffPayment />}
              {tab === "contact" && <StaffContact />}
              {tab === "staff-leave" && <StaffLeave />}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon, progress, color }) => {
  const colorClasses = {
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color].bg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full">
        <div 
          className={`h-1.5 rounded-full ${colorClasses[color].bg}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Reusable Progress Item Component
const ProgressItem = ({ title, progress, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-700 dark:text-gray-300">{title}</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full">
        <div 
          className={`h-1.5 rounded-full ${colorClasses[color]}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Reusable Notification Item Component
const NotificationItem = ({ icon, title, description, time }) => {
  return (
    <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{description}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

// Reusable Event Item Component
const EventItem = ({ title, date, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
    green: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
  };

  return (
    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs mt-1">{date}</p>
    </div>
  );
};