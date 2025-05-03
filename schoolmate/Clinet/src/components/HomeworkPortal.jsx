import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaUpload, FaCheck, FaTimes, FaBell, FaFileAlt, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdClose, MdOutlineAssignment, MdOutlineAttachment } from 'react-icons/md';

export default function HomeworkPortal() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [showNotification, setShowNotification] = useState(true);
  const [completedHomework, setCompletedHomework] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [dueSoonFilter, setDueSoonFilter] = useState(false);
  const [submissions, setSubmissions] = useState({});

  // Fetch homework from local storage or use dummy data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const storedHomework = localStorage.getItem('homeworkList');
      const storedCompleted = localStorage.getItem('completedHomework') || '[]';
      const storedSubmissions = localStorage.getItem('submissions') || '{}';
      
      if (storedHomework) {
        setHomeworkList(JSON.parse(storedHomework));
      } else {
        const dummyHomework = [
          { 
            id: 1,
            title: "Math Homework", 
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
            details: "Complete exercises 1-10 on page 23. Show all your work and submit as PDF.", 
            subject: "Mathematics",
            attachments: ["worksheet.pdf"],
            points: 20
          },
          { 
            id: 2,
            title: "Science Project", 
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
            details: "Build a simple circuit model. Take photos of your work and write a 1-page report.", 
            subject: "Science",
            attachments: ["project_guidelines.docx"],
            points: 50
          },
          { 
            id: 3,
            title: "History Essay", 
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
            details: "Write 1000 words about key events of World War II. Include citations.", 
            subject: "History",
            points: 30
          },
        ];
        localStorage.setItem('homeworkList', JSON.stringify(dummyHomework));
        setHomeworkList(dummyHomework);
      }
      
      setCompletedHomework(JSON.parse(storedCompleted));
      setSubmissions(JSON.parse(storedSubmissions));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('completedHomework', JSON.stringify(completedHomework));
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [completedHomework, submissions]);

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
    setUploadSuccess(false);
  };

  const handleUpload = async (assignmentId) => {
    if (!uploadedFile) return;

    // Simulate upload delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add submission
    const newSubmission = {
      id: Date.now(),
      fileName: uploadedFile.name,
      fileType: uploadedFile.type,
      submittedAt: new Date().toISOString(),
      status: 'Submitted'
    };

    setSubmissions(prev => ({
      ...prev,
      [assignmentId]: [...(prev[assignmentId] || []), newSubmission]
    }));

    setUploadSuccess(true);
    setUploadedFile(null);
    setIsLoading(false);
    
    // Mark as completed if not already
    if (!completedHomework.includes(assignmentId)) {
      handleMarkAsCompleted(assignmentId);
    }
  };

  const handleMarkAsCompleted = (assignmentId) => {
    if (!completedHomework.includes(assignmentId)) {
      setCompletedHomework(prev => [...prev, assignmentId]);
    }
  };

  const toggleAssignmentExpansion = (assignmentId) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  const filteredHomework = homeworkList.filter(assignment => {
    // Filter by tab
    if (activeTab === 'completed' && !completedHomework.includes(assignment.id)) return false;
    if (activeTab === 'pending' && completedHomework.includes(assignment.id)) return false;
    
    // Filter by due soon (within 3 days)
    if (dueSoonFilter) {
      const dueDate = new Date(assignment.dueDate);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (diffDays > 3) return false;
    }
    
    return true;
  });

  const getDueStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'bg-red-500' };
    if (diffDays === 0) return { text: 'Due today', color: 'bg-orange-500' };
    if (diffDays <= 3) return { text: `Due in ${diffDays} days`, color: 'bg-yellow-500' };
    return { text: `Due in ${diffDays} days`, color: 'bg-green-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FaBook className="text-indigo-600" /> Homework Portal
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your assignments, track deadlines, and submit your work
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-24">
              <div className="text-2xl font-bold text-indigo-600">{homeworkList.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-24">
              <div className="text-2xl font-bold text-green-600">{completedHomework.length}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-24">
              <div className="text-2xl font-bold text-red-600">
                {homeworkList.filter(a => new Date(a.dueDate) < new Date() && !completedHomework.includes(a.id)).length}
              </div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-indigo-100 border-l-4 border-indigo-600 text-indigo-800 p-4 rounded-lg mb-8 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <FaBell className="text-indigo-600" />
                <span>Science Project is due in 3 days! Don't forget to submit.</span>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <MdClose size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              All Assignments
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'pending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'completed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              Completed
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={dueSoonFilter}
                  onChange={() => setDueSoonFilter(!dueSoonFilter)}
                  className="rounded text-indigo-600"
                />
                Due Soon (≤3 days)
              </label>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredHomework.length} assignments
            </div>
          </div>

          {/* Assignments List */}
          <div className="divide-y">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredHomework.length > 0 ? (
              filteredHomework.map((assignment) => (
                <div key={assignment.id} className={`transition-colors ${completedHomework.includes(assignment.id) ? 'bg-green-50' : ''}`}>
                  {/* Assignment Header */}
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleAssignmentExpansion(assignment.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${completedHomework.includes(assignment.id) ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <MdOutlineAssignment size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <FaCalendarAlt size={12} /> 
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {assignment.subject}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full text-white ${getDueStatus(assignment.dueDate).color}`}>
                        {getDueStatus(assignment.dueDate).text}
                      </span>
                      {expandedAssignment === assignment.id ? (
                        <FaChevronUp className="text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedAssignment === assignment.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Assignment Details */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Assignment Details</h4>
                            <p className="text-gray-700 whitespace-pre-line mb-4">{assignment.details}</p>
                            
                            {assignment.attachments && assignment.attachments.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <MdOutlineAttachment /> Attachments
                                </h4>
                                <div className="space-y-2">
                                  {assignment.attachments.map((file, index) => (
                                    <a
                                      key={index}
                                      href="#"
                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                    >
                                      <FaFileAlt /> {file}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Submission Section */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Your Submissions</h4>
                            
                            {/* Existing Submissions */}
                            {submissions[assignment.id]?.length > 0 ? (
                              <div className="mb-4 space-y-3">
                                {submissions[assignment.id].map(sub => (
                                  <div key={sub.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <FaFileAlt className="text-gray-500" />
                                        <span className="font-medium">{sub.fileName}</span>
                                      </div>
                                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                        {sub.status}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Submitted: {new Date(sub.submittedAt).toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-500 mb-4">
                                No submissions yet
                              </div>
                            )}

                            {/* New Submission Form */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Submit your work
                              </label>
                              <div className="flex flex-col gap-3">
                                <label className="cursor-pointer">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <FaFileAlt className="text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {uploadedFile ? uploadedFile.name : 'Click to select file'}
                                      </span>
                                      <span className="text-xs text-gray-500">PDF, DOCX, JPG, PNG</span>
                                    </div>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={handleFileChange}
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    />
                                  </div>
                                </label>
                                <button
                                  onClick={() => handleUpload(assignment.id)}
                                  disabled={!uploadedFile || isLoading}
                                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${!uploadedFile || isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                                >
                                  {isLoading ? (
                                    'Uploading...'
                                  ) : (
                                    <>
                                      <FaUpload /> Submit
                                    </>
                                  )}
                                </button>
                              </div>
                              {uploadSuccess && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-2 bg-green-100 text-green-800 p-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                  <FaCheck /> Upload successful!
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No assignments found matching your filters
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}