import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function StaffBankDetailsPage() {
  const { currentUser } = useSelector((state) => state.user); // Get logged-in user
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bank: "",
    branch: "",
    accountNumber: "",
    passbookImage: null,
  });

  const [existingId, setExistingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchBankDetails();
    }
  }, [currentUser]);

  // Fetch existing bank details
  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salary/${currentUser._id}`
      );
      if (response.status === 200) {
        setExistingId(response.data._id);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          bank: response.data.bank || "",
          branch: response.data.branch || "",
          accountNumber: response.data.accountNumber || "",
          passbookImage: null,
        });
        setImagePreview(`http://localhost:3000/${response.data.passbookImage}`);
      }
    } catch (error) {
      console.error("No existing bank details found.");
      setFormData({
        name: "",
        email: "",
        bank: "",
        branch: "",
        accountNumber: "",
        passbookImage: null,
      });
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input (passbook image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      passbookImage: file,
    });

    // Show preview of selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit form data (create or update bank details)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    if (!currentUser || !currentUser._id) {
      setErrorMessage("User is not logged in.");
      setLoading(false);
      return;
    }

    const formPayload = new FormData();
    formPayload.append("userId", currentUser._id);
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("bank", formData.bank);
    formPayload.append("branch", formData.branch);
    formPayload.append("accountNumber", formData.accountNumber);

    if (formData.passbookImage) {
      formPayload.append("passbookImage", formData.passbookImage);
    }

    try {
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
        fetchBankDetails(); // Refresh data
      } else {
        setErrorMessage("Failed to save bank details.");
      }
    } catch (error) {
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Bank</label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Upload Passbook Image */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Upload Passbook Image
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-lg" />
            )}
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">
              {loading ? "Saving..." : existingId ? "Update Bank Details" : "Submit Bank Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
