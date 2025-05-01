import React, { useState, useEffect } from "react";

function StaffLeave() {
  const [staffId, setStaffId] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Load leave requests from localStorage when the component mounts
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    setLeaveRequests(storedRequests);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const leaveRequestData = {
      staffId,
      leaveType,
      startDate,
      endDate,
      reason,
      active: false, // initially pending
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const updatedRequests = [...leaveRequests, leaveRequestData];
    localStorage.setItem("leaveRequests", JSON.stringify(updatedRequests));
    setLeaveRequests(updatedRequests);

    setMessage("Leave request submitted successfully!");
    setLeaveStatus(false);

    // Automatically approve after 5 minutes
    setTimeout(() => {
      const allRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
      const updated = allRequests.map((req) => {
        if (
          req.staffId === staffId &&
          req.startDate === startDate &&
          req.endDate === endDate &&
          req.reason === reason
        ) {
          req.active = true;
          setLeaveStatus(true);
        }
        return req;
      });
      localStorage.setItem("leaveRequests", JSON.stringify(updated));
      setLeaveRequests(updated); // Update the state to reflect the approved request
    }, 5 * 60 * 1000); // 5 minutes
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: isDarkMode ? "#121212" : "#fff",
        color: isDarkMode ? "#fff" : "#333",
        transition: "background-color 0.3s ease, color 0.3s ease",
        borderRadius: "10px",
      }}
    >
      <button
        onClick={toggleDarkMode}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: isDarkMode ? "#fff" : "#4CAF50",
          color: isDarkMode ? "#333" : "#fff",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "30px",
        }}
      >
        Toggle Dark Mode
      </button>

      <h2 style={{ textAlign: "center" }}>Leave Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Staff ID:</label>
          <input
            type="text"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
            style={inputStyle(isDarkMode)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Leave Type:</label>
          <input
            type="text"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
            style={inputStyle(isDarkMode)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={inputStyle(isDarkMode)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={inputStyle(isDarkMode)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={inputStyle(isDarkMode)}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "16px",
            width: "100%",
          }}
        >
          Submit Request
        </button>
      </form>

      {message && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>}

      {leaveStatus !== null && (
        <p
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            color: leaveStatus ? "green" : "orange",
          }}
        >
          Status: {leaveStatus ? "Approved ✅" : "Pending ❗"}
        </p>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>Pending Leave Requests</h3>
        {leaveRequests.length > 0 ? (
          <ul style={{ paddingLeft: "20px" }}>
            {leaveRequests.map((request, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
                  borderRadius: "5px",
                  backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                  color: isDarkMode ? "#fff" : "#333",
                }}
              >
                <strong>Staff ID:</strong> {request.staffId} <br />
                <strong>Leave Type:</strong> {request.leaveType} <br />
                <strong>Start Date:</strong> {request.startDate} <br />
                <strong>End Date:</strong> {request.endDate} <br />
                <strong>Reason:</strong> {request.reason} <br />
                <strong>Status:</strong> {request.active ? "Approved ✅" : "Pending ❗"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending requests.</p>
        )}
      </div>
    </div>
  );
}

// Helper style for inputs and textareas
const inputStyle = (isDarkMode) => ({
  width: "100%",
  padding: "10px",
  backgroundColor: isDarkMode ? "#333" : "#fff",
  color: isDarkMode ? "#fff" : "#000",
  border: "1px solid",
  borderColor: isDarkMode ? "#444" : "#ccc",
  borderRadius: "5px",
  fontSize: "16px",
  marginTop: "5px",
});

export default StaffLeave;
