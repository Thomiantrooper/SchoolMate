import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiDollarSign, FiCreditCard, FiMail, FiUser } from "react-icons/fi";
import { BsBank2, BsCalendarMonth } from "react-icons/bs";
import { FaMoneyBillWave, FaPiggyBank } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

export default function StaffBankAndSalaryList() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [salaryDetails, setSalaryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);

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
      
      if (response.status === 200) {
        setSalaryDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching salary details:", error);
      setErrorMessage("Failed to fetch salary details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpand = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(i => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              My Salary & Bank Details
            </h1>
          </div>
          
          <button
            onClick={() => navigate("/staff-page/bank-details")}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            <FiPlus className="text-lg" />
            <span>Add Bank Details</span>
          </button>
        </div>

        {/* Stats Cards */}
        {!loading && salaryDetails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  <FiDollarSign className="text-indigo-600 dark:text-indigo-300 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Latest Salary</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(salaryDetails[0]?.salary)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FaMoneyBillWave className="text-green-600 dark:text-green-300 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Paid</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(salaryDetails.reduce((sum, item) => {
                      return sum + (item.salaryDetails?.status === 'paid' ? item.salary : 0);
                    }, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FaPiggyBank className="text-blue-600 dark:text-blue-300 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total EPF</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(salaryDetails.reduce((sum, item) => {
                      return sum + (item.salaryDetails?.EPF?.employee || 0);
                    }, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <RiMoneyDollarCircleLine className="text-purple-600 dark:text-purple-300 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Bonus</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(salaryDetails.reduce((sum, item) => {
                      return sum + (item.salaryDetails?.bonus || 0);
                    }, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your salary details...</p>
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-300">{errorMessage}</p>
                <button
                  onClick={fetchSalaryDetails}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : salaryDetails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Month
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Bank Details
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {salaryDetails.map((data, index) => (
                    <React.Fragment key={index}>
                      <tr 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${expandedRows.includes(index) ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                        onClick={() => toggleRowExpand(index)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                              <BsCalendarMonth className="text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {data?.salaryDetails?.month}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {data?.salaryDetails?.status === 'paid' ? 'Paid' : 'Pending'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <BsBank2 className="text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {data?.bank || 'Not specified'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {data?.accountNumber ? `•••• ${data.accountNumber.slice(-4)}` : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(data?.salaryDetails?.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            data?.salaryDetails?.status === 'paid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {data?.salaryDetails?.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpand(index);
                            }}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                          >
                            {expandedRows.includes(index) ? 'Hide details' : 'View details'}
                          </button>
                        </td>
                      </tr>
                      {expandedRows.includes(index) && (
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <td colSpan="5" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Bank Details */}
                              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                  <FiCreditCard className="text-blue-500" />
                                  Bank Information
                                </h3>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bank Name</p>
                                    <p className="text-gray-900 dark:text-white">{data?.bank || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Branch</p>
                                    <p className="text-gray-900 dark:text-white">{data?.branch || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
                                    <p className="text-gray-900 dark:text-white">{data?.accountNumber || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Holder</p>
                                    <p className="text-gray-900 dark:text-white">{data?.name || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Salary Breakdown */}
                              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                  <FiDollarSign className="text-green-500" />
                                  Salary Breakdown
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Basic Salary</span>
                                    <span className="font-medium">{formatCurrency(data?.salary)}</span>
                                  </div>
                                  <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Bonus</span>
                                    <span className="font-medium">+ {formatCurrency(data.salaryDetails?.bonus)}</span>
                                  </div>
                                  <div className="flex justify-between text-red-600 dark:text-red-400">
                                    <span>EPF (Employee)</span>
                                    <span className="font-medium">- {formatCurrency(data.salaryDetails?.EPF?.employee)}</span>
                                  </div>
                                  <div className="flex justify-between text-red-600 dark:text-red-400">
                                    <span>Leave Deductions</span>
                                    <span className="font-medium">- {formatCurrency(data.salaryDetails?.leaveSalary)}</span>
                                  </div>
                                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between font-semibold">
                                    <span>Net Salary</span>
                                    <span>{formatCurrency(data.salaryDetails?.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto flex flex-col items-center justify-center max-w-md">
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
                  <FiDollarSign className="text-indigo-600 dark:text-indigo-300 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No salary records found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your salary details will appear here once they are available.
                </p>
                <button
                  onClick={() => navigate("/staff-page/bank-details")}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Add Your Bank Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}