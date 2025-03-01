import { useState, useContext } from "react";
import { ThemeContext } from "./ThemeLayout"; 
const DashStaff = () => {
  const { darkMode } = useContext(ThemeContext); 
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "New Staff Meeting", description: "Monthly staff meeting scheduled for March 5th.", date: "2025-03-01" },
    { id: 2, title: "Policy Update", description: "New HR policies have been updated in the portal.", date: "2025-02-28" }
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  const handleAddAnnouncement = () => {
    if (newAnnouncement.trim() !== "") {
      setAnnouncements([
        ...announcements,
        { id: announcements.length + 1, title: "New Announcement", description: newAnnouncement, date: new Date().toISOString().split('T')[0] }
      ]);
      setNewAnnouncement("");
    }
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-[80vh] transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      {/* Header */}
      <div className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h1 className="text-2xl font-bold">🧑‍🏫 Staff Dashboard</h1>
        <button
          onClick={() => window.location.href = "/admin-staff"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
        >
          Go to Admin Panel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mb-6">
        <div className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-green-800 text-white" : "bg-green-100 text-green-700"
        }`}>
          <h3 className="text-lg font-semibold">Total Staff</h3>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-red-800 text-white" : "bg-red-100 text-red-700"
        }`}>
          <h3 className="text-lg font-semibold">Pending Requests</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-blue-800 text-white" : "bg-blue-100 text-blue-700"
        }`}>
          <h3 className="text-lg font-semibold">Total Announcements</h3>
          <p className="text-2xl font-bold">{announcements.length}</p>
        </div>
      </div>

      {/* Create New Announcement */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-2">Create New Staff Announcement</h2>
        <textarea
          className={`w-full p-2 border rounded mb-2 transition-all duration-300 ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
          }`}
          placeholder="Enter new announcement..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
        />
        <button
          onClick={handleAddAnnouncement}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded w-full"
        >
          Post Announcement
        </button>
      </div>

      {/* Display Announcements */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-2">Recent Staff Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <table className="w-full border-collapse shadow-md">
            <thead>
              <tr className={`text-left transition-all duration-300 ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
              }`}>
                <th className="p-2">Title</th>
                <th className="p-2">Description</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.id} className={`border-b transition-all duration-300 ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                }`}>
                  <td className="p-2 font-semibold">{announcement.title}</td>
                  <td className="p-2">{announcement.description}</td>
                  <td className="p-2 text-gray-600">{announcement.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashStaff;
