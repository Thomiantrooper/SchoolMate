import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, Badge, Spinner, Alert } from "flowbite-react";
import { ThemeContext } from "./ThemeLayout";
import { useSelector } from "react-redux";
import {
  FiBook, FiCalendar, FiAward, FiClipboard,
  FiBarChart2, FiBell, FiUser, FiChevronRight
} from "react-icons/fi";

export default function StudentHome() {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser } = useSelector((state) => state.user);
  const [studentName, setStudentName] = useState("Student");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("updates");

  const [latestUpdates] = useState([
    {
      id: 1,
      title: "Exam Schedule Released",
      date: "March 10, 2025",
      icon: <FiClipboard className="text-blue-500" />,
      category: "Academic",
      priority: "high",
      description: "Final exam schedule for all subjects has been published.",
    },
    {
      id: 2,
      title: "New Courses Added",
      date: "March 5, 2025",
      icon: <FiBook className="text-green-500" />,
      category: "Academic",
      priority: "medium",
      description: "Three new elective courses available for next semester.",
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      date: "March 15, 2025",
      icon: <FiUser className="text-purple-500" />,
      category: "Event",
      priority: "high",
      description: "Schedule your meeting slot with teachers through the portal.",
    },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "Annual Sports Day",
      date: "March 25, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "School Ground",
      description: "Participate in various sports activities and win prizes!",
      registered: true,
    },
    {
      id: 2,
      title: "Science Fair",
      date: "April 5, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Science Block",
      description: "Showcase your science projects and innovations.",
      registered: false,
    },
  ]);

  useEffect(() => {
    if (currentUser) {
      setStudentName(currentUser.username);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [currentUser]);

  const registerForEvent = (eventId) => {
    setUpcomingEvents((events) =>
      events.map((event) =>
        event.id === eventId ? { ...event, registered: !event.registered } : event
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Welcome Banner */}
        <motion.div
          className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <FiUser className="hidden md:block" />
                Welcome back, {studentName}!
              </h1>
              <p className="mt-1 text-sm md:text-base">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <Badge color={darkMode ? "gray" : "light"} className="mt-2 md:mt-0">
              <FiBell className="mr-1" />
              {latestUpdates.length} new updates
            </Badge>
          </div>
        </motion.div>

        {error && (
          <Alert color="failure" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {["updates", "events"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium text-sm md:text-base ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "updates" && (
            <motion.div
              key="updates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <FiBell className="text-blue-500" />
                Latest Updates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestUpdates.map((update) => (
                  <motion.div
                    key={update.id}
                    className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`p-4 ${
                      update.priority === "high"
                        ? "border-l-4 border-red-500"
                        : update.priority === "medium"
                        ? "border-l-4 border-yellow-500"
                        : "border-l-4 border-blue-500"
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{update.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{update.title}</h3>
                            <Badge color="gray" size="xs">{update.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{update.date}</p>
                          <p className="mt-2 text-sm">{update.description}</p>
                        </div>
                      </div>
                      <Button color="light" size="xs" className="mt-3 w-full">
                        View Details <FiChevronRight className="ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <FiCalendar className="text-purple-500" />
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {event.date} • {event.time}
                          </p>
                          <p className="text-sm mt-2">{event.description}</p>
                          <p className="text-xs mt-1">
                            <span className="font-medium">Location:</span> {event.location}
                          </p>
                        </div>
                        <Button
                          size="xs"
                          color={event.registered ? "success" : "gray"}
                          onClick={() => registerForEvent(event.id)}
                        >
                          {event.registered ? "Registered" : "Register"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Achievements */}
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiAward className="text-yellow-500" />
            Your Recent Achievements
          </h2>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <FiAward className="text-yellow-500 dark:text-yellow-300" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Top Performer in Mathematics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Awarded for scoring 98% in the mid-term exams
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation */}
        <motion.div
          className={`mt-10 p-6 rounded-xl text-center ${
            darkMode ? "bg-gray-800" : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FiAward className="mx-auto text-3xl mb-3" />
          <h2 className="text-xl font-bold">Daily Motivation</h2>
          <p className="mt-2 opacity-90">
            "Education is not preparation for life; education is life itself." — John Dewey
          </p>
        </motion.div>
      </div>
    </div>
  );
}
