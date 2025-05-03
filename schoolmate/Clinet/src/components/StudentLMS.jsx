import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaPlay,
  FaComment,
  FaStar,
  FaSearch,
  FaBookOpen,
  FaMoon,
  FaSun,
  FaCheck,
  FaBookmark,
  FaChalkboardTeacher
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    name: "Introduction to Programming",
    description: "Learn the fundamentals of programming concepts and logic",
    icon: "💻",
    videos: [
      {
        title: "Week 1 - Basics",
        description: "Introduction to programming concepts and environment setup",
        duration: "15:30",
        url: "https://youtu.be/bJzb-RuUcMU?si=DGTu7h4gzLxA_ged"
      },
      {
        title: "Week 2 - Variables & Data Types",
        description: "Understanding variables, data types and basic operations",
        duration: "22:45",
        url: "https://youtu.be/bJzb-RuUcMU?si=DGTu7h4gzLxA_ged"
      }
    ]
  },
  {
    name: "Mathematics for Computing",
    description: "Essential mathematical concepts for computer science",
    icon: "🧮",
    videos: [
      {
        title: "Week 1 - Algebra",
        description: "Linear equations, functions and mathematical notation",
        duration: "18:20",
        url: "https://youtu.be/OmJ-4B-mS-Y?si=O2si1O3RZHFUc6YL"
      },
      {
        title: "Week 2 - Probability",
        description: "Basic probability theory and statistical concepts",
        duration: "25:10",
        url: "https://youtu.be/rkZzg7Vowao?si=0up1y83wA6DqmV0M"
      }
    ]
  },
  {
    name: "Database Fundamentals",
    description: "Introduction to database systems and SQL",
    icon: "🗃️",
    videos: [
      {
        title: "Week 1 - SQL Basics",
        description: "Creating tables, basic queries and database design",
        duration: "20:15",
        url: "https://youtube.com/shorts/ajdcdoQtxDI?si=uP3-4aVRVLK5xyCg"
      },
      {
        title: "Week 2 - Normalization",
        description: "Database normalization techniques and best practices",
        duration: "28:30",
        url: "https://youtu.be/qMAxQh6Xilo?si=afCMp2cCQ_n-n_rK"
      }
    ]
  }
];

const StudentLMS = () => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedModule, setExpandedModule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const storedProgress = JSON.parse(localStorage.getItem("progress")) || {};
    setFavorites(storedFavorites);
    setProgress(storedProgress);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [favorites, progress]);

  const handleFavoriteToggle = (videoUrl) => {
    setFavorites((prev) =>
      prev.includes(videoUrl)
        ? prev.filter((url) => url !== videoUrl)
        : [...prev, videoUrl]
    );
  };

  const handleProgressUpdate = (videoUrl) => {
    setProgress((prev) => ({ ...prev, [videoUrl]: true }));
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleMessageSend = () => {
    const email = "kajanthankirubakaran@gmail.com";
    const subject = "Quick Message from Student";
    const body = `Student's Message:\n\n${message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setMessage("");
  };

  const toggleModuleExpand = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const handleJoinSession = (link) => {
    // Open Teams session in new tab
    window.open(link, "_blank");
  
    // Trigger email client with session link
    const email = "kajanthankirubakaran@gmail.com";
    const subject = "Joining LMS Session";
    const body = `Dear Lecturer,\n\nI have joined the LMS session using the following Microsoft Teams link:\n${link}\n\nRegards,\n[Your Name]`;
  
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => window.open(mailtoLink, "_blank"), 300);
  };
  
  const filteredModules = modules
    .map((module) => ({
      ...module,
      videos: module.videos.filter((video) =>
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase()) ||
        module.name.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter((module) => module.videos.length > 0);

  const starredVideos = filteredModules.flatMap((module) => {
    return module.videos
      .filter((video) => favorites.includes(video.url))
      .map((video) => ({ ...video, moduleName: module.name, moduleIcon: module.icon }));
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white"
      }`}
    >
      {/* Header */}
      <div className="relative py-8 px-6 max-w-7xl mx-auto">
        <button
          onClick={handleDarkModeToggle}
          className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ${
            darkMode
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex justify-center items-center gap-3">
            <FaBookOpen className="text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Learning Management System
            </span>
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Access your course materials, lecture recordings, and learning resources
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="mt-8 max-w-3xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos, modules, or descriptions..."
              className="w-full pl-12 pr-4 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center my-6 max-w-7xl mx-auto">
        <div className="flex space-x-1 bg-gray-800 bg-opacity-60 p-1 rounded-full">
          {["all", "starred"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab === "all" ? (
                <>
                  <FaBookOpen size={14} /> All Videos
                </>
              ) : (
                <>
                  <FaStar size={14} /> Starred Videos
                </>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "all" ? (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredModules.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${
                    darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm"
                  }`}
                >
                  <div 
                    className="p-5 border-b border-gray-700 cursor-pointer"
                    onClick={() => toggleModuleExpand(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{module.name}</h3>
                        <p className="text-sm opacity-80 mt-1">{module.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedModule === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 space-y-3"
                      >
                        {module.videos.map((video, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-lg space-y-2 transition-all ${
                              darkMode ? "bg-gray-700 hover:bg-gray-650" : "bg-white bg-opacity-20 hover:bg-opacity-30"
                            } ${favorites.includes(video.url) ? "border-l-4 border-yellow-400" : ""}`}
                          >
                            <div className="flex justify-between">
                              <div className="flex gap-3">
                                <div
                                  className={`p-2 rounded-full flex-shrink-0 ${
                                    progress[video.url] ? "bg-green-500" : "bg-blue-500"
                                  } text-white`}
                                >
                                  {progress[video.url] ? <FaCheck size={12} /> : <FaPlay size={12} />}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{video.title}</h4>
                                  <p className="text-sm opacity-80 mt-1">{video.description}</p>
                                  <div className="flex items-center gap-2 mt-2 text-xs">
                                    <span className={`px-2 py-1 rounded ${
                                      darkMode ? "bg-gray-600" : "bg-white bg-opacity-30"
                                    }`}>
                                      {video.duration}
                                    </span>
                                    {progress[video.url] && (
                                      <span className={`px-2 py-1 rounded flex items-center gap-1 ${
                                        darkMode ? "bg-green-900 text-green-200" : "bg-green-200 text-green-900"
                                      }`}>
                                        <FaCheck size={10} /> Watched
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFavoriteToggle(video.url);
                                }}
                                className={`text-xl self-start transition-colors ${
                                  favorites.includes(video.url)
                                    ? "text-yellow-400 hover:text-yellow-500"
                                    : "text-gray-400 hover:text-gray-300"
                                }`}
                                aria-label={favorites.includes(video.url) ? "Remove from favorites" : "Add to favorites"}
                              >
                                <FaHeart />
                              </button>
                            </div>
                            <div className="flex justify-between mt-3">
                              <motion.a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2"
                                onClick={() => handleProgressUpdate(video.url)}
                              >
                                <FaPlay size={12} /> Watch
                              </motion.a>
                              <motion.a
                                href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_OGM3NGI3ODYt..."
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center gap-2"
                              >
                                <FaChalkboardTeacher size={12} /> Join Session
                              </motion.a>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="starred"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {starredVideos.length > 0 ? (
                starredVideos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-xl shadow-xl overflow-hidden ${
                      darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm"
                    }`}
                  >
                    <div className="p-5 border-b border-gray-700 flex items-center gap-3">
                      <div className="text-2xl p-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                        {video.moduleIcon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{video.moduleName}</h3>
                        <div className="flex items-center gap-2 text-yellow-400 text-sm mt-1">
                          <FaStar size={12} /> Starred
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div
                        className={`p-4 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-white bg-opacity-20"
                        } border-l-4 border-yellow-400`}
                      >
                        <div className="flex justify-between">
                          <div className="flex gap-3">
                            <div
                              className={`p-2 rounded-full flex-shrink-0 ${
                                progress[video.url] ? "bg-green-500" : "bg-blue-500"
                              } text-white`}
                            >
                              {progress[video.url] ? <FaCheck size={12} /> : <FaPlay size={12} />}
                            </div>
                            <div>
                              <h4 className="font-semibold">{video.title}</h4>
                              <p className="text-sm opacity-80 mt-1">{video.description}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs">
                                <span className={`px-2 py-1 rounded ${
                                  darkMode ? "bg-gray-600" : "bg-white bg-opacity-30"
                                }`}>
                                  {video.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleFavoriteToggle(video.url)}
                            className="text-yellow-400 hover:text-yellow-300 text-xl self-start"
                            aria-label="Remove from favorites"
                          >
                            <FaHeart />
                          </button>
                        </div>
                        <div className="flex justify-between mt-3">
                          <motion.a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2"
                            onClick={() => handleProgressUpdate(video.url)}
                          >
                            <FaPlay size={12} /> Watch
                          </motion.a>
                          <motion.a
                            href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_OGM3NGI3ODYt..."
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center gap-2"
                          >
                            <FaChalkboardTeacher size={12} /> Join Session
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <div className="inline-block p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-4">
                    <FaBookmark size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Starred Videos Yet</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Click the heart icon on any video to add it to your favorites
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Box */}
        <motion.div 
          className="mt-12 max-w-3xl mx-auto p-6 rounded-xl shadow-lg"
          style={{ background: darkMode ? '#2e2e2e' : '#ffffff10' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <FaComment size={18} />
            </div>
            <span>Message Your Teacher</span>
          </h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question or message here..."
            className={`w-full p-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'
            }`}
            rows="4"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <motion.button
              onClick={handleMessageSend}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={!message.trim()}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center ${
                message.trim()
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  : darkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaComment /> Send Message
            </motion.button>
            <motion.button
              onClick={() => navigate("/library")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
            >
              <FaBookOpen /> Go to Library
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLMS;