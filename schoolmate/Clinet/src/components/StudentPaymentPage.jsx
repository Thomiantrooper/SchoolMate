import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiUpload, FiDollarSign, FiCalendar, FiCreditCard, FiMail, FiUser } from 'react-icons/fi';
import { BsBank2, BsPatchCheck } from 'react-icons/bs';

export default function PaymentPage() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: currentUser?.email || '',
        grade: '',
        bank: '',
        branch: '',
        amount: '',
        method: 'Bank Transfer', // Default value
        month: '',
        slipImage: null,
    });

    const [errors, setErrors] = useState({
        email: '',
        grade: '',
        bank: '',
        branch: '',
        amount: '',
        method: '',
        month: '',
        slipImage: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const paymentMethods = [
        'Bank Transfer',
        'Credit Card',
        'Debit Card',
        'Mobile Payment',
        'Online Payment',
        'Cash Deposit'
    ];

    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: '',
            grade: '',
            bank: '',
            branch: '',
            amount: '',
            method: '',
            month: '',
            slipImage: '',
        };

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Grade validation
        if (!formData.grade.trim()) {
            newErrors.grade = 'Grade is required';
            isValid = false;
        } else if (!/^[A-Za-z0-9\s]+$/.test(formData.grade)) {
            newErrors.grade = 'Grade must be alphanumeric';
            isValid = false;
        }

        // Bank validation
        if (!formData.bank.trim()) {
            newErrors.bank = 'Bank name is required';
            isValid = false;
        } else if (formData.bank.length < 2) {
            newErrors.bank = 'Bank name must be valid';
            isValid = false;
        }

        // Branch validation
        if (!formData.branch.trim()) {
            newErrors.branch = 'Branch name is required';
            isValid = false;
        }

        // Amount validation
        if (!formData.amount.trim()) {
            newErrors.amount = 'Amount is required';
            isValid = false;
        } else if (isNaN(formData.amount)) {
            newErrors.amount = 'Amount must be a number';
            isValid = false;
        } else if (parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
            isValid = false;
        }

        // Method validation
        if (!formData.method) {
            newErrors.method = 'Payment method is required';
            isValid = false;
        }

        // Month validation
        if (!formData.month) {
            newErrors.month = 'Month is required';
            isValid = false;
        }

        // Slip image validation
        if (!formData.slipImage) {
            newErrors.slipImage = 'Payment slip is required';
            isValid = false;
        } else if (formData.slipImage) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (!allowedTypes.includes(formData.slipImage.type)) {
                newErrors.slipImage = 'Only JPG, PNG or PDF files are allowed';
                isValid = false;
            } else if (formData.slipImage.size > maxSize) {
                newErrors.slipImage = 'File size must be less than 5MB';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData({
            ...formData,
            slipImage: file,
        });

        // Clear file error
        if (errors.slipImage) {
            setErrors({
                ...errors,
                slipImage: "",
            });
        }

        // Show preview for images (not PDFs)
        if (file.type.includes('image')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formPayload = new FormData();
            formPayload.append('userId', currentUser._id);
            formPayload.append('email', formData.email.trim());
            formPayload.append('grade', formData.grade.trim());
            formPayload.append('bank', formData.bank.trim());
            formPayload.append('branch', formData.branch.trim());
            formPayload.append('amount', formData.amount.trim());
            formPayload.append('method', formData.method);
            formPayload.append('month', formData.month);
            formPayload.append('slipImage', formData.slipImage);

            const response = await axios.post('http://localhost:3000/api/payments/pay', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setSuccessMessage("Payment submitted successfully! Redirecting...");
                
                setTimeout(() => {
                    navigate('/student-page/student-portal?tab=school-fee-portal');
                }, 2000);
            }
        } catch (error) {
            console.error('Payment submission error:', error);
            setSuccessMessage(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
  
            <div className="max-w-2xl mx-auto">
              <div className='pb-4'>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                   >
                  <FiArrowLeft className="text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">Back</span>
                 </button>
                 </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 dark:bg-indigo-700 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FiDollarSign className="text-white" />
                            Payment Information
                        </h2>
                        <p className="text-indigo-100 mt-1">
                            Please fill in your payment details carefully
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {successMessage && (
                            <div className={`p-4 rounded-lg ${successMessage.includes("successfully") ? 
                                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : 
                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>
                                {successMessage}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                <FiMail className="text-gray-500 dark:text-gray-400" />
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Grade */}
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                <FiUser className="text-gray-500 dark:text-gray-400" />
                                Grade/Class <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="grade"
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-4 py-3 border ${errors.grade ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500`}
                            />
                            {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bank */}
                            <div>
                                <label htmlFor="bank" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                    <BsBank2 className="text-gray-500 dark:text-gray-400" />
                                    Bank Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="bank"
                                    name="bank"
                                    value={formData.bank}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-4 py-3 border ${errors.bank ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500`}
                                />
                                {errors.bank && <p className="mt-1 text-sm text-red-600">{errors.bank}</p>}
                            </div>

                            {/* Branch */}
                            <div>
                                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                    <FiCreditCard className="text-gray-500 dark:text-gray-400" />
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="branch"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-4 py-3 border ${errors.branch ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500`}
                                />
                                {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Amount */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                    <FiDollarSign className="text-gray-500 dark:text-gray-400" />
                                    Amount (LKR) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={`mt-1 block w-full px-4 py-3 border ${errors.amount ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500`}
                                />
                                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                    <FiCreditCard className="text-gray-500 dark:text-gray-400" />
                                    Payment Method <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="method"
                                    name="method"
                                    value={formData.method}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-4 py-3 border ${errors.method ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500`}
                                >
                                    {paymentMethods.map((method) => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                                {errors.method && <p className="mt-1 text-sm text-red-600">{errors.method}</p>}
                            </div>
                        </div>

                        {/* Month */}
                        <div>
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                <FiCalendar className="text-gray-500 dark:text-gray-400" />
                                Payment For Month <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="month"
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-4 py-3 border ${errors.month ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500`}
                            >
                                <option value="">Select Month</option>
                                {months.map((month) => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            {errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
                        </div>

                        {/* Payment Slip */}
                        <div>
                            <label htmlFor="slipImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                <FiUpload className="text-gray-500 dark:text-gray-400" />
                                Payment Slip (JPG/PNG/PDF, max 5MB) <span className="text-red-500">*</span>
                            </label>
                            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.slipImage ? "border-red-500" : "border-gray-300 dark:border-gray-600"} border-dashed rounded-lg`}>
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label
                                            htmlFor="slipImage"
                                            className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="slipImage"
                                                name="slipImage"
                                                type="file"
                                                onChange={handleImageChange}
                                                accept="image/jpeg, image/png, application/pdf"
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formData.slipImage ? 
                                            formData.slipImage.name : 
                                            "JPG, PNG or PDF up to 5MB"}
                                    </p>
                                </div>
                            </div>
                            {errors.slipImage && <p className="mt-1 text-sm text-red-600">{errors.slipImage}</p>}
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                                    <img 
                                        src={imagePreview} 
                                        alt="Payment slip preview" 
                                        className="max-w-xs max-h-40 object-contain border border-gray-300 dark:border-gray-600 rounded-lg" 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <BsPatchCheck className="mr-2" />
                                        Submit Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}