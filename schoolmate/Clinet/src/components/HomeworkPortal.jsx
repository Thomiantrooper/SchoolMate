import React, { useState } from 'react';

export default function HomeworkPortal() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showNotification, setShowNotification] = useState(true);

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
    setUploadSuccess(false);
  };

  const handleUpload = () => {
    if (uploadedFile) {
      // Fake upload success after a timeout
      setTimeout(() => {
        setUploadSuccess(true);
        setUploadedFile(null);
      }, 1000);
    }
  };

  const assignments = [
    { title: "Math Homework", due: "March 10", details: "Complete exercises 1-10 on page 23." },
    { title: "Science Project", due: "March 15", details: "Build a simple circuit model." },
    { title: "History Essay", due: "March 18", details: "Write about World War II events." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-purple-100 p-6 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl text-gray-900 transition-all duration-300">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-indigo-700 mb-2 animate-pulse">
          📖 Homework Portal
        </h2>
        <p className="text-gray-700 mb-6">
          Welcome to the Homework Portal. View assignments, submit homework, and track your progress.
        </p>

        {/* Upcoming Assignments */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold border-b-2 pb-2 text-gray-800 mb-4">Upcoming Assignments</h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {assignments.map((assignment, index) => (
              <li 
                key={index}
                className="bg-blue-100 p-4 rounded-lg cursor-pointer hover:bg-blue-200 transition"
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div className="text-lg font-medium">{assignment.title}</div>
                <div className="text-sm text-gray-600">Due: {assignment.due}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal for Assignment Details */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
            <div className="bg-white rounded-xl p-6 w-80 shadow-xl relative">
              <button 
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedAssignment(null)}
              >
                ✖
              </button>
              <h4 className="text-xl font-semibold mb-2">{selectedAssignment.title}</h4>
              <p className="text-gray-700 mb-4">{selectedAssignment.details}</p>
              <div className="text-sm text-gray-500">Due Date: {selectedAssignment.due}</div>
            </div>
          </div>
        )}

        {/* Submit Homework */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold border-b-2 pb-2 text-gray-800 mb-4">Submit Your Homework</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input 
              type="file" 
              className="border p-2 rounded w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
              onChange={handleFileChange} 
            />
            <button 
              onClick={handleUpload}
              className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600 active:scale-95 transition"
            >
              Upload
            </button>
          </div>
          {uploadedFile && (
            <p className="text-green-600 mt-2 animate-fadeIn">File selected: {uploadedFile.name}</p>
          )}
          {uploadSuccess && (
            <div className="mt-4 text-green-700 bg-green-100 p-3 rounded-lg animate-bounce">
              🎉 Upload Successful!
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold border-b-2 pb-2 text-gray-800 mb-4">Progress Tracker</h3>
          <ul className="space-y-4">
            <li className="bg-green-100 p-4 rounded-lg flex items-center gap-3">
              ✅ Math Homework
              <div className="flex-1 bg-green-300 h-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full w-full"></div>
              </div>
            </li>
            <li className="bg-yellow-100 p-4 rounded-lg flex items-center gap-3">
              ⏳ Science Project
              <div className="flex-1 bg-yellow-300 h-2 rounded-full">
                <div className="bg-yellow-500 h-2 rounded-full w-1/2"></div>
              </div>
            </li>
            <li className="bg-red-100 p-4 rounded-lg flex items-center gap-3">
              ❌ History Essay
              <div className="flex-1 bg-red-300 h-2 rounded-full">
                <div className="bg-red-500 h-2 rounded-full w-1/4"></div>
              </div>
            </li>
          </ul>
        </div>

        {/* Notifications */}
        {showNotification && (
          <div className="bg-yellow-200 p-4 rounded-lg flex items-center justify-between animate-slideIn">
            <span>⚠️ Reminder: Science Project is due in 3 days!</span>
            <button 
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setShowNotification(false)}
            >
              ✖
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
