import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaPlay, FaComment } from "react-icons/fa"; // Added FaComment for discussion
import { useNavigate } from "react-router-dom";

const modules = [
  {
    name: "Introduction to Programming",
    videos: [
      { title: "Week 1 - Basics", url: "https://youtu.be/bJzb-RuUcMU?si=DGTu7h4gzLxA_ged" },
      { title: "Week 2 - Variables & Data Types", url: "https://youtu.be/bJzb-RuUcMU?si=DGTu7h4gzLxA_ged" }
    ]
  },
  {
    name: "Mathematics for Computing",
    videos: [
      { title: "Week 1 - Algebra", url: "https://youtu.be/OmJ-4B-mS-Y?si=O2si1O3RZHFUc6YL" },
      { title: "Week 2 - Probability", url: "https://youtu.be/rkZzg7Vowao?si=0up1y83wA6DqmV0M" }
    ]
  },
  {
    name: "Database Fundamentals",
    videos: [
      { title: "Week 1 - SQL Basics", url: "https://youtube.com/shorts/ajdcdoQtxDI?si=uP3-4aVRVLK5xyCg" },
      { title: "Week 2 - Normalization", url: "https://youtu.be/qMAxQh6Xilo?si=afCMp2cCQ_n-n_rK" }
    ]
  }
];


const StudentLMS = () => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState({}); // Track progress for each video
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState(""); // Store the message for teacher

  // Fetch favorites and progress from localStorage on component mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const storedProgress = JSON.parse(localStorage.getItem("progress")) || {};
    setFavorites(storedFavorites);
    setProgress(storedProgress);
  }, []);

  // Update localStorage when favorites or progress are updated
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [favorites, progress]);

  const handleFavoriteToggle = (videoUrl) => {
    if (favorites.includes(videoUrl)) {
      setFavorites(favorites.filter((url) => url !== videoUrl));
    } else {
      setFavorites([...favorites, videoUrl]);
    }
  };

  const navigate = useNavigate();

  const handleProgressUpdate = (videoUrl) => {
    setProgress({ ...progress, [videoUrl]: true });
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleMessageSend = () => {
    const email = "kajanthankirubakaran@gmail.com"; // Replace with teacher's email address
    const subject = "Quick Message from Student";
    const body = `Student's Message:\n\n${message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMessage(""); // Clear message after sending
  };

  const filteredModules = modules.map((module) => ({
    ...module,
    videos: module.videos.filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(module => module.videos.length > 0);

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-center'} relative overflow-hidden`}>
      {/* Dark Mode Toggle */}
      <button onClick={handleDarkModeToggle} className="absolute top-4 right-4 text-xl p-2 bg-gray-800 text-white rounded-full shadow-lg">
        {darkMode ? '🌞' : '🌙'}
      </button>

      {/* Animated Background Elements */}
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5 }}
        className="absolute top-10 left-10 bg-white p-4 rounded-full shadow-lg opacity-30 w-20 h-20"></motion.div>
      <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 6 }}
        className="absolute bottom-20 right-16 bg-white p-6 rounded-full shadow-lg opacity-20 w-16 h-16"></motion.div>

      <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">📚 Learning Management System</h2>
      <p className="mt-2 text-white opacity-90">Access your lecture recordings, study materials, and assignments.</p>

      <input
        type="text"
        placeholder="Search videos..."
        className="mt-4 p-3 border rounded w-2/3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 relative"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{module.name}</h3>
            {module.videos.map((video, vidIndex) => (
              <div
                key={vidIndex}
                className={`mt-3 p-3 border rounded-lg flex justify-between items-center bg-gray-100 relative ${favorites.includes(video.url) ? "border-red-500" : ""}`}
              >
                <div className="flex items-center">
                  <FaPlay className="text-blue-500 mr-2" />
                  <p className="text-gray-700">{video.title}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Watch Button */}
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold hover:underline"
                    onClick={() => handleProgressUpdate(video.url)}
                  >
                    ▶ Watch
                  </a>

                  {/* Add to Favorites Button */}
                  <motion.div
                    className={`cursor-pointer ${favorites.includes(video.url) ? "text-red-600" : "text-gray-500"}`}
                    onClick={() => handleFavoriteToggle(video.url)}
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaHeart />
                  </motion.div>

                  {/* Message Icon for Quick Message to Teacher */}
                  <motion.div
                    className="cursor-pointer text-black"
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setMessage("")} // Clear message field when clicking
                  >
                    <FaComment />
                  </motion.div>
                </div>

                {/* Join Team Meeting Link */}
                <a
                  href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_OGM3NGI3ODYtMzE3ZS00NTkyLTk4NTgtZWU3MDQwZTFhNjcz%40thread.v2/0?context=%7b%22Tid%22%3a%2244e3cf94-19c9-4e32-96c3-14f5bf01391a%22%2c%22Oid%22%3a%22a81b2dd7-a800-439f-a04a-a23332de67ca%22%7d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-blue-600 font-bold hover:underline"
                >
                   Join Doubt Session
                </a>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Message to Teacher */}
      <div className="mt-8 flex flex-col items-center space-y-4">
  <div className="flex items-center space-x-4">
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Quickly message the teacher..."
      className="p-4 w-80 h-24 border rounded-lg shadow-md bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={handleMessageSend}
      className="p-3 bg-orange-600 text-white rounded-lg shadow-md"
    >
      Send Message to Teacher
    </button>
  </div>

  <button
    onClick={() => navigate("/library")} // Navigate to /library page
    className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-600 transition"
  >
    📖 Go to Library
  </button>
</div>


      <h3 className="mt-8 text-2xl font-semibold text-white">⭐ Starred Videos</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          module.videos
            .filter(video => favorites.includes(video.url)) // Only show starred videos
            .map((video, vidIndex) => (
              <motion.div
                key={vidIndex}
                className="bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 relative"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{module.name}</h3>
                <div className="mt-3 p-3 border rounded-lg flex justify-between items-center bg-gray-100">
                  <div className="flex items-center">
                    <FaPlay className="text-blue-500 mr-2" />
                    <p className="text-gray-700">{video.title}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Watch Button */}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline"
                    >
                      ▶ Watch
                    </a>

                    {/* Add to Favorites Button */}
                    <motion.div
                      className={`cursor-pointer ${favorites.includes(video.url) ? "text-red-600" : "text-gray-500"}`}
                      onClick={() => handleFavoriteToggle(video.url)}
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaHeart />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))
        ))}
      </div>
    </div>
  );
};

export default StudentLMS;
