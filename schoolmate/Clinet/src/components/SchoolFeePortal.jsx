import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FiDollarSign, 
  FiDownload, 
  FiCreditCard, 
  FiCalendar,
  FiUser,
  FiMail,
  FiBook,
  FiHome,
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi';
import { BsBank2, BsReceipt } from 'react-icons/bs';

export default function StudentFeePortal() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser?._id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/payments/${currentUser._id}`);
        setPayments(response.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentUser]);

  const handlePayment = () => {
    navigate('/student-page/payment');
  };

  const downloadReceipt = (payment) => {
    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(20);
    doc.setTextColor(40, 103, 248);
    doc.text("SchoolMate Payment Receipt", 105, 20, null, null, 'center');
    
    // Add divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 30, 190, 30);
    
    // Student information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student: ${payment.userId?.username || "N/A"}`, 20, 40);
    doc.text(`Student ID: ${payment.userId?._id || "N/A"}`, 20, 50);
    doc.text(`Email: ${payment.email || "N/A"}`, 20, 60);
    
    // Payment details
    doc.setFontSize(14);
    doc.setTextColor(40, 103, 248);
    doc.text("Payment Details", 20, 80);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Amount: $${payment.amount || "0.00"}`, 20, 90);
    doc.text(`Grade: ${payment.grade || "N/A"}`, 20, 100);
    doc.text(`Bank: ${payment.bank || "N/A"}`, 20, 110);
    doc.text(`Branch: ${payment.branch || "N/A"}`, 20, 120);
    doc.text(`Payment Method: ${payment.method || "N/A"}`, 20, 130);
    doc.text(`For Month: ${payment.month || "N/A"}`, 20, 140);
    doc.text(`Payment Date: ${payment.date ? new Date(payment.date).toLocaleDateString() : "Pending"}`, 20, 150);
    
    // Status with color
    doc.setTextColor(payment.status === 'paid' ? [0, 128, 0] : payment.status === 'failed' ? [255, 0, 0] : [255, 165, 0]);
    doc.text(`Status: ${payment.status?.toUpperCase() || "PENDING"}`, 20, 160);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your payment", 105, 280, null, null, 'center');
    doc.text("SchoolMate Administration", 105, 285, null, null, 'center');
    
    doc.save(`${payment.userId?.username || 'payment'}_receipt_${payment.month || ''}.pdf`);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      paid: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: <FiCheckCircle className="mr-1" />
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: <FiClock className="mr-1" />
      },
      failed: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: <FiXCircle className="mr-1" />
      },
      default: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        icon: <FiClock className="mr-1" />
      }
    };

    const config = statusConfig[status] || statusConfig.default;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {status || 'pending'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              My Fee Payment History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage all your school fee payments
            </p>
          </div>
          
          <button
            onClick={handlePayment}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            <FiDollarSign className="text-lg" />
            <span>Make New Payment</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg max-w-md mx-auto text-center">
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiUser />
                        Student
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiDollarSign />
                        Amount
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiBook />
                        Grade
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <BsBank2 />
                        Bank
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiCalendar />
                        Month
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiCreditCard />
                        Method
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                            <FiUser className="text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.userId?.username || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {payment.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${payment.amount || '0.00'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {payment.grade || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {payment.bank || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.branch || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {payment.month || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.date ? new Date(payment.date).toLocaleDateString() : 'Pending'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {payment.method || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {payment.status === 'paid' && (
                          <button
                            onClick={() => downloadReceipt(payment)}
                            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          >
                            <FiDownload />
                            <span>Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto flex flex-col items-center justify-center max-w-md">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
                <FiDollarSign className="text-indigo-600 dark:text-indigo-300 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No payment records found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your payment history will appear here once you make your first payment.
              </p>
              <button
                onClick={handlePayment}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              >
                Make Your First Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}