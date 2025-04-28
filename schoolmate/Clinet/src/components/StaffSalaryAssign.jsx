import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../components/ThemeLayout";

export default function AssignSalary() {
  const { darkMode } = useContext(ThemeContext);
  const [staffList, setStaffList] = useState([]);
  const [salaryInputs, setSalaryInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Get the current month and year
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()]; // Get month name
  const currentYear = currentDate.getFullYear();

  // Fetch staff salary details
  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setFetching(true);
        const response = await axios.get("http://localhost:3000/api/salary");
        setStaffList(response.data);
      } catch (error) {
        console.error("Error fetching staff details:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchStaffDetails();
  }, []);

  // Handle input change
  const handleSalaryChange = (userId, field, value) => {
    setSalaryInputs((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  // Handle salary update or assignment
const handleSalarySubmit = async (staff) => {
  setLoading(true);
  try {
    const salaryData = {
      userId: staff.userId,
      salary: salaryInputs[staff.userId]?.salary ?? staff.salary ?? 0,
      month: currentMonthName,
      year: currentYear,
    };

    const response = await axios.put("http://localhost:3000/api/salary/update-salary", salaryData);
    
    // Handle different successful responses
    if (response.data.message === "Salary is already paid. Only bank details have been updated.") {
      alert(response.data.message);
    } else if (response.data.message === "Salary details updated successfully") {
      alert("Salary updated successfully!");
    } else {
      alert("Salary assigned/updated successfully!");
    }

    setStaffList((prevList) =>
      prevList.map((s) =>
        s.userId === staff.userId
          ? { ...s, salary: salaryData.salary }
          : s
      )
    );
  } catch (error) {
    console.error("Error submitting salary:", error);
    // Handle specific error messages from backend
    if (error.response && error.response.data && error.response.data.error) {
      if (error.response.data.error.includes("Salary details not found")) {
        alert("No salary record exists for this month. Please create one first.");
      } else {
        alert(error.response.data.error);
      }
    } else {
      alert("Failed to assign/update salary. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`p-6 flex flex-col items-center w-full min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-bold">💰 Assign & Manage Staff Salary</h1>
      </div>

      {fetching ? (
        <p>Loading staff data...</p>
      ) : (
        <table className="w-full max-w-6xl border-collapse shadow-md">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
              <th className="p-2">Staff ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff, index) => (
                <tr key={`${staff.userId}-${index}`} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                  <td className="p-2">{staff.userId}</td>
                  <td className="p-2">{staff.name}</td>
                  <td className="p-2">{staff.email}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      className={`p-1 border rounded w-20 ${
                        darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                      }`}
                      value={salaryInputs[staff.userId]?.salary ?? staff.salary ?? ""}
                      onChange={(e) => handleSalaryChange(staff.userId, "salary", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleSalarySubmit(staff)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Assign Salary"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}