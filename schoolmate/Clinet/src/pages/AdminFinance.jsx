import { useState, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout"; 

export default function AdminFinance() {
  const { darkMode } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Salary", amount: 5000, type: "income", date: "2025-02-28" },
    { id: 2, name: "Rent", amount: 1200, type: "expense", date: "2025-02-27" },
    { id: 3, name: "Groceries", amount: 300, type: "expense", date: "2025-02-26" },
    { id: 4, name: "Freelance Work", amount: 800, type: "income", date: "2025-02-25" },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    type: "income",
    date: "",
  });

  // Add Transaction
  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.date) return;

    setTransactions([...transactions, { ...newTransaction, id: transactions.length + 1, amount: Number(newTransaction.amount) }]);
    setNewTransaction({ name: "", amount: "", type: "income", date: "" });
  };

  // Delete Transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      
      {/* Header */}
      <div className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h1 className="text-2xl font-bold">🛠️ Admin Finance Panel</h1>
        <button 
          onClick={() => window.location.href = "/dashboard?tab=finance"} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded">
          Back to Dashboard
        </button>
      </div>

      {/* Add Transaction Form */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-3">➕ Add New Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Transaction Name" 
            value={newTransaction.name} 
            onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={newTransaction.amount} 
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
          />
          <select 
            value={newTransaction.type} 
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input 
            type="date" 
            value={newTransaction.date} 
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className={`border p-2 rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
          />
        </div>
        <button 
          onClick={handleAddTransaction} 
          className="mt-3 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded">
          Add Transaction
        </button>
      </div>

      {/* Transactions Table */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-2">📋 Manage Transactions</h2>
        <table className="w-full border-collapse shadow-md">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
              <th className="p-2">Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                <td className="p-2 font-semibold">{t.name}</td>
                <td className="p-2">${t.amount}</td>
                <td className="p-2">{t.date}</td>
                <td className={`p-2 ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </td>
                <td className="p-2">
                  <button 
                    onClick={() => handleDeleteTransaction(t.id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
