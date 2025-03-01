import { useState } from "react";

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Salary", amount: 5000, type: "income", date: "2025-02-28" },
    { id: 2, name: "Rent", amount: 1200, type: "expense", date: "2025-02-27" },
    { id: 3, name: "Groceries", amount: 300, type: "expense", date: "2025-02-26" },
    { id: 4, name: "Freelance Work", amount: 800, type: "income", date: "2025-02-25" },
  ]);

  const totalRevenue = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = totalRevenue - totalExpenses;

  return (
    <div className="bg-gray-100 text-gray-900 p-6 flex flex-col items-center w-full min-h-[80vh]">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">💰 Finance Dashboard</h1>
        <button 
          onClick={() => window.location.href = "/admin-finance"} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded">
          Go to Admin Panel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mb-6">
        {/* Total Revenue */}
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700">Total Revenue</h3>
          <p className="text-2xl font-bold">${totalRevenue}</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-red-700">Total Expenses</h3>
          <p className="text-2xl font-bold">${totalExpenses}</p>
        </div>

        {/* Balance */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-700">Balance</h3>
          <p className="text-2xl font-bold">${balance}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <table className="w-full border-collapse shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="p-2 font-semibold">{t.name}</td>
                <td className="p-2">${t.amount}</td>
                <td className="p-2">{t.date}</td>
                <td className={`p-2 ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
