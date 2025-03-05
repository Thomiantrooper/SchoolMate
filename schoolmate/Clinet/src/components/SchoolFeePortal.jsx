import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

export default function StudentFeePortal() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser._id) {
      console.error("Error: studentId is undefined!");
      return; // Prevent API call if studentId is missing
    }
    axios.get(`http://localhost:3000/api/payments/${currentUser._id}`)
    .then((response) => {
      setPayments(response.data);
    })
    .catch((error) => {
      console.error("Error fetching student payment details:", error);
    });
}, [currentUser]);

  const handlePayment = () => {
    navigate('/student-page/payment');
  };

  const downloadReceipt = (payment) => {
    const doc = new jsPDF();

    doc.text("Payment Receipt", 20, 10);

    const text = `
  Dear ${payment.userId?.username || "Student"},

  This is to confirm the payment made for the following details:

  - Student ID: ${payment.userId?._id}
  - Amount: $${payment.amount}
  - Grade: ${payment.grade}
  - Bank: ${payment.bank}
  - Branch: ${payment.branch}
  - Payment Method: ${payment.method}
  - Month: ${payment.month}
  - Payment Date: ${payment.date || 'N/A'}
  - Payment Status: ${payment.status}

  Thank you for your payment.

  Sincerely,
  SchoolMate
    `;

    doc.text(text, 20, 20);
    doc.save(`${payment.userId?.username}_receipt_${payment.month}.pdf`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', overflowX: 'auto'}}>
      <h2>My School Fee Details</h2>
      <div style={{ marginTop: '20px', }}>
        <button 
          onClick={handlePayment} 
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Pay Now
        </button>
      </div>
      {payments.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '1px solid #ddd', }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Amount</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Grade</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Bank</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Branch</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Method</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Month</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.userId._id}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.userId.username}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.email}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${payment.amount}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.grade}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.bank}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.branch}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.method}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.month}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{payment.date ? new Date(payment.date).toLocaleDateString() : "Pending"}</td>
                <td 
                    style={{ 
                      padding: '10px', 
                      borderBottom: '1px solid #ddd', 
                      color: payment.status === 'paid' ? 'green' : payment.status === 'failed' ? 'red' : 'orange',
                      fontWeight: 'bold'
                    }}
                  >
                    {payment.status || 'pending'}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
  {payment.status === 'paid' && (
    <button 
      onClick={() => downloadReceipt(payment)} 
      style={{ 
        padding: '5px 10px', 
        backgroundColor: '#007bff', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer' 
      }}
    >
      Download Receipt
    </button>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading payment details...</p>
      )}


    </div>
  );
}
