import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChalkboardTeacher, FaCalendarAlt, FaLaptop, FaCommentDots, FaClipboardList, FaShieldAlt, FaHandshake, FaRocket } from 'react-icons/fa';

export default function About() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  const features = [
    { title: "Student Management", description: "Maintain detailed student records, attendance, and academic performance in one centralized system.", color: "#6E44FF", icon: <FaUsers size={40} /> },
    { title: "Teacher & Staff Management", description: "Manage teacher profiles, schedules, and performance analytics with ease.", color: "#FF6347", icon: <FaChalkboardTeacher size={40} /> },
    { title: "Timetable Scheduling", description: "Generate and manage class schedules efficiently to optimize learning experiences.", color: "#FFD700", icon: <FaCalendarAlt size={40} /> },
    { title: "Online Learning Portal", description: "Provide a digital classroom environment with assignments, resources, and discussion forums.", color: "#32CD32", icon: <FaLaptop size={40} /> },
    { title: "Parent Communication", description: "Keep parents informed with real-time updates on student progress and school announcements.", color: "#FF4500", icon: <FaCommentDots size={40} /> },
    { title: "Exams & Grading", description: "Conduct assessments, generate report cards, and track academic progress digitally.", color: "#1E90FF", icon: <FaClipboardList size={40} /> }
  ];
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', background: '#F0F4F8' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', padding: '30px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '36px', color: '#4A90E2', textAlign: 'center' }}>Welcome to SchoolMate</h1>
        <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', textAlign: 'justify' }}>
          SchoolMate is a cutting-edge virtual study environment designed to enhance school management and academic experiences. Our platform provides a seamless connection between students, teachers, and administrators for efficient learning and administration.
        </p>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '28px', color: '#6E44FF', textAlign: 'center' }}>Core Features of SchoolMate</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px'
          }}>
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                onClick={() => setSelectedFeature(feature)}
                style={{ background: feature.color, color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                {feature.icon}
                <h3>{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        {selectedFeature && (
          <motion.div 
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div 
              style={{ background: selectedFeature.color, color: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '500px', textAlign: 'center' }}
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5 }}
            >
              <h2>{selectedFeature.title}</h2>
              <p>{selectedFeature.description}</p>
            </motion.div>
          </motion.div>
        )}

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '28px', color: '#6E44FF', textAlign: 'center' }}>Our Mission & Vision</h2>
          <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', textAlign: 'justify' }}>
            At SchoolMate, our mission is to revolutionize education by providing seamless digital tools that enhance learning and streamline school administration. Our vision is to create a future where education is accessible, engaging, and innovative for everyone.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '28px', color: '#6E44FF', textAlign: 'center' }}>Security & Privacy</h2>
          <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', textAlign: 'justify' }}>
            SchoolMate prioritizes data security and user privacy. Our platform employs encryption, secure authentication, and compliance with data protection regulations to ensure that all student and school data remains safe and confidential.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
