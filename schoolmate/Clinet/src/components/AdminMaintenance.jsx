import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  FiDollarSign,
  FiArrowLeft, 
  FiCalendar, 
  FiUser, 
  FiCreditCard, 
  FiCheck, 
  FiX, 
  FiEdit2, 
  FiTrash2,
  FiPlus,
  FiImage,
  FiDownload
} from 'react-icons/fi';
import { BsBank2 } from 'react-icons/bs';

const MaintenancePaymentList = () => {
  const { darkMode } = useContext(ThemeContext);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [newPayment, setNewPayment] = useState({
    name: '',
    amount: '',
    paymentType: 'Cash',
    date: new Date().toISOString().split('T')[0],
    month: new Date().toLocaleString('default', { month: 'long' }),
    paidStatus: false,
    paymentSlipImage: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [month]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/maintenance/maintenance-payments/${month}`);
      setPayments(response.data.data);
    } catch (error) {
      setMessage({ text: 'Error loading payments', type: 'error' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newPayment.name.trim()) newErrors.name = 'Name is required';
    if (!newPayment.amount || isNaN(newPayment.amount)) newErrors.amount = 'Valid amount is required';
    if (!newPayment.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for paidStatus to ensure it's always a boolean
    if (name === "paidStatus") {
      setNewPayment({ ...newPayment, [name]: value === "Paid" });
    } else {
      setNewPayment({ ...newPayment, [name]: value });
    }
    
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPayment({ ...newPayment, paymentSlipImage: file });
      
      // Create preview for images
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const formData = new FormData();
    
    // Append all fields except the image if it hasn't changed
    Object.keys(newPayment).forEach((key) => {
      // Skip appending the image if it hasn't changed and we're in edit mode
      if (key === 'paymentSlipImage' && editMode && !(newPayment.paymentSlipImage instanceof File)) {
        return;
      }
      
      // Special handling for paidStatus to ensure it's a boolean
      const value = key === 'paidStatus' ? Boolean(newPayment[key]) : newPayment[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
  
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:3000/api/maintenance/maintenance-payment/${currentPaymentId}`, 
          formData, 
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setMessage({ text: 'Payment updated successfully', type: 'success' });
      } else {
        await axios.post(
          "http://localhost:3000/api/maintenance/maintenance-payment", 
          formData, 
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setMessage({ text: 'Payment added successfully', type: 'success' });
      }
      resetForm();
      fetchPayments();
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Error saving payment', type: 'error' });
    }
  };

  const handleEdit = (payment) => {
    setEditMode(true);
    setShowModal(true);
    setCurrentPaymentId(payment._id);
    const formattedDate = payment.date ? new Date(payment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    setNewPayment({
      ...payment,
      paidStatus: payment.paidStatus ? "Paid" : "Pending",
      date: formattedDate,
      // Keep the existing image reference as is
      paymentSlipImage: payment.paymentSlipImage || null,
    });
    
    // Set image preview if payment slip exists
    setImagePreview(payment.paymentSlipImage ? `http://localhost:3000/${payment.paymentSlipImage}` : null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/maintenance/maintenance-payment/${id}`);
      setMessage({ text: 'Payment deleted successfully', type: 'success' });
      fetchPayments();
    } catch (error) {
      setMessage({ text: 'Error deleting payment', type: 'error' });
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentPaymentId(null);
    setNewPayment({
      name: '',
      amount: '',
      paymentType: 'Cash',
      date: new Date().toISOString().split('T')[0],
      month: new Date().toLocaleString('default', { month: 'long' }),
      paidStatus: false,
      paymentSlipImage: null,
    });
    setImagePreview(null);
    setErrors({});
  };

  const downloadSlip = (imagePath) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3000/${imagePath}`;
    link.download = `payment-slip-${Date.now()}.${imagePath.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        
          <div className='flex gap-60'>
            <div>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                <FiArrowLeft />
                Back
              </button>
            </div>
            <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <FiDollarSign className="text-indigo-600" />
              Maintenance Payment Records
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage all maintenance payments for your property
            </p>
            </div>
          </div>
          
          <div className="flex justify-between pb-5 pt-5 px-5">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <FiCalendar />
                Select Month
              </label>
              <select 
                onChange={(e) => setMonth(e.target.value)} 
                value={month} 
                className={`p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                  .map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <button 
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setNewPayment({
                  name: '',
                  amount: '',
                  paymentType: 'Cash',
                  date: new Date().toISOString().split('T')[0],
                  month: month,
                  paidStatus: false,
                  paymentSlipImage: null,
                });
                setImagePreview(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg self-end"
            >
              <FiPlus />
              Add Payment
            </button>
          </div>
        

        {/* Messages */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.type === 'success' 
              ? darkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"
              : darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        {/* Payments Table */}
        {payments.length > 0 ? (
          <div className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiUser />
                        Name
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiDollarSign />
                        Amount
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiCreditCard />
                        Type
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiCalendar />
                        Date
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiImage />
                        Slip
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment._id} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {payment.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          LKR {payment.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {payment.paymentType === 'Bank Transfer' ? (
                            <span className="flex items-center gap-1">
                              <BsBank2 /> {payment.paymentType}
                            </span>
                          ) : payment.paymentType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.paidStatus 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}>
                          {payment.paidStatus ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.paymentSlipImage && (
                          <div className="flex items-center gap-2">
                            <img 
                              src={`http://localhost:3000/${payment.paymentSlipImage}`} 
                              alt="Payment slip" 
                              className="w-10 h-10 object-cover rounded cursor-pointer"
                              onClick={() => setImagePreview(`http://localhost:3000/${payment.paymentSlipImage}`)}
                            />
                            <button 
                              onClick={() => downloadSlip(payment.paymentSlipImage)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                            >
                              <FiDownload />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                          >
                            <FiEdit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(payment._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                          >
                            <FiTrash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={`p-8 rounded-xl shadow-sm text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="mx-auto max-w-md">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full inline-flex mb-4">
                <FiDollarSign className="text-indigo-600 dark:text-indigo-300 text-2xl" />
              </div>
              <h3 className="text-lg font-medium mb-2">No payments found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {month !== new Date().toLocaleString('default', { month: 'long' })
                  ? `No maintenance payment records found for ${month}`
                  : "No maintenance payment records available"}
              </p>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditMode(false);
                  setNewPayment({
                    name: '',
                    amount: '',
                    paymentType: 'Cash',
                    date: new Date().toISOString().split('T')[0],
                    month: month,
                    paidStatus: false,
                    paymentSlipImage: null,
                  });
                  setImagePreview(null);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Add New Payment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`relative rounded-xl shadow-lg p-6 max-w-md w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiX className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiEdit2 />
              {editMode ? 'Edit' : 'Add'} Maintenance Payment
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={newPayment.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.name ? "border-red-500" : darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">LKR  </span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={handleInputChange}
                    className={`pl-10 w-full p-2 border rounded-lg ${errors.amount ? "border-red-500" : darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                  />
                </div>
                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Type</label>
                <select
                  name="paymentType"
                  value={newPayment.paymentType}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="paidStatus"
                  value={newPayment.paidStatus ? "Paid" : "Pending"}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={newPayment.date || ''}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.date ? "border-red-500" : darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Slip</label>
                <div className={`border-2 border-dashed rounded-lg p-4 ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                  <input
                    type="file"
                    name="paymentSlipImage"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="paymentSlipInput"
                  />
                  <label 
                    htmlFor="paymentSlipInput" 
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <FiImage className="text-2xl mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {newPayment.paymentSlipImage?.name || 
                       (typeof newPayment.paymentSlipImage === 'string' ? 'Existing slip (click to change)' : 'Click to upload slip (image or PDF)')}
                    </p>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                    {imagePreview.includes('data:image') ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Slip preview" 
                          className="max-w-full h-32 object-contain border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewPayment({...newPayment, paymentSlipImage: null});
                            setImagePreview(null);
                          }}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 border rounded-lg flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          {typeof newPayment.paymentSlipImage === 'string' ? 'Existing file' : 'PDF file'}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.open(
                              typeof newPayment.paymentSlipImage === 'string' 
                                ? `http://localhost:3000/${newPayment.paymentSlipImage}`
                                : imagePreview,
                              '_blank'
                            )}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                          >
                            <FiDownload />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewPayment({...newPayment, paymentSlipImage: null});
                              setImagePreview(null);
                            }}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {editMode && typeof newPayment.paymentSlipImage === 'string' && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPayment.removeImage || false}
                        onChange={(e) => setNewPayment({
                          ...newPayment,
                          removeImage: e.target.checked
                        })}
                        className="mr-2"
                      />
                      Remove existing slip
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  {editMode ? 'Update Payment' : 'Add Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setImagePreview(null)}
              className="absolute top-0 right-0 p-4 text-white text-xl"
            >
              ✖
            </button>
            {imagePreview.includes('data:image') ? (
              <img 
                src={imagePreview} 
                alt="Payment slip" 
                className="max-w-full max-h-screen object-contain" 
              />
            ) : (
              <div className={`p-8 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex flex-col items-center">
                  <FiImage className="text-5xl mb-4 text-gray-500" />
                  <p className="mb-4">PDF file preview not available</p>
                  <a 
                    href={imagePreview} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Open PDF
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePaymentList;