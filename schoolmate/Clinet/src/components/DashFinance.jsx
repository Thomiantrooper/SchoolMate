import { useContext } from "react";
import { ThemeContext } from "./ThemeLayout";
import PaymentStats from "./FeePaymentStats";

export default function FinanceDashboard() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`p-6 flex flex-col items-center w-full min-h-[80vh] transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header Section */}
      <div
        className={`w-full max-w-6xl flex flex-col md:flex-row justify-between items-center p-6 rounded-lg shadow-lg mb-8 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h1 className="text-3xl font-extrabold">💰 Finance Dashboard</h1>
        <button
          onClick={() => window.location.href = "/admin-finance"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-3 rounded-lg transition-all duration-300 shadow-md"
        >
          Go to Admin Panel
        </button>
      </div>

      {/* Finance Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {[
          { name: "Student Fees", link: "/admin-student-fee", color: "green" },
          { name: "Staff Salary", link: "/admin-staff-salary", color: "yellow" },
          { name: "Maintenance", link: "/admin-maintenance", color: "red" },
          { name: "Income", link: "/admin-income", color: "blue" },
        ].map((option, index) => (
          <button
            key={index}
            onClick={() => window.location.href = option.link}
            className={`p-5 rounded-lg shadow-md text-white font-bold text-lg transition-all duration-300 bg-${option.color}-500 hover:bg-${option.color}-600`}
          >
            {option.name}
          </button>
        ))}
      </div>

      <div
        className={`w-full max-w-6xl mt-8 p-6 shadow-lg rounded-lg transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">📊 Payment Statistics</h2>
        <PaymentStats />
      </div>
    </div>
  );
}
