import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IncomeList = () => {
  const { darkMode } = useContext(ThemeContext);
  const [incomes, setIncomes] = useState([]);
  const [message, setMessage] = useState("");
  const [month, setMonth] = useState("March");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate instead of useHistory

  useEffect(() => {
    fetchIncomes();
  }, [month]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/income`);
      setIncomes(response.data.data);
      setMessage("");
    } catch (error) {
      setMessage("Error loading incomes. Please try again.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/income/${id}`);
      fetchIncomes();
    } catch (error) {
      setMessage("Error deleting income.");
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-4">Income Records for {month}</h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Select Month:</label>
          <select
            onChange={(e) => setMonth(e.target.value)}
            value={month}
            className={`p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
          >
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <button onClick={() => navigate("/admin-income/add")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Add Income
        </button>
      </div>

      {message && <p className="text-red-500">{message}</p>}

      {loading ? (
        <p className="text-center text-lg mt-4">Loading...</p>
      ) : incomes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg text-center">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Amount</th><th>Bank</th><th>Branch</th><th>Payment Method</th><th>Date</th><th>Month</th><th>Reason</th><th>Status</th><th>Receipt</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income._id}>
                  <td>{income.name}</td>
                  <td>{income.email}</td>
                  <td>${income.amount.toFixed(2)}</td>
                  <td>{income.bank}</td>
                  <td>{income.branch}</td>
                  <td>{income.paymentMethod}</td>
                  <td>{new Date(income.date).toLocaleDateString()}</td>
                  <td>{income.month}</td>
                  <td>{income.reason}</td>
                  <td>{income.status}</td>
                  <td>{income.slipImage && <img src={`http://localhost:3000/${income.slipImage}`} alt="Receipt" className="w-12 h-12 object-cover rounded ml-5" />}</td>
                  <td>
                  <button
  onClick={() => {
    if (income._id) {
      navigate(`/admin-income/add/${income._id}`);
    } else {
      console.error("Income ID is missing");
    }
  }}
  className="px-2 py-1 bg-yellow-500 text-white rounded"
>
  Edit
</button>
                    <button onClick={() => handleDelete(income._id)} className="px-2 py-1 bg-red-600 text-white rounded ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg mt-4">No income records found for {month}.</p>
      )}
    </div>
  );
};

export default IncomeList;
