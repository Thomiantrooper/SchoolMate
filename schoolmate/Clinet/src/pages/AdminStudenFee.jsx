import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../components/ThemeLayout"; 
import axios from "axios";

export default function AdminStudentFees() {
  const { darkMode } = useContext(ThemeContext);
  const [fees, setFees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch fees data from API
    const fetchFees = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/payments"); // Replace with your actual API URL
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setFees(data);
      } catch (error) {
        console.error("Error fetching fees:", error);
      }
    };

    fetchFees();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/payments/${id}`, { status: "paid" });
      alert("Payment accepted successfully!");
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error accepting payment:", error);
      alert("Failed to accept payment.");
    }
  };
  
  const handleDeny = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/payments/${id}`, { status: "failed" });
      alert("Payment denied successfully!");
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error denying payment:", error);
      alert("Failed to deny payment.");
    }
  };

  const openModal = (imagePath) => {
    setSelectedImage(imagePath);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      
      {/* Header */}
      <div className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h1 className="text-2xl font-bold">📚 Student Fee Management</h1>
        <button 
          onClick={() => window.location.href = "/dashboard?tab=finance"} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded">
          Back to Dashboard
        </button>
      </div>

      {/* Fees Table */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md transition-all duration-300 overflow-x-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-lg font-semibold mb-2">📋 Manage Student Fees</h2>
        <table className="w-full border-collapse ">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
              <th className="p-2">ID</th>  
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Class</th>
              <th className="p-2">Bank</th>
              <th className="p-2">Branch</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Method</th>
              <th className="p-2">Month</th>
              <th className="p-2">Slip</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {fees.map((fee) => (
  <tr key={fee._id} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
    <td className="p-2">{fee._id}</td>
    <td className="p-2 font-semibold">{fee.userId ? fee.userId.username : "Unknown"}</td>
    <td className="p-2">{fee.userId ? fee.email : "Unknown"}</td>
    <td className="p-2">{fee.grade}</td>
    <td className="p-2">{fee.bank}</td>
    <td className="p-2">{fee.branch}</td>
    <td className="p-2">${fee.amount}</td>
    <td className="p-2">{fee.method}</td>
    <td className="p-2">{fee.month}</td>
    <td className="p-2">
    {fee.slipImage ? (
                    <img
                      src={`http://localhost:3000/${fee.slipImage}`}
                      alt="Slip"
                      className="w-16 h-16 object-cover rounded cursor-pointer"
                      onClick={() => openModal(fee.slipImage)} // Open modal on image click
                    />
                  ) : (
                    "No Slip"
                  )}
    </td>
    <td className="p-2">{new Date(fee.date).toLocaleDateString()}</td>
    <td className="p-2">{fee.status}</td>
    <td className="p-2 flex space-x-2">
  <button 
    onClick={() => handleAccept(fee._id)} 
    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
    ✔ Accept
  </button>
  
  <button 
    onClick={() => handleDeny(fee._id)} 
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
    ✖ Deny
  </button>
</td>
  </tr>
))}

          </tbody>
        </table>
      </div>
        {/* Modal for displaying larger image */}
        {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative">
            <button 
              onClick={closeModal} 
              className="absolute top-0 right-0 p-4 text-white text-xl"
            >
              ✖
            </button>
            <img 
              src={`http://localhost:3000/${selectedImage}`} 
              alt="Slip" 
              className="max-w-full max-h-screen object-contain" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
