import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout"; 
import axios from "axios";
import { 
  FiDollarSign, 
  FiSearch, 
  FiCalendar, 
  FiUser,
  FiMail,
  FiBook,
  FiCreditCard,
  FiCheck,
  FiX,
  FiImage,
  FiDownload,
  FiArrowLeft
} from 'react-icons/fi';
import { BsBank2, BsFilter } from 'react-icons/bs';

export default function AdminStudentFees() {
  const { darkMode } = useContext(ThemeContext);
  const [fees, setFees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/payments");
        setFees(response.data);
      } catch (error) {
        console.error("Error fetching fees:", error);
        setError("Failed to load payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/payments/${id}`, { status: "paid" });
      setFees(fees.map(fee => 
        fee._id === id ? { ...fee, status: "paid" } : fee
      ));
    } catch (error) {
      console.error("Error accepting payment:", error);
      alert("Failed to accept payment.");
    }
  };
  
  const handleDeny = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/payments/${id}`, { status: "failed" });
      setFees(fees.map(fee => 
        fee._id === id ? { ...fee, status: "failed" } : fee
      ));
    } catch (error) {
      console.error("Error denying payment:", error);
      alert("Failed to deny payment.");
    }
  };

  const openModal = (imagePath) => {
    setSelectedImage(imagePath);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const downloadSlip = (imagePath) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3000/${imagePath}`;
    link.download = `payment-slip-${Date.now()}.${imagePath.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFees = fees.filter(fee => 
    (selectedMonth === "" || fee.month === selectedMonth) &&
    (filterClass === "" || fee.grade === filterClass) &&
    (
      fee.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.bank?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.method?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 dark:bg-gray-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-8 gap-4">
          <button
            onClick={() => window.location.href = "/dashboard?tab=finance"}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <FiArrowLeft />
            Back
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <FiDollarSign className="text-indigo-600" />
              Student Fee Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Review and manage student fee payments
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={`mb-6 p-4 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <BsFilter />
                Filter by Month
              </label>
              <select 
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {Array.from(new Set(fees.map(fee => fee.month))).map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiBook />
                Filter by Class
              </label>
              <select 
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                value={filterClass} 
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {Array.from(new Set(fees.map(fee => fee.grade))).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiSearch />
                Search Payments
              </label>
              <input 
                type="text" 
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                placeholder="Search by name, email, bank..."
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-center">
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        ) : filteredFees.length > 0 ? (
          <div className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiUser />
                        Student
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiBook />
                        Class
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <BsBank2 />
                        Bank
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
                        <FiCalendar />
                        Month
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
                        <FiImage />
                        Slip
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFees.map((fee) => (
                    <tr key={fee._id} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <FiUser className="text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {fee.userId?.username || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {fee.userId?.email || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fee.grade || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{fee.bank || 'N/A'}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {fee.branch || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        ${fee.amount || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fee.month || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fee.method || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fee.slipImage ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={`http://localhost:3000/${fee.slipImage}`}
                              alt="Slip"
                              className="w-10 h-10 object-cover rounded cursor-pointer"
                              onClick={() => openModal(fee.slipImage)}
                            />
                            <button 
                              onClick={() => downloadSlip(fee.slipImage)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                            >
                              <FiDownload />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">No slip</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={fee.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAccept(fee._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                          >
                            <FiCheck size={14} />
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeny(fee._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                          >
                            <FiX size={14} />
                            Deny
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
              <h3 className="text-lg font-medium mb-2">No payments found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || selectedMonth || filterClass
                  ? "No payments match your search criteria" 
                  : "No payment records available"}
              </p>
              {(searchQuery || selectedMonth || filterClass) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMonth("");
                    setFilterClass("");
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2"
            >
              <FiX size={24} />
            </button>
            <div className={`rounded-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <img
                src={`http://localhost:3000/${selectedImage}`}
                alt="Payment slip"
                className="w-full max-h-[80vh] object-contain"
              />
              <div className={`p-4 flex justify-between items-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Payment slip preview
                </span>
                <button
                  onClick={() => downloadSlip(selectedImage)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  <FiDownload />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}