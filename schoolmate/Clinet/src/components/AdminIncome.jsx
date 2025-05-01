import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiArrowLeft, 
  FiDollarSign, 
  FiCalendar, 
  FiUser, 
  FiCreditCard, 
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiImage
} from "react-icons/fi";
import { BsBank2 } from 'react-icons/bs';

const IncomeList = () => {
  const { darkMode } = useContext(ThemeContext);
  const [incomes, setIncomes] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [month, setMonth] = useState("All");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/income`);
      setIncomes(response.data.data);
    } catch (error) {
      console.error("Error loading incomes:", error);
    }
    setLoading(false);
  };

  const filteredIncomes = month === "All" 
  ? incomes 
  : incomes.filter(income => income.month === month);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/income/${id}`);
      setMessage({ 
        text: "Income deleted successfully", 
        type: "success" 
      });
      fetchIncomes();
    } catch (error) {
      setMessage({ 
        text: "Error deleting income", 
        type: "error" 
      });
    }
  };

  const downloadReceipt = (imagePath) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3000/${imagePath}`;
    link.download = `receipt-${Date.now()}.${imagePath.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 p-2 rounded-lg mr-4 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            <FiArrowLeft className="text-xl" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FiDollarSign className="text-green-600" />
            Income Records
          </h2>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <FiCalendar />
          Select Month
        </label>
        <select
          onChange={(e) => setMonth(e.target.value)}
          value={month}
          className={`p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
        >
          <option value="All">All Months</option>
          {["January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"]
            .map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
          <button 
            onClick={() => navigate("/admin-income/add")} 
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <FiPlus />
            Add Income
          </button>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.type === 'success' 
              ? darkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"
              : darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        {/* Income Table */}
        {loading ? (
          <><p>Loading...</p>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div></>
) : loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
) : filteredIncomes.length > 0 ? (
  <div className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <FiUser />
                Payer
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <FiDollarSign />
                Amount
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <BsBank2 />
                Bank Details
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <FiCreditCard />
                Method
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <FiCalendar />
                Date/Month
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <FiFileText />
                Reason
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <FiImage />
                Receipt
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-20 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredIncomes.map((income) => (
            <tr key={income._id} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <FiUser className="text-green-600 dark:text-green-300" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">
                      {income.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {income.email || 'Unknown'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                ${income.amount?.toFixed(2) || '0.00'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div>{income.bank || 'N/A'}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  {income.branch || ''}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {income.paymentMethod || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {new Date(income.date).toLocaleDateString()}
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  {income.month}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {income.reason || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {income.slipImage ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={`http://localhost:3000/${income.slipImage}`}
                      alt="Receipt"
                      className="w-10 h-10 object-cover rounded cursor-pointer"
                      onClick={() => openModal(income.slipImage)}
                    />
                    <button 
                      onClick={() => downloadReceipt(income.slipImage)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      <FiDownload />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No receipt</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  income.status === 'Paid' 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}>
                  {income.status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => income._id && navigate(`/admin-income/add/${income._id}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(income._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                  >
                    <FiTrash2 size={14} />
                    Delete
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
      <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full inline-flex mb-4">
        <FiDollarSign className="text-green-600 dark:text-green-300 text-2xl" />
      </div>
      <h3 className="text-lg font-medium mb-2">No income records found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {month === "All" 
          ? "No income records available" 
          : `No income records found for ${month}`}
      </p>
      <button
        onClick={() => navigate("/admin-income/add")}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
      >
        Add New Income
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default IncomeList;