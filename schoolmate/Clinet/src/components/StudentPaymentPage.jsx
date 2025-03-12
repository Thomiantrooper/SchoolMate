import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentPage() {
    const { currentUser } = useSelector((state) => state.user); // Get user from Redux state
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        grade: '',
        bank: '',
        branch: '',
        amount: '',
        method: '',
        month: '',
        slipImage: null,
    });

    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            slipImage: file,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure currentUser exists
        if (!currentUser || !currentUser._id) {
            setSuccessMessage("User not found. Please log in.");
            return;
        }

        const formPayload = new FormData();
        formPayload.append('userId', currentUser._id); // Get userId from Redux state
        formPayload.append('email', formData.email);
        formPayload.append('grade', formData.grade);
        formPayload.append('bank', formData.bank);
        formPayload.append('branch', formData.branch);
        formPayload.append('amount', formData.amount);
        formPayload.append('method', formData.method);
        formPayload.append('month', formData.month);

        // Append slipImage only if a file is selected
        if (formData.slipImage) {
            formPayload.append('slipImage', formData.slipImage);
        }

        try {
            const response = await axios.post('http://localhost:3000/api/payments/pay', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setSuccessMessage("Payment successful! Redirecting...");
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/student-page/student-portal?tab=school-fee-portal');
                }, 2000);
            } else {
                setSuccessMessage("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage("An error occurred while submitting the payment.");
        }
    };

      
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Payment Information</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Grade Input */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Grade</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Bank Input */}
          <div>
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Bank</label>
            <input
              type="text"
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Branch Input */}
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Branch</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Payment Method Input */}
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Payment Method</label>
            <input
              type="text"
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Month Input */}
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Month</label>
            <input
              type="text"
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Upload Payment Slip Input */}
          <div className="sm:col-span-2">
            <label htmlFor="slipImage" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload Payment Slip</label>
            <input
              type="file"
              id="slipImage"
              name="slipImage"
              onChange={handleImageChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>
          {successMessage && (
                <p className="text-green-600 mt-4">{successMessage}</p>
            )}

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
