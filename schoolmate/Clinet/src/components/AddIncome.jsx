import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ThemeContext } from "../components/ThemeLayout";
import { useParams, useNavigate } from "react-router-dom";

const AddIncomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { incomeId } = useParams();
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const [income, setIncome] = useState({
    name: "",
    email: "",
    amount: "",
    paymentMethod: "Cash",
    bank: "",
    branch: "",
    date: "",
    month: "March",
    slipImage: null,
    reason: "",
    status: "pending",
  });

  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (incomeId) {
      console.log("Fetching data for incomeId:", incomeId);  // Check if ID is correct
      fetchIncomeData(incomeId);
    }
  }, [incomeId]);

  const fetchIncomeData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/income/${id}`);
      console.log(response); // Log the response data
      if (response.data && response.data.data) {
        setIncome(response.data.data);
        if (response.data.data.slipImage) {
          setPreview(`http://localhost:3000/${response.data.data.slipImage}`);
        }
        const formattedDate = new Date(response.data.data.date).toISOString().split('T')[0];
        setIncome((prevIncome) => ({
          ...prevIncome,
          date: formattedDate, // Set the correct date format (yyyy-MM-dd)
        }));
      } else {
        setError("Income record not found.");
      }
    } catch (error) {
      console.error("Error fetching income:", error.response ? error.response.data : error.message);
      setError("Error loading income data. Please check the ID and API.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value < 0) return; // Prevent negative amounts
    setIncome({ ...income, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIncome({ ...income, slipImage: file });
    setPreview(URL.createObjectURL(file)); // Show preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    Object.keys(income).forEach((key) => {
      formData.append(key, income[key]);
    });

    try {
      const url = incomeId
        ? `http://localhost:3000/api/income/${incomeId}`
        : "http://localhost:3000/api/income";

      const method = incomeId ? axios.put : axios.post;

      await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin-income");
    } catch (error) {
      setError("Error saving income. Please try again.");
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-4">{incomeId ? "Edit Income" : "Add Income"}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={income.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={income.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={income.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Payment Method</label>
          <select
            name="paymentMethod"
            value={income.paymentMethod}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Bank</label>
          <input
            type="text"
            name="bank"
            value={income.bank}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Branch</label>
          <input
            type="text"
            name="branch"
            value={income.branch}
            onChange={handleInputChange}
           className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={income.date}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Month</label>
          <select
            name="month"
            value={income.month}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          >
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Reason</label>
          <input
            type="text"
            name="reason"
            value={income.reason}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            name="status"
            value={income.status}
            onChange={handleInputChange}
           className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Receipt Image</label>
          <input
            type="file"
            name="slipImage"
            onChange={handleFileChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          />
          {preview && <img src={preview} alt="Preview" className="mt-4 max-w-xs" />}
        </div>
        <div className="flex justify-center mt-4">
  <button
    type="submit"
    className="px-6 py-2 w-[200px] h-[60px] bg-blue-600 text-white rounded-md hover:bg-blue-700"
  >
    {incomeId ? "Update Income" : "Add Income"}
  </button>
</div>

      </form>
    </div>
  );
};

export default AddIncomePage;
