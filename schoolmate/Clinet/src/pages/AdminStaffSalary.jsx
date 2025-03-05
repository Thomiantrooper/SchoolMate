import { useState, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout";

export default function AdminStaffSalary() {
  const { darkMode } = useContext(ThemeContext);
  const [staffSalaries, setStaffSalaries] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", salary: 5000, epf: 500, etf: 300, bonus: 200, month: "February", status: "Pending" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", salary: 5500, epf: 550, etf: 350, bonus: 250, month: "February", status: "Paid" },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setStaffSalaries(staffSalaries.map(salary => salary.id === id ? { ...salary, status: newStatus } : salary));
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      
      {/* Header */}
      <div className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h1 className="text-2xl font-bold">💼 Staff Salary Management</h1>
      </div>

      {/* Staff Salaries Table */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-2">📋 Manage Staff Salaries</h2>
        <table className="w-full border-collapse shadow-md">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Salary</th>
              <th className="p-2">EPF</th>
              <th className="p-2">ETF</th>
              <th className="p-2">Bonus</th>
              <th className="p-2">Month</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffSalaries.map((staff) => (
              <tr key={staff.id} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                <td className="p-2 font-semibold">{staff.id}</td>
                <td className="p-2">{staff.name}</td>
                <td className="p-2">{staff.email}</td>
                <td className="p-2">${staff.salary}</td>
                <td className="p-2">${staff.epf}</td>
                <td className="p-2">${staff.etf}</td>
                <td className="p-2">${staff.bonus}</td>
                <td className="p-2">{staff.month}</td>
                <td className={`p-2 font-semibold ${staff.status === "Paid" ? "text-green-500" : "text-red-500"}`}>{staff.status}</td>
                <td className="p-2">
                  {staff.status === "Pending" && (
                    <button 
                      onClick={() => handleStatusChange(staff.id, "Paid")} 
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2">
                      ✅ Pay
                    </button>
                  )}
                  {staff.status === "Paid" && (
                    <button 
                      onClick={() => handleStatusChange(staff.id, "Pending")} 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      ❌ Undo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}