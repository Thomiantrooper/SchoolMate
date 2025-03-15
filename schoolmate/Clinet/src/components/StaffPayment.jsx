import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function StaffBankAndSalaryList() {
  const { currentUser } = useSelector((state) => state.user); // Get logged-in user
  const navigate = useNavigate();

  const [salaryDetails, setSalaryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchSalaryDetails();
    }
  }, [currentUser]);

  const fetchSalaryDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salary/bank-salary-details/${currentUser._id}`
      );
      console.log("API Response:", response.data); // Log the response
  
      if (response.status === 200) {
        setSalaryDetails(response.data); // Remove the array wrapper if it's unnecessary
      }
    } catch (error) {
      console.error("Error fetching salary details:", error);
      setErrorMessage("Failed to fetch salary details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-7xl w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        {/* 🔹 Add Bank Details Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Salary & Bank Details</h2>
          <button
            onClick={() => navigate("/staff-page/bank-details")} // Change route if needed
            className="bg-indigo-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            + Add Bank Details
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-600">{errorMessage}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Name</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Email</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Bank</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Branch</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Account Number</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Month</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Salary</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">EPF -</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Bonus +</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Leave Salary -</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Total</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {salaryDetails.length > 0 ? (
                  salaryDetails.map((data, index) => (
                    <tr key={index} className="text-center">
                      <td className="border px-4 py-2">{data?.name || "N/A"}</td>
                      <td className="border px-4 py-2">{data?.email || "N/A"}</td>
                      <td className="border px-4 py-2">{data?.bank || "N/A"}</td>
                      <td className="border px-4 py-2">{data?.branch || "N/A"}</td>
                      <td className="border px-4 py-2">{data?.accountNumber || "N/A"}</td>
                      <td className="border px-4 py-2">{data?.salaryDetails?.month || "N/A"}</td>
                      <td className="border px-4 py-2">LKR {data?.salary || 0}</td>
                      <td className="border px-4 py-2">LKR {data.salaryDetails?.EPF?.employee || 0}</td>
                      <td className="border px-4 py-2">LKR {data?.salaryDetails?.bonus || 0}</td>
                      <td className="border px-4 py-2">LKR {data?.salaryDetails?.leaveSalary || 0}</td>
                      <td className="border px-4 py-2">LKR {data?.salaryDetails?.total || 0}</td>
                      <td className={`border px-4 py-2 font-semibold ${data?.salaryDetails?.status === "paid" ? "text-green-600" : "text-red-600"}`}>
                        {data?.salaryDetails?.status || "Pending"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="border px-4 py-4 text-center text-gray-600 dark:text-gray-300">
                      No salary details found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
