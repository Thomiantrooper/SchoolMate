import React, { useState, useEffect } from "react";

function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Fetch leave requests from the backend
    setLoading(true);
    fetch("http://localhost:3000/api/leaveRequests")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLeaveRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leave requests:", error);
        setMessage("Error fetching leave requests: " + error.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leaveRequestData = {
      staffId,
      leaveType,
      startDate,
      endDate,
      reason,
    };

    try {
      const response = await fetch("http://localhost:3000/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveRequestData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage("Leave request submitted successfully!");
        // Re-fetch the leave requests to update the list
        setLeaveRequests((prev) => [...prev, data]);
      } else {
        setMessage("Error submitting leave request: " + data.message);
      }
    } catch (error) {
      setMessage("Error submitting leave request: " + error.message);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: isDarkMode ? "#121212" : "#fff", // Background color change
        color: isDarkMode ? "#fff" : "#333", // Text color change based on dark mode
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <button
        onClick={toggleDarkMode}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: isDarkMode ? "#fff" : "#4CAF50", // Button color based on dark mode
          color: isDarkMode ? "#333" : "#fff", // Button text color based on dark mode
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          fontSize: "16px",
          transition: "background-color 0.3s ease",
        }}
      >
        Toggle Dark Mode
      </button>
      <h2>Leave Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Staff ID:</label>
          <input
            type="text"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: isDarkMode ? "#333" : "#fff", // Input field background color change
              color: isDarkMode ? "#fff" : "#000", // Input field text color change
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Leave Type:</label>
          <input
            type="text"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "#ffffff", // Button color stays the same
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "16px",
            transition: "background-color 0.3s ease",
          }}
        >
          Submit Request
        </button>
      </form>

      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}

      <h3 style={{ marginTop: "30px" }}>Leave Requests List</h3>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            textAlign: "left",
            color: isDarkMode ? "#fff" : "#000", // Table text color based on dark mode
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Staff ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Leave Type</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Start Date</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>End Date</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Reason</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leaveRequest) => (
              <tr key={leaveRequest._id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {leaveRequest.staffId}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {leaveRequest.leaveType}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {new Date(leaveRequest.startDate).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {new Date(leaveRequest.endDate).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {leaveRequest.reason}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {leaveRequest.active ? "Active" : "Inactive"} {/* Display Active or Inactive */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

export default LeaveRequest;
