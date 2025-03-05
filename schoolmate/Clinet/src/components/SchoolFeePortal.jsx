import React, { useState } from 'react';

export default function SchoolFeePortal() {
  const [feesPaid, setFeesPaid] = useState(false);

  const handlePayment = () => {
    setFeesPaid(true);
    alert("Payment Successful!");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>School Fee Portal</h2>
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Fee Details</h3>
        <p><strong>Total Fees:</strong> $500</p>
        <p><strong>Due Date:</strong> March 15, 2025</p>
        <p><strong>Status:</strong> {feesPaid ? "Paid" : "Pending"}</p>
      </div>
      
      {!feesPaid && (
        <button 
          onClick={handlePayment} 
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Pay Now
        </button>
      )}
      
      {feesPaid && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
          <p>Payment has been successfully processed. Thank you!</p>
        </div>
      )}
    </div>
  );
}