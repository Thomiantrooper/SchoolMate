import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ThemeContext } from "../components/ThemeLayout";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiDollarSign, 
  FiCreditCard, 
  FiCalendar,
  FiHome, 
  FiFileText,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiSave,
  FiEdit2,
  FiX
} from "react-icons/fi";
import { BsBank2 } from "react-icons/bs";

const AddIncomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { incomeId } = useParams();
  const navigate = useNavigate();

  const [income, setIncome] = useState({
    name: "",
    email: "",
    amount: "",
    paymentMethod: "Cash",
    bank: "",
    branch: "",
    date: new Date().toISOString().split('T')[0],
    month: new Date().toLocaleString('default', { month: 'long' }),
    slipImage: null,
    reason: "",
    status: "pending",
    removeImage: false
  });

  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (incomeId) {
      fetchIncomeData(incomeId);
    }
  }, [incomeId]);

  const fetchIncomeData = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/income/${id}`);
      if (response.data?.data) {
        const incomeData = response.data.data;
        const formattedDate = new Date(incomeData.date).toISOString().split('T')[0];
        
        setIncome({
          ...incomeData,
          date: formattedDate,
          removeImage: false
        });

        if (incomeData.slipImage) {
          setPreview(`http://localhost:3000/${incomeData.slipImage}`);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error loading income data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value < 0) return;
    setIncome({ ...income, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIncome({ ...income, slipImage: file, removeImage: false });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setIncome({ ...income, slipImage: null, removeImage: true });
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    Object.keys(income).forEach((key) => {
      if (key === 'slipImage' && !(income[key] instanceof File)) {
        // Skip if not a file (in edit mode when not changing image)
        return;
      }
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
      setError(error.response?.data?.message || "Error saving income");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 p-2 rounded-lg mr-4 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            <FiArrowLeft className="text-xl" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            {incomeId ? (
              <>
                <FiEdit2 className="text-blue-600" />
                Edit Income Record
              </>
            ) : (
              <>
                <FiPlus className="text-blue-600" />
                Add New Income
              </>
            )}
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-4 mb-6 rounded-lg ${darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiUser />
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={income.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiMail />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={income.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiDollarSign />
                Amount *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">LKR</span>
                <input
                  type="number"
                  name="amount"
                  value={income.amount}
                  onChange={handleInputChange}
                  className={`pl-10 w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiCreditCard />
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                value={income.paymentMethod}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Bank */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <BsBank2 />
                Bank
              </label>
              <input
                type="text"
                name="bank"
                value={income.bank}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiHome />
                Branch
              </label>
              <input
                type="text"
                name="branch"
                value={income.branch}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiCalendar />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={income.date}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                required
              />
            </div>

            {/* Month */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiCalendar />
                Month *
              </label>
              <select
                name="month"
                value={income.month}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                required
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiFileText />
                Reason
              </label>
              <input
                type="text"
                name="reason"
                value={income.reason}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                {income.status === 'paid' ? <FiCheckCircle /> : <FiXCircle />}
                Status *
              </label>
              <select
                name="status"
                value={income.status}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                required
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Receipt Image */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <FiImage />
              Receipt
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
              <input
                type="file"
                name="slipImage"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
                id="receiptInput"
              />
              <label 
                htmlFor="receiptInput" 
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <FiImage className="text-2xl mb-2 text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {income.slipImage instanceof File 
                    ? income.slipImage.name 
                    : income.slipImage 
                      ? 'Current receipt (click to change)' 
                      : 'Click to upload receipt (image or PDF)'}
                </p>
              </label>
            </div>
            
            {preview && (
              <div className="mt-4">
                <div className="relative">
                  {preview.includes('data:image') ? (
                    <img 
                      src={preview} 
                      alt="Receipt preview" 
                      className="max-w-full h-40 object-contain border rounded-lg"
                    />
                  ) : (
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        PDF file
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiSave />
                  {incomeId ? "Update Income" : "Add Income"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomePage;