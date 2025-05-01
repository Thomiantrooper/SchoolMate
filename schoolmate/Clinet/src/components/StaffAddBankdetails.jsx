import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function StaffBankDetailsPage() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bank: "",
    branch: "",
    accountNumber: "",
    passbookImage: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    bank: "",
    branch: "",
    accountNumber: "",
    passbookImage: "",
  });

  const [existingId, setExistingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchBankDetails();
      // Pre-fill name and email from currentUser if available
      setFormData(prev => ({
        ...prev,
        name: currentUser.username || "",
        email: currentUser.email || ""
      }));
    }
  }, [currentUser]);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salary/${currentUser._id}`
      );
      if (response.status === 200) {
        setExistingId(response.data._id);
        setFormData({
          name: response.data.name || currentUser.username || "",
          email: response.data.email || currentUser.email || "",
          bank: response.data.bank || "",
          branch: response.data.branch || "",
          accountNumber: response.data.accountNumber || "",
          passbookImage: null,
        });
        if (response.data.passbookImage) {
          setImagePreview(`http://localhost:3000/${response.data.passbookImage}`);
        }
      }
    } catch (error) {
      console.log("No existing bank details found.");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      bank: "",
      branch: "",
      accountNumber: "",
      passbookImage: "",
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Bank validation
    if (!formData.bank.trim()) {
      newErrors.bank = "Bank name is required";
      isValid = false;
    } else if (formData.bank.length < 2) {
      newErrors.bank = "Bank name must be valid";
      isValid = false;
    }

    // Branch validation
    if (!formData.branch.trim()) {
      newErrors.branch = "Branch name is required";
      isValid = false;
    }

    // Account number validation
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
      isValid = false;
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 9-18 digits";
      isValid = false;
    }

    // Passbook image validation (only for new submissions)
    if (!existingId && !formData.passbookImage && !imagePreview) {
      newErrors.passbookImage = "Passbook image is required";
      isValid = false;
    } else if (formData.passbookImage) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!allowedTypes.includes(formData.passbookImage.type)) {
        newErrors.passbookImage = "Only JPG, PNG or GIF images are allowed";
        isValid = false;
      } else if (formData.passbookImage.size > maxSize) {
        newErrors.passbookImage = "Image size must be less than 2MB";
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      passbookImage: file,
    });

    // Clear file error
    if (errors.passbookImage) {
      setErrors({
        ...errors,
        passbookImage: "",
      });
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("userId", currentUser._id);
      formPayload.append("name", formData.name.trim());
      formPayload.append("email", formData.email.trim());
      formPayload.append("bank", formData.bank.trim());
      formPayload.append("branch", formData.branch.trim());
      formPayload.append("accountNumber", formData.accountNumber.trim());

      if (formData.passbookImage) {
        formPayload.append("passbookImage", formData.passbookImage);
      }

      const response = existingId
        ? await axios.put(
            `http://localhost:3000/api/salary/${currentUser._id}`,
            formPayload,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
        : await axios.post(
            "http://localhost:3000/api/salary",
            formPayload,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          existingId ? "Bank details updated successfully!" : "Bank details added successfully!"
        );
        fetchBankDetails();
      }
    } catch (error) {
      console.error("Error saving bank details:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while saving bank details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-1/3 py-3 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600"
        >
          Back
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          {existingId ? "Update Bank Details" : "Add Bank Details"}
        </h2>

        {successMessage && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border ${
                errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Bank <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border ${
                errors.bank ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.bank && (
              <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Branch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border ${
                errors.branch ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.branch && (
              <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border ${
                errors.accountNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.accountNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
            )}
          </div>

          {/* Upload Passbook Image */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {existingId ? "Update Passbook Image" : "Upload Passbook Image"} 
              {!existingId && <span className="text-red-500">*</span>}
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className={`mt-1 block w-full ${
                errors.passbookImage ? "border-red-500" : ""
              }`} 
            />
            {errors.passbookImage && (
              <p className="mt-1 text-sm text-red-600">{errors.passbookImage}</p>
            )}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-40 h-40 object-contain border border-gray-300 rounded-lg" 
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : existingId ? "Update Bank Details" : "Submit Bank Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}