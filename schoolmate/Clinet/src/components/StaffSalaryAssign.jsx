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
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
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
        month: currentMonth,
        year: currentYear,
      };

      await axios.put("http://localhost:3000/api/salary/update-salary", salaryData);
      alert("Salary assigned/updated successfully!");

      setStaffList((prevList) =>
        prevList.map((s) =>
          s.userId === staff.userId
            ? { ...s, salary: salaryData.salary }
            : s
        )
      );
    } catch (error) {
      console.error("Error submitting salary:", error);
      alert("Failed to assign/update salary.");
    } finally {
      setLoading(false);
    }
  };

  // Handle bonus and leave salary update
 {/* const handleBonusLeaveUpdate = async (staff) => {
    setLoading(true);
    try {
      const bonusData = {
        userId: staff.userId,
        bonus: salaryInputs[staff.userId]?.bonus ?? staff.bonus ?? 0,
        leaveSalary: salaryInputs[staff.userId]?.leaveSalary ?? staff.leaveSalary ?? 0,
        month: currentMonth,
        year: currentYear,
        status: salaryInputs[staff.userId]?.status ?? staff.status ?? "pending",
      };

      await axios.put("http://localhost:3000/api/salary/update-bonus-leave", bonusData);
      alert("Bonus and leave salary updated successfully!");

      setStaffList((prevList) =>
        prevList.map((s) =>
          s.userId === staff.userId
            ? { ...s, bonus: bonusData.bonus, leaveSalary: bonusData.leaveSalary, status: bonusData.status }
            : s
        )
      );
    } catch (error) {
      console.error("Error updating bonus/leave salary:", error);
      alert("Failed to update bonus/leave salary.");
    } finally {
      setLoading(false);
    }
  };*/}

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
              {/*<th className="p-2">Bonus</th>
              <th className="p-2">Leave Salary</th>
              <th className="p-2">Status</th>*/}
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <tr key={staff.userId} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
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
                  {/*<td className="p-2">
                    <input
                      type="number"
                      className={`p-1 border rounded w-20 ${
                        darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                      }`}
                      value={salaryInputs[staff.userId]?.bonus ?? staff.bonus ?? ""}
                      onChange={(e) => handleSalaryChange(staff.userId, "bonus", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className={`p-1 border rounded w-20 ${
                        darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                      }`}
                      value={salaryInputs[staff.userId]?.leaveSalary ?? staff.leaveSalary ?? ""}
                      onChange={(e) => handleSalaryChange(staff.userId, "leaveSalary", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="p-1 border rounded w-24"
                      value={salaryInputs[staff.userId]?.status ?? staff.status ?? "pending"}
                      onChange={(e) => handleSalaryChange(staff.userId, "status", e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>*/}
                  <td className="p-2">
                    <button
                      onClick={() => handleSalarySubmit(staff)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Assign Salary"}
                    </button>
                   {/* <button
                      onClick={() => handleBonusLeaveUpdate(staff)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Update Bonus & Leave"}
                    </button>*/}
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
