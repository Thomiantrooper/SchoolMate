import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaPlay } from "react-icons/fa";  // Import icons

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

  // Fetch favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Update localStorage when favorites are updated
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteToggle = (videoUrl) => {
    if (favorites.includes(videoUrl)) {
      setFavorites(favorites.filter((url) => url !== videoUrl));
    } else {
      setFavorites([...favorites, videoUrl]);
    }
  };

  const filteredModules = modules.map((module) => ({
    ...module,
    videos: module.videos.filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(module => module.videos.length > 0);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-center relative overflow-hidden">
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
            ))}
          </motion.div>
        ))}
      </div>

      <h3 className="mt-8 text-2xl font-semibold text-white">⭐ Starred Videos</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          module.videos
            .filter(video => favorites.includes(video.url))  // Only show starred videos
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
