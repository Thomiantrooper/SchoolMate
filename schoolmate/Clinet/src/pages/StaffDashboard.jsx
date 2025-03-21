import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to get user from Redux
import StaffSidebar from "../components/StaffSidebar";
import StaffModule from "../components/StaffModule";
import StaffPayment from "../components/StaffPayment";
import StaffContact from "../components/StaffContact";

// A simple function to return the time of day greeting
const getTimeOfDayGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
};

// Mock data for weather (can be replaced with a real API call)
const weatherData = {
  location: "Colombo",
  temperature: "30°C",
  condition: "Sunny",
  icon: "☀️",  // Placeholder for a weather icon
};

export default function StaffDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user); // Fetch current user from Redux
  const [staffUser, setStaffUser] = useState(null);

  useEffect(() => {
    // Set the staff user from Redux store
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
      {/* Sidebar */}
      <div className="w-[250px] min-w-[250px] max-w-[250px] flex-shrink-0">
        <StaffSidebar />
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6 relative">
        {staffUser ? (
          <div className="text-center text-gray-800 dark:text-white">

            {/* Weather Forecast - Circular with Icon */}
            <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg flex flex-col items-center justify-center">
              <div className="text-4xl mb-2">{weatherData.icon}</div>
              <h3 className="text-xl font-semibold">{weatherData.location}</h3>
              <p className="text-lg">{weatherData.temperature}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{weatherData.condition}</p>
            </div>

            {/* Greeting */}
            <h2 className="text-3xl font-bold mb-4">
              {getTimeOfDayGreeting()}, {staffUser.username}!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 mb-6">
              Keep up the great work! Your contributions are highly valued.
            </p>

            {/* Staff Performance Dashboard */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Your Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-100 dark:bg-blue-700 p-4 rounded-lg text-center">
                  <p className="text-lg font-semibold">Completed Tasks</p>
                  <p className="text-2xl font-bold">25</p>
                </div>
                <div className="bg-green-100 dark:bg-green-700 p-4 rounded-lg text-center">
                  <p className="text-lg font-semibold">Ongoing Tasks</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-700 p-4 rounded-lg text-center">
                  <p className="text-lg font-semibold">Pending Tasks</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </div>

            {/* Task Progress Bar */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Task Progress</h3>
              <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-center mt-2">80% of your tasks are complete!</p>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="font-semibold">New Task Assigned</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">You have been assigned a new module to work on.</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="font-semibold">Upcoming Meeting</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">There is a meeting scheduled for tomorrow at 10:00 AM.</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="font-semibold">Payment Processed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Your payment has been successfully processed.</p>
                </div>
              </div>
            </div>

            {/* Conditional Rendering of Tabs */}
            <div className="mt-4">
              {tab === "home" && <StaffHome />}
              {tab === "module" && <StaffModule />}
              {tab === "payment" && <StaffPayment />}
              {tab === "contact" && <StaffContact />}
            </div>
          </div>
        ) : (
          <p>Loading staff data...</p>
        )}
      </div>
    </div>
  );
}
