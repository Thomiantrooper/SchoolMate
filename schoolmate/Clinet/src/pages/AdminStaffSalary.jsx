import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiDollarSign, 
  FiUser, 
  FiMail, 
  FiCreditCard,
  FiHome,
  FiCalendar,
  FiPlus,
  FiCheck,
  FiEdit2,
  FiArrowLeft,
  FiPercent
} from 'react-icons/fi';
import { BsBank2, BsReceipt } from 'react-icons/bs';
import { FaMoneyBillWave, FaPiggyBank } from 'react-icons/fa';

export default function AdminStaffSalary() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [staffDetails, setStaffDetails] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [bonus, setBonus] = useState(0);
  const [leaveSalary, setLeaveSalary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBankAndSalaryDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/salary");
        setStaffDetails(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Failed to load staff salary details");
      } finally {
        setLoading(false);
      }
    };

    fetchBankAndSalaryDetails();
  }, [month, year]);

  const handleUpdateClick = (staff) => {
    setSelectedStaff(staff);
    setBonus(staff.salaryDetails?.bonus || 0);
    setLeaveSalary(staff.salaryDetails?.leaveSalary || 0);
    setIsModalOpen(true);
  };
  
  const handleBonusLeaveUpdate = async () => {
    if (!selectedStaff) return;
  
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
  
      const response = await axios.put("http://localhost:3000/api/salary/update-bonus-leave", bonusData);
  
      if (response.status === 200) {
        setStaffDetails(prevList =>
          prevList.map(staff =>
            staff.userId === selectedStaff.userId
              ? { ...staff, salaryDetails: { ...staff.salaryDetails, bonus, leaveSalary } }
              : staff
          )
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating bonus/leave salary:", error);
      setError("Failed to update bonus/leave salary");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaySalary = async (staff) => {
    try {
      if (!staff) {
        setError("No staff member selected");
        return;
      }
  
      const payData = {
        userId: staff.userId,
        bonus: staff.salaryDetails?.bonus || 0,
        leaveSalary: staff.salaryDetails?.leaveSalary || 0,
        month: staff.salaryDetails?.month,
        year: staff.salaryDetails?.year,
        status: "paid",
      };
  
      const response = await axios.put("http://localhost:3000/api/salary/update-bonus-leave", payData);
  
      if (response.status === 200) {
        setStaffDetails(prevList =>
          prevList.map(s =>
            s.userId === staff.userId
              ? { ...s, salaryDetails: { ...s.salaryDetails, status: "paid" } }
              : s
          )
        );
      }
    } catch (error) {
      console.error("Error updating salary status:", error);
      setError("Failed to update salary status");
    }
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.default}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                <FiArrowLeft />
                Back
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <FaMoneyBillWave className="text-indigo-600" />
                Staff Salary Management
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage and process staff salary payments
            </p>
          </div>
          
          <button
            onClick={() => navigate("/assign-salary")}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            <FiPlus />
            Assign Salary
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-4 mb-6 rounded-lg ${darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}>
            {error}
          </div>
        )}

        {/* Filters */}
        <div className={`mb-6 p-4 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiCalendar />
                Month
              </label>
              <select
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {Array.from(new Set(staffDetails.map(s => s.salaryDetails?.month))).map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Year
              </label>
              <select
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All Year</option>
                {Array.from(new Set(staffDetails.map(s => s.salaryDetails?.year))).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : staffDetails.length > 0 ? (
          <div className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    {[
                      { name: "Staff", icon: <FiUser /> },
                      { name: "Bank", icon: <BsBank2 /> },
                      { name: "Salary", icon: <FiDollarSign /> },
                      { name: "EPF/ETF", icon: <FaPiggyBank /> },
                      { name: "Bonus", icon: <FiPercent /> },
                      { name: "Status", icon: <FiCheck /> },
                      { name: "Actions", icon: <FiEdit2 /> }
                    ].map((header, index) => (
                      <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          {header.icon}
                          {header.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {staffDetails.map((staff) => (
                    <tr key={staff._id} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <FiUser className="text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {staff.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {staff.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {staff.bank || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {staff.branch} ••••{staff.accountNumber?.slice(-4)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold">
                          {formatCurrency(staff.salaryDetails?.salary)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {staff.salaryDetails?.month || 'N/A'} {staff.salaryDetails?.year || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          EPF: {formatCurrency(staff.salaryDetails?.EPF?.employee)} (E)
                        </div>
                        <div className="text-sm">
                          {formatCurrency(staff.salaryDetails?.EPF?.employer)} (ER)
                        </div>
                        <div className="text-sm">
                          ETF: {formatCurrency(staff.salaryDetails?.ETF)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          Bonus: {formatCurrency(staff.salaryDetails?.bonus)}
                        </div>
                        <div className="text-sm">
                          Leave: {formatCurrency(staff.salaryDetails?.leaveSalary)}
                        </div>
                        <div className="text-sm font-semibold">
                          Total: {formatCurrency(staff.salaryDetails?.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={staff.salaryDetails?.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateClick(staff)}
                            disabled={staff.salaryDetails?.status === "paid"}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                              staff.salaryDetails?.status === "paid" 
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed" 
                                : "bg-yellow-500 hover:bg-yellow-600 text-white"
                            }`}
                          >
                            <FiEdit2 size={14} />
                            Adjust
                          </button>
                          <button
                            onClick={() => handlePaySalary(staff)}
                            disabled={staff.salaryDetails?.status === "paid"}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                              staff.salaryDetails?.status === "paid" 
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed" 
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            <FiCheck size={14} />
                            Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={`p-8 rounded-xl shadow-sm text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="mx-auto max-w-md">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full inline-flex mb-4">
                <FiDollarSign className="text-indigo-600 dark:text-indigo-300 text-2xl" />
              </div>
              <h3 className="text-lg font-medium mb-2">No staff records found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {month || year !== new Date().getFullYear() 
                  ? "No staff match your filter criteria" 
                  : "No staff salary records available"}
              </p>
              <button
                onClick={() => navigate("/assign-salary")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Assign New Salary
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`relative rounded-xl shadow-lg p-6 max-w-md w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiX className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiEdit2 />
              Update Payment Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bonus Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                    className={`pl-8 w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Leave Deduction</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaveSalary}
                    onChange={(e) => setLeaveSalary(Number(e.target.value))}
                    className={`pl-8 w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBonusLeaveUpdate}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-70"
                >
                  {loading ? "Updating..." : "Update Details"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}