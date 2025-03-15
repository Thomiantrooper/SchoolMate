import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from "../components/ThemeLayout";
import axios from 'axios';

const MaintenancePaymentList = () => {
  const { darkMode } = useContext(ThemeContext);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState('');
  const [month, setMonth] = useState('March');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [newPayment, setNewPayment] = useState({
    name: '',
    amount: '',
    paymentType: 'Cash',
    date: '',
    month: 'March',
    paidStatus: false,
    paymentSlipImage: null,
  });

  useEffect(() => {
    fetchPayments();
  }, [month]);

  const fetchPayments = () => {
    axios.get(`http://localhost:3000/api/maintenance/maintenance-payments/${month}`)
      .then((response) => {
        setPayments(response.data.data);
      })
      .catch(() => {
        setMessage('Error loading payments');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "paidStatus" ? value === "Paid" : value;
    setNewPayment({ ...newPayment, [name]: updatedValue });
  };

  const handleFileChange = (e) => {
    setNewPayment({ ...newPayment, paymentSlipImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newPayment).forEach((key) => {
      formData.append(key, newPayment[key]);
    });

    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/api/maintenance/maintenance-payment/${currentPaymentId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:3000/api/maintenance/maintenance-payment", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setShowModal(false);
      setEditMode(false);
      fetchPayments();
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handleEdit = (payment) => {
    setEditMode(true);
    setShowModal(true);
    setCurrentPaymentId(payment._id);
    setNewPayment(payment);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/maintenance/maintenance-payment/${id}`);
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-4">Maintenance Payment Records for {month}</h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Select Month:</label>
          <select onChange={(e) => setMonth(e.target.value)} value={month} className={`p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
              .map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <button onClick={() => { setShowModal(true); setEditMode(false); setNewPayment({ name: '', amount: '', paymentType: 'Cash', date: '', month, paidStatus: false, paymentSlipImage: null }); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Add Payment
        </button>
      </div>
      {message && <p className="text-red-500">{message}</p>}
      {payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg text-center">
            <thead>
              <tr>
                <th>Name</th><th>Amount</th><th>Payment Type</th><th>Date</th><th>Month</th><th>Paid Status</th><th>Payment Slip</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.name}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.paymentType}</td>
                  <td >{payment.date.split('T')[0]}</td>
                  <td>{payment.month}</td>
                  <td>{payment.paidStatus ? 'Paid' : 'Pending'}</td>
                  <td>{payment.paymentSlipImage && (<img src={`http://localhost:3000/${payment.paymentSlipImage}`} alt="Payment Slip" className="w-12 h-12 object-cover rounded ml-20" />)}</td>
                  <td>
                    <button onClick={() => handleEdit(payment)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(payment._id)} className="px-2 py-1 bg-red-600 text-white rounded ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg mt-4">No maintenance payment records found for {month}.</p>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit' : 'Add'} Maintenance Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
            <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                value={newPayment.name} 
                onChange={handleInputChange} 
                className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            />
            <input 
                type="number" 
                name="amount" 
                placeholder="Amount" 
                value={newPayment.amount} 
                onChange={handleInputChange} 
                className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            />
            <select 
                name="paymentType" 
                value={newPayment.paymentType} 
                onChange={handleInputChange} 
                className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <select 
                name="paidStatus" 
                value={newPayment.paidStatus ? "Paid" : "Pending"}  // Ensure the correct boolean conversion
                onChange={handleInputChange} 
                className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
                >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                </select>
            <input 
                type="date" 
                name="date" 
                value={newPayment.date} 
                onChange={handleInputChange} 
                className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            />
            <input 
                type="file" 
                name="paymentSlipImage" 
                onChange={handleFileChange} 
                className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            />
            <div className="flex justify-between">
                <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                Submit
                </button>
                <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                Cancel
                </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePaymentList;
