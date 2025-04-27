import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "./ThemeLayout";

const DashAcademy = () => {
  const { darkMode } = useContext(ThemeContext);

  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Load updates from localStorage when component mounts
  useEffect(() => {
    const storedUpdates = localStorage.getItem("academyUpdates");
    if (storedUpdates) {
      setUpdates(JSON.parse(storedUpdates));
    } else {
      const initialUpdates = [
        { id: 1, title: "New Course Added", description: "Machine Learning Basics course is now available.", date: "2025-03-01" },
        { id: 2, title: "Exam Schedule Released", description: "Midterm exam schedule has been updated.", date: "2025-02-28" }
      ];
      setUpdates(initialUpdates);
      localStorage.setItem("academyUpdates", JSON.stringify(initialUpdates));
    }
  }, []);

  // Save updates to localStorage whenever updates change
  useEffect(() => {
    localStorage.setItem("academyUpdates", JSON.stringify(updates));
  }, [updates]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAddUpdate = () => {
    if (newUpdate.trim() !== "") {
      const newEntry = {
        id: Date.now(), // unique ID
        title: "New Update",
        description: newUpdate.slice(0, 250), // limit to 250 chars
        date: new Date().toISOString().split('T')[0]
      };
      setUpdates([newEntry, ...updates]); // newest first
      setNewUpdate("");
      setToastMessage("✅ Update Posted Successfully!");
    }
  };

  const handleDeleteUpdate = (id) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      setUpdates(updates.filter(update => update.id !== id));
      setToastMessage("🗑️ Update Deleted Successfully!");
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear ALL updates? This action cannot be undone.")) {
      setUpdates([]);
      setToastMessage("⚡ All Updates Cleared!");
    }
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <div className={`relative p-6 flex flex-col items-center w-full min-h-[80vh] transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <h1 className="text-2xl font-bold">📚 Academic Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = "/admin-academy"}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
          >
            Admin Panel
          </button>
          <button
            onClick={handleClearAll}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mb-6">
        <SummaryCard title="Total Courses" value="24" darkMode={darkMode} color="green" />
        <SummaryCard title="Pending Approvals" value="5" darkMode={darkMode} color="red" />
        <SummaryCard title="Total Announcements" value={updates.length.toString()} darkMode={darkMode} color="blue" />
      </div>

      {/* New Update Creator */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className="text-lg font-semibold mb-2">Create New Academic Update</h2>
        <textarea
          maxLength={250}
          className={`w-full p-2 border rounded mb-2 transition-all duration-300 ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
          }`}
          placeholder="Enter new update (max 250 characters)..."
          value={newUpdate}
          onChange={(e) => setNewUpdate(e.target.value)}
        />
        <div className="text-right text-xs mb-2 text-gray-400">
          {newUpdate.length}/250 characters
        </div>
        <button
          onClick={handleAddUpdate}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded w-full"
        >
          Post Update
        </button>
      </div>

      {/* Updates Table */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className="text-lg font-semibold mb-2">Recent Academic Updates</h2>
        {updates.length === 0 ? (
          <p className="text-gray-500">No updates yet.</p>
        ) : (
          <table className="w-full border-collapse shadow-md">
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} text-left`}>
                <th className="p-2">Title</th>
                <th className="p-2">Description</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((update) => (
                <tr key={update.id} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                  <td className="p-2 font-semibold">
                    {update.title}
                    {isToday(update.date) && (
                      <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">Today</span>
                    )}
                  </td>
                  <td className="p-2">{update.description}</td>
                  <td className="p-2 text-gray-500">{update.date}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteUpdate(update.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Small reusable card component
const SummaryCard = ({ title, value, darkMode, color }) => {
  const colorClasses = {
    green: darkMode ? "bg-green-800" : "bg-green-100 text-green-700",
    red: darkMode ? "bg-red-800" : "bg-red-100 text-red-700",
    blue: darkMode ? "bg-blue-800" : "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${colorClasses[color]} transition-all duration-300`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DashAcademy;
