import { useState } from "react";

export default function AdminFinance() {
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
    <div className="bg-gray-100 text-gray-900 p-6 flex flex-col items-center w-full min-h-screen">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">🛠️ Admin Finance Panel</h1>
        <button 
          onClick={() => window.location.href = "/dashboard?tab=finance"} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded">
          Back to Dashboard
        </button>
      </div>

      {/* Add Transaction Form */}
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3">➕ Add New Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Transaction Name" 
            value={newTransaction.name} 
            onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={newTransaction.amount} 
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className="border p-2 rounded"
          />
          <select 
            value={newTransaction.type} 
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input 
            type="date" 
            value={newTransaction.date} 
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button 
          onClick={handleAddTransaction} 
          className="mt-3 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded">
          Add Transaction
        </button>
      </div>

      {/* Transactions Table */}
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">📋 Manage Transactions</h2>
        <table className="w-full border-collapse shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Actions</th>
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
