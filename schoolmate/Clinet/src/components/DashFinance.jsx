import { useContext } from "react";
import { ThemeContext } from "./ThemeLayout";
import PaymentStats from "./FeePaymentStats";
import { motion } from "framer-motion";
import { 
  FiDollarSign, 
  FiCreditCard, 
  FiUsers, 
  FiTool, 
  FiTrendingUp,
  FiArrowRight,
  FiPieChart,
  FiSettings
} from "react-icons/fi";

export default function FinanceDashboard() {
  const { darkMode } = useContext(ThemeContext);

  const financeOptions = [
    { 
      name: "Student Fees", 
      link: "/admin-student-fee", 
      icon: <FiCreditCard size={24} />,
      color: "from-green-500 to-teal-500",
      desc: "Manage student tuition and fees"
    },
    { 
      name: "Staff Salary", 
      link: "/admin-staff-salary", 
      icon: <FiDollarSign size={24} />,
      color: "from-amber-500 to-yellow-500",
      desc: "Process payroll and compensation"
    },
    { 
      name: "Maintenance", 
      link: "/admin-maintenance", 
      icon: <FiTool size={24} />,
      color: "from-red-500 to-pink-500",
      desc: "Track facility expenses"
    },
    { 
      name: "Income", 
      link: "/admin-income", 
      icon: <FiTrendingUp size={24} />,
      color: "from-blue-500 to-indigo-500",
      desc: "View revenue streams"
    },
  ];

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl shadow-lg mb-8 ${darkMode ? "bg-gray-800" : "bg-white"} flex flex-col md:flex-row justify-between items-center`}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className={`p-3 rounded-lg mr-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} shadow-md`}>
              <FiDollarSign className="text-2xl text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Finance Dashboard</h1>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Overview of financial operations and metrics
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/admin-finance"}
            className={`px-5 py-3 rounded-lg font-medium flex items-center ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
          >
            <FiSettings className="mr-2" /> Admin Panel
          </motion.button>
        </motion.div>

        {/* Finance Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financeOptions.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                onClick={() => window.location.href = option.link}
                className={`h-full p-6 rounded-xl shadow-md cursor-pointer bg-gradient-to-r ${option.color} text-white transition-all hover:shadow-lg`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-full bg-white bg-opacity-20">
                    {option.icon}
                  </div>
                  <FiArrowRight className="text-white opacity-70" />
                </div>
                <h3 className="text-xl font-bold mt-4">{option.name}</h3>
                <p className="text-white text-opacity-90 mt-2 text-sm">{option.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats and Charts Section */}
        <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <FiPieChart className="mr-2" /> Financial Overview
            </h2>
            <div className="flex space-x-2">
              <button className={`px-3 py-1 rounded-lg text-sm ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                Monthly
              </button>
              <button className={`px-3 py-1 rounded-lg text-sm ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                Quarterly
              </button>
              <button className={`px-3 py-1 rounded-lg text-sm ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
                Annual
              </button>
            </div>
          </div>
          <PaymentStats darkMode={darkMode} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Total Revenue</h3>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <FiTrendingUp />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">$124,568</p>
            <p className={`text-sm mt-1 ${darkMode ? "text-green-400" : "text-green-600"}`}>
              ↑ 12% from last month
            </p>
          </div>

          <div className={`p-6 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Pending Payments</h3>
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <FiCreditCard />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">$24,320</p>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              48 unpaid invoices
            </p>
          </div>

          <div className={`p-6 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Operational Costs</h3>
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <FiTool />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">$58,742</p>
            <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-600"}`}>
              ↑ 8% from last month
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={`mt-8 p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiDollarSign className="mr-2" /> Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "2023-06-15", desc: "Tuition Payment", category: "Student Fees", amount: "$1,200", status: "Completed" },
                  { date: "2023-06-14", desc: "Teacher Salary", category: "Staff", amount: "$2,500", status: "Completed" },
                  { date: "2023-06-12", desc: "Building Maintenance", category: "Facilities", amount: "$850", status: "Pending" },
                  { date: "2023-06-10", desc: "Textbooks", category: "Supplies", amount: "$1,750", status: "Completed" },
                  { date: "2023-06-08", desc: "Sports Equipment", category: "Activities", amount: "$620", status: "Completed" },
                ].map((transaction, index) => (
                  <tr key={index} className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <td className="p-3">{transaction.date}</td>
                    <td className="p-3">{transaction.desc}</td>
                    <td className="p-3">{transaction.category}</td>
                    <td className="p-3 font-medium">{transaction.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Completed" 
                          ? (darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800")
                          : (darkMode ? "bg-amber-900 text-amber-300" : "bg-amber-100 text-amber-800")
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}