import React, { useState } from 'react';

export default function HomeworkPortal() {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl text-gray-900">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          📖 Homework Portal
        </h2>
        <p className="text-gray-700 mt-2">
          Welcome to the Homework Portal. Here, you can view assignments, submit homework, and track your progress.
        </p>

        {/* Upcoming Assignments */}
        <div className="mt-6">
          <h3 className="text-xl font-medium border-b pb-2 text-gray-800">Upcoming Assignments</h3>
          <ul className="mt-3 space-y-2">
            <li className="bg-blue-100 p-3 rounded-lg text-gray-900">📌 Math Homework - <span className="font-medium">Due: March 10</span></li>
            <li className="bg-blue-100 p-3 rounded-lg text-gray-900">📌 Science Project - <span className="font-medium">Due: March 15</span></li>
            <li className="bg-blue-100 p-3 rounded-lg text-gray-900">📌 History Essay - <span className="font-medium">Due: March 18</span></li>
          </ul>
        </div>

        {/* Submit Homework */}
        <div className="mt-6">
          <h3 className="text-xl font-medium border-b pb-2 text-gray-800">Submit Your Homework</h3>
          <div className="mt-3 flex flex-col sm:flex-row items-center gap-3">
            <input type="file" className="border p-2 rounded w-full text-gray-900" onChange={handleFileChange} />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Upload</button>
          </div>
          {uploadedFile && (
            <p className="text-green-700 mt-2">File selected: {uploadedFile.name}</p>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mt-6">
          <h3 className="text-xl font-medium border-b pb-2 text-gray-800">Progress Tracker</h3>
          <ul className="mt-3 space-y-2">
            <li className="bg-green-100 p-3 rounded-lg text-gray-900">✅ Math Homework - Submitted</li>
            <li className="bg-yellow-100 p-3 rounded-lg text-gray-900">⏳ Science Project - In Progress</li>
            <li className="bg-red-100 p-3 rounded-lg text-gray-900">❌ History Essay - Not Submitted</li>
          </ul>
        </div>

        {/* Notifications */}
        <div className="mt-6">
          <h3 className="text-xl font-medium border-b pb-2 text-gray-800">Notifications</h3>
          <div className="mt-3 bg-gray-200 p-3 rounded-lg text-gray-900">
            ⚠️ Reminder: Science Project is due in 3 days!
          </div>
        </div>
      </div>
    </div>
  );
}
