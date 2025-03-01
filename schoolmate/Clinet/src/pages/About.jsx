import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChalkboardTeacher, FaCalendarAlt, FaLaptop, FaCommentDots, FaClipboardList } from 'react-icons/fa';
import ThemeLayout from '../components/ThemeLayout'; // Adjust the import path as needed

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
    <ThemeLayout>
      <div className="p-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
        >
          <h1 className="text-4xl text-blue-500 dark:text-blue-400 text-center font-bold">Welcome to SchoolMate</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 text-justify">
            SchoolMate is a cutting-edge virtual study environment designed to enhance school management and academic experiences. Our platform provides a seamless connection between students, teachers, and administrators for efficient learning and administration.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl text-purple-600 dark:text-purple-400 text-center font-semibold">Core Features of SchoolMate</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  onClick={() => setSelectedFeature(feature)}
                  className="p-6 rounded-lg cursor-pointer text-white"
                  style={{ background: feature.color }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center">
                    {feature.icon}
                    <h3 className="mt-2 font-semibold text-lg">{feature.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {selectedFeature && (
            <motion.div 
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
            >
              <motion.div 
                className="p-8 rounded-lg text-white max-w-md text-center"
                style={{ background: selectedFeature.color }}
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, rotate: 5 }}
              >
                <h2 className="text-xl font-bold">{selectedFeature.title}</h2>
                <p className="mt-2">{selectedFeature.description}</p>
              </motion.div>
            </motion.div>
          )}

          <section className="mt-10">
            <h2 className="text-2xl text-purple-600 dark:text-purple-400 text-center font-semibold">Our Mission & Vision</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 text-justify">
              At SchoolMate, our mission is to revolutionize education by providing seamless digital tools that enhance learning and streamline school administration. Our vision is to create a future where education is accessible, engaging, and innovative for everyone.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl text-purple-600 dark:text-purple-400 text-center font-semibold">Security & Privacy</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 text-justify">
              SchoolMate prioritizes data security and user privacy. Our platform employs encryption, secure authentication, and compliance with data protection regulations to ensure that all student and school data remains safe and confidential.
            </p>
          </section>
        </motion.div>
      </div>
    </ThemeLayout>
  );
}
