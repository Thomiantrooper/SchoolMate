import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomeworkPortal() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showNotification, setShowNotification] = useState(true);
  const [subject, setSubject] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      const response = await axios.get('/api/homework');
      setHomeworkList(response.data);
    } catch (error) {
      console.error('Error fetching homework:', error.message);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
    setUploadSuccess(false);

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || subject.trim() === '') return;

    const formData = new FormData();
    uploadedFiles.forEach(file => formData.append('attachments', file));
    formData.append('teacher', '609bda561452242d88d36e37'); // Replace with real user ID
    formData.append('subject', subject);
    formData.append('class', '10-A');
    formData.append('description', 'Uploaded from Homework Portal');
    formData.append('dueDate', new Date().toISOString());
    formData.append('postDate', new Date().toISOString());

    try {
      await axios.post('/api/homework', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess(true);
      setUploadedFiles([]);
      setImagePreviews([]);
      setSubject('');
      fetchHomework();
    } catch (error) {
      console.error('Error uploading homework:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-800 to-black p-6 flex justify-center items-center">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-3xl text-white">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-indigo-400 mb-2 animate-pulse">
          📖 Homework Portal
        </h2>
        <p className="text-gray-300 mb-6">
          Welcome to the Homework Portal. View assignments, submit homework, and track your progress.
        </p>

        {/* Upcoming Assignments */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold border-b-2 pb-2 text-gray-200 mb-4">Upcoming Assignments</h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {homeworkList.length > 0 ? (
              homeworkList.map((assignment, index) => (
                <li
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <div className="text-lg font-medium">{assignment.subject}</div>
                  <div className="text-sm text-gray-400">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </li>
              ))
            ) : (
              <p>No homework assigned yet.</p>
            )}
          </ul>
        </div>

        {/* Modal for Assignment Details */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-10">
            <div className="bg-gray-800 rounded-xl p-6 w-80 shadow-xl relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedAssignment(null)}
              >
                ✖
              </button>
              <h4 className="text-xl font-semibold mb-2">{selectedAssignment.subject}</h4>
              <p className="text-gray-300 mb-4">{selectedAssignment.description}</p>
              <div className="text-sm text-gray-500">
                Due Date: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
              </div>
              {selectedAssignment.attachments?.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold">Attachments:</h5>
                  <ul className="list-disc ml-4">
                    {selectedAssignment.attachments.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={`/uploads/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline"
                        >
                          {file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Homework */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold border-b-2 pb-2 text-gray-200 mb-4">Submit Your Homework</h3>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 rounded w-full mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleUpload}
              className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600 active:scale-95 transition"
            >
              Upload
            </button>
          </div>

          {uploadedFiles.length > 0 && (
            <p className="text-green-600 mt-2">{uploadedFiles.length} file(s) selected</p>
          )}

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-4 text-green-700 bg-green-100 p-3 rounded-lg animate-bounce">
              🎉 Upload Successful!
            </div>
          )}
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="bg-yellow-600 p-4 rounded-lg flex items-center justify-between animate-slideIn">
            <span>⚠️ Reminder: Submit your homework before the due date!</span>
            <button
              className="text-gray-300 hover:text-gray-400"
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
