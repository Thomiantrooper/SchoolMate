import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiUpload, 
  FiFile, 
  FiX, 
  FiCheck, 
  FiAlertCircle,
  FiCalendar,
  FiBook,
  FiClock,
  FiUser
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeworkPortal() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const [homeworkList, setHomeworkList] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showNotification, setShowNotification] = useState(true);
  const [subject, setSubject] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/homework');
      setHomeworkList(response.data);
    } catch (error) {
      console.error('Error fetching homework:', error.message);
      setUploadStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      alert('You can upload a maximum of 5 files at once');
      return;
    }
    
    setUploadedFiles(files);
    setUploadStatus(null);

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || subject.trim() === '') {
      setUploadStatus('error');
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach(file => formData.append('attachments', file));
    formData.append('teacher', '609bda561452242d88d36e37'); // Replace with real user ID
    formData.append('subject', subject);
    formData.append('class', '10-A');
    formData.append('description', description || 'No description provided');
    formData.append('dueDate', dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
    formData.append('postDate', new Date().toISOString());

    setIsLoading(true);
    try {
      await axios.post('/api/homework', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('success');
      setUploadedFiles([]);
      setImagePreviews([]);
      setSubject('');
      setDescription('');
      setDueDate('');
      fetchHomework();
    } catch (error) {
      console.error('Error uploading homework:', error.message);
      setUploadStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHomework = homeworkList.filter(assignment => {
    // Filter by status
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const isPending = due > now;
    
    if (filter === 'pending' && !isPending) return false;
    if (filter === 'completed' && isPending) return false;
    
    // Filter by search term
    if (searchTerm && !assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (due < now) {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Overdue</span>;
    } else if (diffDays <= 3) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Due soon</span>;
    } else {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FiBook className="text-indigo-600" /> Homework Portal
            </h1>
            <p className="text-gray-600 mt-2">
              Manage assignments, submit homework, and track your progress
            </p>
          </div>
          
          {showNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-indigo-100 text-indigo-800 p-3 rounded-lg flex items-center gap-3"
            >
              <FiAlertCircle className="text-indigo-600" />
              <span>Submit your homework before the due date!</span>
              <button
                onClick={() => setShowNotification(false)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <FiX />
              </button>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Your Assignments</h2>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Assignments</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredHomework.length > 0 ? (
                <ul className="space-y-3">
                  {filteredHomework.map((assignment, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div 
                        className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer transition-colors border border-gray-200"
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 flex items-center gap-2">
                              {assignment.subject}
                              {getStatusBadge(assignment.dueDate)}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                              {assignment.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <FiCalendar size={12} /> {formatDate(assignment.dueDate)}
                            </div>
                            {assignment.attachments?.length > 0 && (
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <FiFile size={12} /> {assignment.attachments.length} file(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <FiBook className="mx-auto text-4xl mb-3 opacity-50" />
                  <p>No assignments found</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Homework Section */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Submit Homework</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Mathematics, Science, etc."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Assignment details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="text-gray-400 text-2xl mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (max 5 files)</p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{uploadedFiles.length} file(s) selected</span>
                    <button 
                      onClick={() => {
                        setUploadedFiles([]);
                        setImagePreviews([]);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX />
                    </button>
                  </div>
                  
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <FiFile className="mr-2" /> {file.name}
                      </li>
                    ))}
                  </ul>
                  
                  {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={handleUpload}
                disabled={isLoading || !subject || uploadedFiles.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isLoading || !subject || uploadedFiles.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload /> Submit Homework
                  </>
                )}
              </button>
              
              {uploadStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 text-green-800 p-3 rounded-lg flex items-center gap-2"
                >
                  <FiCheck className="text-green-600" />
                  <span>Homework submitted successfully!</span>
                </motion.div>
              )}
              
              {uploadStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 text-red-800 p-3 rounded-lg flex items-center gap-2"
                >
                  <FiAlertCircle className="text-red-600" />
                  <span>Error submitting homework. Please try again.</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Detail Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAssignment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedAssignment.subject}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      {getStatusBadge(selectedAssignment.dueDate)}
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <FiUser size={14} /> {selectedAssignment.teacher?.name || 'Teacher'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiBook className="text-indigo-600" /> Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedAssignment.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiCalendar className="text-indigo-600" /> Due Date
                    </h3>
                    <div className="text-gray-700">
                      {formatDate(selectedAssignment.dueDate)}
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <FiClock size={14} />
                        {new Date(selectedAssignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mt-4 mb-3 flex items-center gap-2">
                      <FiFile className="text-indigo-600" /> Attachments
                    </h3>
                    {selectedAssignment.attachments?.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedAssignment.attachments.map((file, idx) => (
                          <li key={idx}>
                            <a
                              href={`/uploads/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                            >
                              <FiFile /> {file}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No attachments</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}