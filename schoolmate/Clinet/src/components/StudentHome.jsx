import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "flowbite-react";
import { ThemeContext } from "./ThemeLayout"; 
import { useSelector } from "react-redux"; // Import useSelector to get currentUser

export default function StudentHome() {
  const { darkMode } = useContext(ThemeContext); 
  const { currentUser } = useSelector((state) => state.user); // Fetch currentUser from Redux
  const [studentName, setStudentName] = useState("Student");
  const [latestUpdates, setLatestUpdates] = useState([
    { id: 1, title: "📢 Exam Schedule Released", date: "March 10, 2025" },
    { id: 2, title: "🆕 New Courses Added", date: "March 5, 2025" },
    { id: 3, title: "📅 Parent-Teacher Meeting", date: "March 15, 2025" },
  ]);

  useEffect(() => {
    if (currentUser) {
      setStudentName(currentUser.username); // Set the username from Redux store
    }
  }, [currentUser]);

  return (
    <div className={`max-w-5xl mx-auto p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Welcome Section */}
      <motion.div
        className={`p-8 rounded-lg shadow-lg text-center ${
          darkMode ? "bg-gray-800 text-white" : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Welcome, {studentName}! 🎓</h1>
        <p className="mt-2 text-lg">Stay updated with the latest news and events.</p>
      </motion.div>

      {/* Latest Updates */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">📢 Latest Updates</h2>
        <div className="mt-4 space-y-3">
          {latestUpdates.map((update) => (
            <motion.div
              key={update.id}
              className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg">{update.title}</p>
              <span className="text-sm opacity-75">{update.date}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { title: "📖 Access LMS", link: "/student-page/student-portal?tab=LMS", color: darkMode ? "bg-blue-500" : "bg-blue-600" },
          { title: "📝 View Homework", link: "/student-page/student-portal?tab=homework-portal", color: darkMode ? "bg-green-500" : "bg-green-600" },
          { title: "📊 Check Exam Results", link: "#", color: darkMode ? "bg-yellow-500 text-gray-900" : "bg-yellow-500 text-gray-900" },
        ].map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            whileHover={{ scale: 1.05 }}
            className={`${item.color} p-5 rounded-lg shadow-md text-white font-semibold text-center`}
          >
            {item.title}
          </motion.a>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">📅 Upcoming Events</h2>
        <Card className={`mt-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <h3 className="text-xl font-semibold">Annual Sports Day</h3>
          <p className="opacity-75">March 25, 2025 - 9:00 AM</p>
          <Button color="blue">View Details</Button>
        </Card>
      </div>

      {/* Motivation Section */}
      <motion.div
        className={`mt-8 p-6 rounded-lg text-center shadow-lg ${
          darkMode ? "bg-gray-700 text-white" : "bg-purple-600 text-white"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="text-2xl font-bold">💡 Keep Learning & Growing!</h2>
        <p className="mt-2 opacity-85">"Education is the most powerful weapon which you can use to change the world." – Nelson Mandela</p>
      </motion.div>
    </div>
  );
}
