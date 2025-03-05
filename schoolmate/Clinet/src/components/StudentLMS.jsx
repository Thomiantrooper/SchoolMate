import React, { useState } from "react";

const modules = [
  {
    name: "Introduction to Programming",
    videos: [
      { title: "Week 1 - Basics", url: "https://www.example.com/video1.mp4" },
      { title: "Week 2 - Variables & Data Types", url: "https://www.example.com/video2.mp4" }
    ]
  },
  {
    name: "Mathematics for Computing",
    videos: [
      { title: "Week 1 - Algebra", url: "https://www.example.com/video3.mp4" },
      { title: "Week 2 - Probability", url: "https://www.example.com/video4.mp4" }
    ]
  },
  {
    name: "Database Fundamentals",
    videos: [
      { title: "Week 1 - SQL Basics", url: "https://www.example.com/video5.mp4" },
      { title: "Week 2 - Normalization", url: "https://www.example.com/video6.mp4" }
    ]
  }
];

export default function StudentLMS() {
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredModules = modules.map((module) => ({
    ...module,
    videos: module.videos.filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(module => module.videos.length > 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-center">
      <h2 className="text-2xl font-bold text-purple-600">📚 Learning Management System</h2>
      <p className="mt-2">Access your previous lecture recordings, study materials, and assignments.</p>
      
      <input
        type="text"
        placeholder="Search videos..."
        className="mt-4 p-2 border rounded w-2/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded">
            <h3 className="text-lg font-semibold">{module.name}</h3>
            {module.videos.map((video, vidIndex) => (
              <div key={vidIndex} className="mt-2 p-2 border rounded flex justify-between items-center">
                <p>{video.title}</p>
                <div>
                  <button className="text-blue-500 mr-2" onClick={() => setSelectedVideo(video.url)}>▶ Watch</button>
                  <a href={video.url} download className="text-green-500">⬇ Download</a>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full text-center relative">
            <button className="absolute top-2 right-4 text-xl" onClick={() => setSelectedVideo(null)}>✖</button>
            <video controls className="w-full rounded-lg">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      
      {/* Microsoft Teams Call Button */}
      <div className="mt-8 p-4 bg-blue-500 text-white rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold">Need Help? Contact a Teacher</h3>
        <p className="opacity-80">Join a live session with a teacher on Microsoft Teams.</p>
        <a href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_OGM3NGI3ODYtMzE3ZS00NTkyLTk4NTgtZWU3MDQwZTFhNjcz%40thread.v2/0?context=%7b%22Tid%22%3a%2244e3cf94-19c9-4e32-96c3-14f5bf01391a%22%2c%22Oid%22%3a%22a81b2dd7-a800-439f-a04a-a23332de67ca%22%7d" target="_blank" 
        rel="noopener noreferrer" className="mt-2 inline-block bg-white text-blue-500 px-4 py-2 rounded shadow-md">Join Teams Call</a>
      </div>
    </div>
  );
}
