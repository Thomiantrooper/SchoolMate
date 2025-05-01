import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import { 
  FiDollarSign, 
  FiUser, 
  FiMail, 
  FiArrowLeft,
  FiSave,
  FiLoader
} from 'react-icons/fi';

export default function AssignSalary() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [salaryInputs, setSalaryInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get the current month and year
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Fetch staff salary details
  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setFetching(true);
        const response = await axios.get("http://localhost:3000/api/salary/bank");
        setStaffList(response.data);
        
        // Initialize salary inputs with existing values
        const initialInputs = {};
        response.data.forEach(staff => {
          if (staff.salary) {
            initialInputs[staff.userId._id || staff.userId] = { salary: staff.salary };

          }
        });
        setSalaryInputs(initialInputs);
      } catch (error) {
        console.error("Error fetching staff details:", error);
        setError("Failed to load staff data");
      } finally {
        setFetching(false);
      }
    };

    fetchStaffDetails();
  }, []);

  const handleSalaryChange = (userId, value) => {
    const id = userId._id || userId;
setSalaryInputs(prev => ({
  ...prev,
  [id]: { salary: value }
}));
  };

  const handleSalarySubmit = async (staff) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const id = staff.userId._id || staff.userId;
const salaryValue = salaryInputs[id]?.salary || staff.salary || 0;

      
      const salaryData = {
        userId: staff.userId,
        salary: parseFloat(salaryValue),
        month: currentMonthName,
        year: currentYear,
      };

      const response = await axios.put(
        "http://localhost:3000/api/salary/update-salary", 
        salaryData
      );
      
      if (response.data.message) {
        setSuccess(response.data.message);
      } else {
        setSuccess("Salary assigned/updated successfully!");
      }

      // Update local state
      setStaffList(prevList =>
        prevList.map(s =>
          s.userId === staff.userId
            ? { ...s, salary: salaryData.salary }
            : s
        )
      );
    } catch (error) {
      console.error("Error submitting salary:", error);
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      "Failed to assign/update salary";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatStaffId = (email) => {
    return email ? email.split('@')[0] : 'N/A';
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
                <FiDollarSign className="text-indigo-600" />
                Assign & Manage Staff Salaries
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Current Period: {currentMonthName} {currentYear}
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className={`p-4 mb-6 rounded-lg ${darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}>
            {error}
          </div>
        )}
        {success && (
          <div className={`p-4 mb-6 rounded-lg ${darkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"}`}>
            {success}
          </div>
        )}

        {/* Content */}
        {fetching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : staffList.length > 0 ? (
          <div className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiUser />
                        Staff Member
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiDollarSign />
                        Monthly Salary
                      </div>
                    </th>
                    <th scope="col" className="flex px-10 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {staffList.map((staff) => (
                    <tr key={staff.userId} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
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
                              {formatStaffId(staff.userId.email)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {staff.userId.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
  <span className="absolute inset-y-0 left-2 flex items-center text-gray-500 pointer-events-none">
    LKR
  </span>
  <input
    type="number"
    min="0"
    step="0.01"
    className={`pl-12 pr-2 py-2 border rounded-lg w-32 
      ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
    value={
      salaryInputs[staff.userId._id || staff.userId]?.salary !== undefined
        ? salaryInputs[staff.userId._id || staff.userId]?.salary
        : staff.salary ?? ''
    }
    onChange={(e) => handleSalaryChange(staff.userId, e.target.value)}
    placeholder="0.00"
  />
</div>



                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleSalarySubmit(staff)}
                          disabled={loading}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            loading 
                              ? "bg-gray-400 cursor-not-allowed" 
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          }`}
                        >
                          {loading ? (
                            <>
                              <FiLoader className="animate-spin" />
                              Processing
                            </>
                          ) : (
                            <>
                              <FiSave />
                              Save
                            </>
                          )}
                        </button>
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
              <h3 className="text-lg font-medium mb-2">No staff members found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are currently no staff members available to assign salaries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}