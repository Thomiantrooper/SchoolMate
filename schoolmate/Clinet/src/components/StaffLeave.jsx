import React, { useState, useEffect } from "react";
import { 
  FiMoon, 
  FiSun, 
  FiCalendar, 
  FiUser, 
  FiFileText, 
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiTrash2,
  FiEdit2
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function StaffLeave() {
  const [formData, setFormData] = useState({
    staffId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [editingId, setEditingId] = useState(null);

  // Load leave requests from localStorage
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    setLeaveRequests(storedRequests);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.staffId || !formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      setMessage("Please fill in all fields");
      return;
    }

    const newRequest = {
      ...formData,
      id: Date.now(),
      status: "pending",
      submittedAt: new Date().toISOString()
    };

    const updatedRequests = [...leaveRequests, newRequest];
    localStorage.setItem("leaveRequests", JSON.stringify(updatedRequests));
    setLeaveRequests(updatedRequests);
    
    setMessage("Leave request submitted successfully!");
    setFormData({
      staffId: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: ""
    });

    // Simulate approval after 5 minutes
    setTimeout(() => {
      const allRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
      const updated = allRequests.map(req => 
        req.id === newRequest.id ? { ...req, status: "approved" } : req
      );
      localStorage.setItem("leaveRequests", JSON.stringify(updated));
      setLeaveRequests(updated);
    }, 5 * 60 * 1000);
  };

  const handleApprove = (id) => {
    const updated = leaveRequests.map(req => 
      req.id === id ? { ...req, status: "approved" } : req
    );
    localStorage.setItem("leaveRequests", JSON.stringify(updated));
    setLeaveRequests(updated);
  };

  const handleReject = (id) => {
    const updated = leaveRequests.map(req => 
      req.id === id ? { ...req, status: "rejected" } : req
    );
    localStorage.setItem("leaveRequests", JSON.stringify(updated));
    setLeaveRequests(updated);
  };

  const handleDelete = (id) => {
    const updated = leaveRequests.filter(req => req.id !== id);
    localStorage.setItem("leaveRequests", JSON.stringify(updated));
    setLeaveRequests(updated);
  };

  const handleEdit = (request) => {
    setFormData({
      staffId: request.staffId,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason
    });
    setEditingId(request.id);
    setActiveTab("new");
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <FiCalendar className="text-indigo-600" /> Staff Leave Management
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-800 text-white'}`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'new' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('new')}
          >
            New Request
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'manage' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Requests
          </button>
        </div>

        {/* New Request Form */}
        {activeTab === 'new' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              {editingId ? <FiEdit2 /> : <FiPlus />} 
              {editingId ? "Edit Leave Request" : "New Leave Request"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <FiUser /> Staff ID
                </label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <FiFileText /> Leave Type
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Personal">Personal Leave</option>
                  <option value="Maternity/Paternity">Maternity/Paternity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <FiCalendar /> Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <FiCalendar /> End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                  <p className="text-sm">
                    Total days requested: <span className="font-bold">
                      {calculateDays(formData.startDate, formData.endDate)} day(s)
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <FiFileText /> Reason
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        staffId: "",
                        leaveType: "",
                        startDate: "",
                        endDate: "",
                        reason: ""
                      });
                      setEditingId(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  {editingId ? "Update Request" : "Submit Request"}
                </button>
              </div>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  message.includes("success") 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {message}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Manage Requests */}
        {activeTab === 'manage' && (
          <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiFileText /> Leave Requests
            </h2>

            {leaveRequests.length === 0 ? (
              <div className="text-center py-10">
                <FiFileText className="mx-auto text-4xl text-gray-400 mb-3" />
                <p className="text-gray-500">No leave requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{request.staffId}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : request.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.leaveType} • {calculateDays(request.startDate, request.endDate)} day(s)
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                        <p className="mt-2 text-sm">{request.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(request)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Approve"
                            >
                              <FiCheckCircle />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Reject"
                            >
                              <FiAlertCircle />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffLeave;