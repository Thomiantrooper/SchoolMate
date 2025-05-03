import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaCalendarAlt, 
  FaLaptop, 
  FaCommentDots, 
  FaClipboardList,
  FaGraduationCap,
  FaShieldAlt,
  FaLightbulb,
  FaRocket,
  FaChartLine,
  FaUserShield
} from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import ThemeLayout from '../components/ThemeLayout';

const FeatureCard = ({ feature, onClick }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer ${feature.color} h-full`}
  >
    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white bg-opacity-10"></div>
    <div className="p-8 flex flex-col h-full">
      <div className="mb-6 p-5 rounded-2xl bg-white bg-opacity-10 w-max">
        {feature.icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-white text-opacity-80 mb-6">{feature.description}</p>
      <div className="mt-auto">
        <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium text-white">
          Learn more →
        </span>
      </div>
    </div>
  </motion.div>
);

export default function About() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  const features = [
    { 
      title: "Student Management", 
      description: "Comprehensive student profiles with academic tracking, behavior analytics, and personalized learning paths.", 
      color: "bg-gradient-to-br from-indigo-600 to-purple-600", 
      icon: <FaUsers className="text-white" size={24} />,
      stats: "98% accuracy in attendance tracking"
    },
    { 
      title: "Educator Hub", 
      description: "Powerful tools for lesson planning, grade management, and student performance analytics.", 
      color: "bg-gradient-to-br from-rose-600 to-pink-600", 
      icon: <FaChalkboardTeacher className="text-white" size={24} />,
      stats: "Save 10+ hours weekly on admin tasks"
    },
    { 
      title: "Smart Scheduling", 
      description: "AI-powered timetable generation that optimizes resources and minimizes conflicts.", 
      color: "bg-gradient-to-br from-amber-500 to-orange-600", 
      icon: <FaCalendarAlt className="text-white" size={24} />,
      stats: "Reduces scheduling conflicts by 85%"
    },
    { 
      title: "Digital Campus", 
      description: "Immersive virtual classrooms with interactive whiteboards, breakout rooms, and media sharing.", 
      color: "bg-gradient-to-br from-emerald-500 to-teal-600", 
      icon: <FaLaptop className="text-white" size={24} />,
      stats: "Used by 1M+ students daily"
    },
    { 
      title: "Family Portal", 
      description: "Real-time progress updates, behavior notifications, and direct messaging with educators.", 
      color: "bg-gradient-to-br from-red-500 to-amber-600", 
      icon: <FaCommentDots className="text-white" size={24} />,
      stats: "Increases parent engagement by 3x"
    },
    { 
      title: "Assessment Suite", 
      description: "Create, deliver, and analyze assessments with advanced plagiarism detection and analytics.", 
      color: "bg-gradient-to-br from-blue-500 to-cyan-600", 
      icon: <FaClipboardList className="text-white" size={24} />,
      stats: "Automates 90% of grading workflows"
    }
  ];
  
  return (
    <ThemeLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-10 top-1/4 w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900 opacity-20 blur-3xl"></div>
          <div className="absolute right-20 top-1/3 w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900 opacity-20 blur-3xl"></div>
          <div className="absolute left-1/3 bottom-1/4 w-96 h-96 rounded-full bg-amber-100 dark:bg-amber-900 opacity-10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-28"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center mb-8 p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
            >
              <IoMdSchool className="text-blue-500 text-4xl mr-3" />
              <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                SchoolMate Pro
              </h1>
            </motion.div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The next-generation <span className="font-semibold text-blue-500">education intelligence platform</span> that transforms how schools operate, teach, and learn
            </p>
          </motion.section>

          {/* Main Content */}
          <div className="space-y-28">
            {/* Introduction */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <div className="p-12 md:p-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    <span className="inline-block pb-2 border-b-4 border-blue-500">Redefining</span> Education Technology
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    SchoolMate Pro combines cutting-edge technology with pedagogical expertise to deliver an unparalleled educational ecosystem. Our platform isn't just software—it's a complete transformation of the learning experience.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="px-4 py-2 bg-blue-500 bg-opacity-10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                      AI-Powered
                    </span>
                    <span className="px-4 py-2 bg-purple-500 bg-opacity-10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                      Research-Backed
                    </span>
                    <span className="px-4 py-2 bg-green-500 bg-opacity-10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                      GDPR Compliant
                    </span>
                  </div>
                </div>
                <div className="p-12 md:p-16 bg-white dark:bg-gray-800 border-l border-gray-100 dark:border-gray-700">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl mr-4">
                        <FaRocket className="text-blue-500 dark:text-blue-400 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Accelerate Learning</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Our adaptive learning algorithms identify student needs and automatically suggest personalized resources.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl mr-4">
                        <FaChartLine className="text-purple-500 dark:text-purple-400 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Data-Driven Insights</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Real-time analytics dashboards provide actionable intelligence for administrators and educators.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-xl mr-4">
                        <FaUserShield className="text-amber-500 dark:text-amber-400 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Enterprise Security</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Military-grade encryption and zero-trust architecture protect your institutional data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
                <div className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 shadow-lg rounded-full">
                  <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                    Platform Features
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden pt-16">
                <div className="px-12 pb-12">
                  <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
                    Comprehensive <span className="text-blue-500">Education</span> Solutions
                  </h2>
                  <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
                    Every tool your institution needs in one seamlessly integrated platform
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                      <FeatureCard 
                        key={index} 
                        feature={feature}
                        onClick={() => setSelectedFeature(feature)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Mission & Vision */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden text-white"
            >
              <div className="p-12 md:p-16">
                <div className="grid md:grid-cols-2 gap-16">
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                        <FaLightbulb className="text-yellow-300 text-xl" />
                      </div>
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                    </div>
                    <p className="text-lg opacity-90 mb-6">
                      To dismantle educational barriers through innovative technology that empowers every learner, educator, and administrator to achieve their full potential.
                    </p>
                    <div className="p-6 bg-white bg-opacity-10 rounded-xl">
                      <p className="italic opacity-90">
                        "Education is the most powerful weapon which you can use to change the world."
                      </p>
                      <p className="mt-2 font-medium">- Nelson Mandela</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                        <FaLightbulb className="text-purple-300 text-xl" />
                      </div>
                      <h3 className="text-2xl font-bold">Our Vision</h3>
                    </div>
                    <p className="text-lg opacity-90 mb-6">
                      A world where education adapts to each learner's needs, where administrative burdens disappear, and where every educational interaction is meaningful and measurable.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                        Personalized Learning
                      </span>
                      <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                        Global Accessibility
                      </span>
                      <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                        Data Empowerment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Security Section */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <div className="p-12 md:p-16 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center mb-8">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl mr-4">
                      <FaShieldAlt className="text-blue-500 dark:text-blue-400 text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                      Enterprise-Grade <span className="text-blue-500">Security</span>
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    We treat your data with the highest level of protection, employing security measures that exceed industry standards.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">256-bit Encryption</span> - All data in transit and at rest
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">SOC 2 Type II Certified</span> - Regular independent audits
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Zero-Knowledge Architecture</span> - We never access your data
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-12 md:p-16 bg-white dark:bg-gray-800 border-l border-gray-100 dark:border-gray-700">
                  <div className="h-full flex flex-col justify-center">
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        Compliance & Certifications
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="text-blue-500 dark:text-blue-400 font-bold text-lg mb-1">GDPR</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">EU Data Protection</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="text-blue-500 dark:text-blue-400 font-bold text-lg mb-1">COPPA</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Child Privacy</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="text-blue-500 dark:text-blue-400 font-bold text-lg mb-1">FERPA</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Education Records</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="text-blue-500 dark:text-blue-400 font-bold text-lg mb-1">ISO 27001</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Security Management</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        Continuous Protection
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Our security team monitors threats 24/7, with automatic updates that ensure your protection evolves against emerging risks.
                      </p>
                      <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                        Request Security Documentation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Feature Modal */}
        <AnimatePresence>
          {selectedFeature && (
            <motion.div 
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>
              <motion.div 
                className={`relative rounded-3xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden ${selectedFeature.color}`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-12">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center">
                      <div className="p-4 bg-white bg-opacity-20 rounded-xl mr-4">
                        {selectedFeature.icon}
                      </div>
                      <h2 className="text-3xl font-bold text-white">{selectedFeature.title}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedFeature(null)}
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-white text-opacity-90 text-lg mb-8">
                        {selectedFeature.description}
                      </p>
                      <div className="p-6 bg-white bg-opacity-10 rounded-xl">
                        <p className="text-white font-medium mb-2">Key Benefit:</p>
                        <p className="text-white text-opacity-90">{selectedFeature.stats}</p>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4">Feature Highlights</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-opacity-90">Intuitive interface designed for educators</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-opacity-90">Seamless integration with existing systems</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-opacity-90">Dedicated customer success manager</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-opacity-90">Regular feature updates based on feedback</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <button className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      Schedule Demo
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeLayout>
  );
}