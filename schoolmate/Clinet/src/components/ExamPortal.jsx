import React from 'react';

export default function ExamPortal() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>📝 Exam Portal</h1>
      <p>Welcome to the Exam Portal. Here, you can view your upcoming exams, take practice tests, and check your results.</p>
      
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button style={{ padding: '10px 20px', borderRadius: '8px', background: '#6E44FF', color: 'white', border: 'none' }}>View Exams</button>
        <button style={{ padding: '10px 20px', borderRadius: '8px', background: '#B43E8F', color: 'white', border: 'none' }}>Take Practice Test</button>
        <button style={{ padding: '10px 20px', borderRadius: '8px', background: '#FFD700', color: 'black', border: 'none' }}>Check Results</button>
      </div>
    </div>
  );
}
