import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminStaffSalary() {
  const { darkMode } = useContext(ThemeContext);
  const [staffDetails, setStaffDetails] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [bonus, setBonus] = useState(0);
  const [leaveSalary, setLeaveSalary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankAndSalaryDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/salary");
        setStaffDetails(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchBankAndSalaryDetails();
  }, [month, year]);

  // Open modal for updating bonus and leave salary
  // Handle opening modal to update Bonus and Leave Salary
  const handleUpdateClick = (staff) => {
    setSelectedStaff(staff);
    setBonus(staff.salaryDetails?.bonus || 0);
    setLeaveSalary(staff.salaryDetails?.leaveSalary || 0);
    setIsModalOpen(true);
  };
  
  // Handle updating Bonus and Leave Salary
  const handleBonusLeaveUpdate = async () => {
    if (!selectedStaff) return; // Ensure selectedStaff is set
  
    setLoading(true);
  
    try {
      const bonusData = {
        userId: selectedStaff.userId,
        bonus,
        leaveSalary,
        month: selectedStaff.salaryDetails?.month,
        year: selectedStaff.salaryDetails?.year,
        status: selectedStaff.salaryDetails?.status,
      };
  
      // Call API to update bonus and leave salary
      const response = await axios.put("http://localhost:3000/api/salary/update-bonus-leave", bonusData);
  
      if (response.status === 200) {
        // Update the staff details in state if API call is successful
        setStaffDetails((prevList) =>
          prevList.map((staff) =>
            staff.userId === selectedStaff.userId
              ? { ...staff, salaryDetails: { ...staff.salaryDetails, bonus, leaveSalary } }
              : staff
          )
        );
  
        alert("Bonus and Leave Salary updated successfully!");
        setIsModalOpen(false);
      } else {
        alert("Failed to update bonus/leave salary. Server error.");
      }
    } catch (error) {
      console.error("Error updating bonus/leave salary:", error);
      alert("Failed to update bonus/leave salary.");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaySalary = async (staff) => {
    try {
      // Ensure staff object is valid
      if (!staff) {
        alert("No staff member selected.");
        return;
      }
  
      // Prepare the data to update the status to "paid"
      const payData = {
        userId: staff.userId,
        bonus: staff.salaryDetails?.bonus || 0,
        leaveSalary: staff.salaryDetails?.leaveSalary || 0,
        month: staff.salaryDetails?.month,
        year: staff.salaryDetails?.year,
        status: "paid", // Set status to "paid"
      };
  
      console.log("Sending payData:", payData);
  
      // Make the API call to update the salary status
      const response = await axios.put("http://localhost:3000/api/salary/update-bonus-leave", payData);
  
      if (response.status === 200) {
        // Update the salary status in the state if API call is successful
        alert("Salary status updated to Paid!");
  
      } else {
        alert("Failed to update salary status.");
      }
    } catch (error) {
      console.error("Error updating salary status:", error);
      alert("Failed to update salary status.");
    }
    finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={`min-h-screen flex flex-col items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center p-6 mt-6 rounded-lg shadow-md mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-3xl font-bold">💼 Staff Salary and Bank Details</h1>
        <button onClick={() => navigate("/assign-salary")} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
          ➕ Assign Salary
        </button>
      </div>


      {/* Table */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md overflow-x-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <table className="w-full text-left border-collapse">
          <thead>
          <tr>
              {["ID", "Name", "Email", "Bank", "Branch", "Account Number", "Month", "Salary", "EPF", "ETF", "Bonus", "Leave Salary", "Total Salary", "Status", "Actions"].map((header, index) => (
                <th key={index} className={`p-3 text-center ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffDetails.length > 0 ? (
              staffDetails.map((staff) => (
                <tr key={staff._id} className="border-t">
                  <td className="p-3">{staff.userId || "N/A"}</td>
                  <td className="p-3">{staff.name || "N/A"}</td>
                  <td className="p-3">{staff.email || "N/A"}</td>
                  <td className="p-3">{staff.bank || "N/A"}</td>
                  <td className="p-3">{staff.branch || "N/A"}</td>
                  <td className="p-3">{staff.accountNumber || "N/A"}</td>
                  <td className="p-3">{staff.salaryDetails?.month || "N/A"}</td>
                  <td className="p-3">${staff.salaryDetails?.salary || 0}</td>
                  <td className="p-3">Employee: {staff.salaryDetails?.EPF?.employee || 0}, Employer: {staff.salaryDetails?.EPF?.employer || 0}</td>
                  <td className="p-3">${staff.salaryDetails?.ETF || 0}</td>
                  <td className="p-3">${staff.salaryDetails?.bonus || 0}</td>
                  <td className="p-3">${staff.salaryDetails?.leaveSalary || 0}</td>
                  <td className="p-3">${staff.salaryDetails?.total || 0}</td>
                  <td className="p-3 font-semibold">{staff.salaryDetails?.status || "pending"}</td>
                  <td className="p-3 flex mt-8">
                    <button onClick={() => handleUpdateClick(staff)} className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">Update</button>
                    <button onClick={() => handlePaySalary(staff)}  className="px-3 py-1 bg-green-500 text-white rounded">Pay</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="14" className="p-4 text-center">No staff details found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="p-4 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <h2 className="text-lg font-semibold mb-4">Update Bonus & Leave Salary</h2>
            <input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} className={`w-full p-2 mb-5 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} placeholder="Bonus" />
            <input type="number" value={leaveSalary} onChange={(e) => setLeaveSalary(e.target.value)} className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} placeholder="Leave Salary" />
            <button onClick={handleBonusLeaveUpdate} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Update</button>
            <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 ml-5 bg-red-600 text-white rounded hover:bg-red-700"
                >
                Cancel
                </button>
          </div>
        </div>
      )}
    </div>
  );
}
