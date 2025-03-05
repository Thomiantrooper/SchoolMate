import React from 'react';

export default function HomeworkPortal() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📖 Homework Portal</h2>
      <p>Welcome to the Homework Portal. Here, you can view assignments, submit homework, and track your progress.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Upcoming Assignments</h3>
        <ul>
          <li>Math Homework - Due: March 10</li>
          <li>Science Project - Due: March 15</li>
          <li>History Essay - Due: March 18</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Submit Your Homework</h3>
        <input type="file" />
        <button style={{ marginLeft: '10px' }}>Upload</button>
      </div>
    </div>
  );
}