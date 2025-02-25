import React from 'react';

export default function About() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', background: '#F0F4F8' }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', padding: '30px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '36px', color: '#4A90E2', textAlign: 'center' }}>Welcome to SchoolMate</h1>
        <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', textAlign: 'justify' }}>
          SchoolMate is a cutting-edge virtual study environment designed to enhance school management and academic experiences. Our platform provides a seamless connection between students, teachers, and administrators for efficient learning and administration.
        </p>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '28px', color: '#6E44FF', textAlign: 'center' }}>Core Features of SchoolMate</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px'
          }}>
            <div style={{ background: '#6E44FF', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Student Management</h3>
              <p>Maintain detailed student records, attendance, and academic performance in one centralized system.</p>
            </div>
            <div style={{ background: '#FF6347', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Teacher & Staff Management</h3>
              <p>Manage teacher profiles, schedules, and performance analytics with ease.</p>
            </div>
            <div style={{ background: '#FFD700', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Timetable Scheduling</h3>
              <p>Generate and manage class schedules efficiently to optimize learning experiences.</p>
            </div>
            <div style={{ background: '#32CD32', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Online Learning Portal</h3>
              <p>Provide a digital classroom environment with assignments, resources, and discussion forums.</p>
            </div>
            <div style={{ background: '#FF4500', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Parent Communication</h3>
              <p>Keep parents informed with real-time updates on student progress and school announcements.</p>
            </div>
            <div style={{ background: '#1E90FF', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Exams & Grading</h3>
              <p>Conduct assessments, generate report cards, and track academic progress digitally.</p>
            </div>
          </div>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '28px', color: '#6E44FF', textAlign: 'center' }}>Why Choose SchoolMate?</h2>
          <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', textAlign: 'justify' }}>
            SchoolMate is built to provide an all-in-one school management solution that enhances learning experiences while simplifying administrative processes. Our platform fosters collaboration between students, teachers, and parents, ensuring a more connected educational environment.
          </p>
          <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', textAlign: 'justify' }}>
            Benefits include a user-friendly interface, customizable dashboards, real-time updates, and seamless integration with various learning tools, making SchoolMate the perfect solution for modern schools.
          </p>
        </section>
      </div>
    </div>
  );
}
