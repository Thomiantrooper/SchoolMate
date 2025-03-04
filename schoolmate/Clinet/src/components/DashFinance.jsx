import { useContext } from "react";
import { ThemeContext } from "./ThemeLayout";

export default function FinanceDashboard() {
  const { darkMode } = useContext(ThemeContext);


  return (
    <div
      className={`p-6 flex flex-col items-center w-full min-h-[80vh] transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-bold">💰 Finance Dashboard</h1>
        <button
          onClick={() => window.location.href = "/admin-finance"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
        >
          Go to Admin Panel
        </button>
      </div>

      {/* Finance Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl">
        <button onClick={() => window.location.href = "/admin-student-fee"} className="p-4 rounded-lg shadow-md bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-300">
          Student Fees
        </button>
        <button onClick={() => window.location.href = "/admin-staff-salary"} className="p-4 rounded-lg shadow-md bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-all duration-300">
          Staff Salary
        </button>
        <button onClick={() => window.location.href = "/admin-maintenance"} className="p-4 rounded-lg shadow-md bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-300">
          Maintenance
        </button>
        <button onClick={() => window.location.href = "/admin-income"} className="p-4 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all duration-300">
          Income
        </button>
      </div>
    </div>
  );
}
