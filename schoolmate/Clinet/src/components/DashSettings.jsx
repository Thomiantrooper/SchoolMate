import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeLayout';
import { FiSettings, FiInfo, FiSave, FiCheck, FiLock, FiMail, FiPhone, FiClock, FiGlobe, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DashSettings = () => {
  const { darkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('settingsFormData');
    return savedData
      ? JSON.parse(savedData)
      : {
          schoolName: '',
          schoolEmail: '',
          schoolPhone: '',
          schoolHours: '',
          notificationPreference: true,
          password: '',
          confirmPassword: '',
          twoFactorAuth: false,
          preferredLanguage: 'English',
        };
  });

  const [isSaved, setIsSaved] = useState(() => {
    const savedStatus = localStorage.getItem('isSaved');
    return savedStatus ? JSON.parse(savedStatus) : false;
  });

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    localStorage.setItem('settingsFormData', JSON.stringify(formData));
    localStorage.setItem('isSaved', JSON.stringify(isSaved));
  }, [formData, isSaved]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
    }));
    setIsSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Settings saved:', formData);
    setIsSaved(true);
    
    // Show success animation
    setTimeout(() => setIsSaved(false), 3000);
  };

  const inputClasses = `w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`;

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <FiSettings className="text-3xl mr-3 text-blue-500" />
            <h1 className="text-3xl font-bold">School Settings</h1>
          </div>
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`}
            >
              <FiCheck className="mr-2" /> Settings saved successfully!
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className={`flex mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {['general', 'security', 'notifications', 'appearance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${activeTab === tab 
                ? `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}` 
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FiSettings className="mr-2" /> General Settings
              </h2>
              
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="schoolName" className="block mb-2 font-medium flex items-center">
                      <FiMail className="mr-2" /> School Name
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Enter school name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="schoolEmail" className="block mb-2 font-medium flex items-center">
                      <FiMail className="mr-2" /> School Email
                    </label>
                    <input
                      type="email"
                      id="schoolEmail"
                      value={formData.schoolEmail}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="school@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="schoolPhone" className="block mb-2 font-medium flex items-center">
                      <FiPhone className="mr-2" /> School Phone
                    </label>
                    <input
                      type="tel"
                      id="schoolPhone"
                      value={formData.schoolPhone}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="+1234567890"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="schoolHours" className="block mb-2 font-medium flex items-center">
                      <FiClock className="mr-2" /> School Hours
                    </label>
                    <input
                      type="text"
                      id="schoolHours"
                      value={formData.schoolHours}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="8:00 AM - 4:00 PM"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="preferredLanguage" className="block mb-2 font-medium flex items-center">
                    <FiGlobe className="mr-2" /> Preferred Language
                  </label>
                  <select
                    id="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
                
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiShield className="mr-2" /> Security Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="password" className="block mb-2 font-medium flex items-center">
                      <FiLock className="mr-2" /> New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block mb-2 font-medium flex items-center">
                      <FiLock className="mr-2" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={formData.twoFactorAuth}
                    onChange={handleInputChange}
                    className={`w-4 h-4 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mr-2`}
                  />
                  <label htmlFor="twoFactorAuth" className="font-medium">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="notificationPreference"
                    checked={formData.notificationPreference}
                    onChange={handleInputChange}
                    className={`w-4 h-4 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mr-2`}
                  />
                  <label htmlFor="notificationPreference" className="font-medium">
                    Receive Email Notifications
                  </label>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                >
                  <FiSave className="mr-2" /> Save Changes
                </motion.button>
              </form>
            </motion.div>
          </div>
          
          {/* System Info Card */}
          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl shadow-lg h-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FiInfo className="mr-2" /> System Information
              </h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className="font-medium mb-2">System Version</h3>
                  <p className="text-sm">v2.3.1 (Latest)</p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className="font-medium mb-2">Last Backup</h3>
                  <p className="text-sm">Today, 3:45 PM</p>
                  <button className={`mt-2 text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                    Create new backup
                  </button>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className="font-medium mb-2">Storage Usage</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-sm">4.5 GB of 10 GB used</p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                  <h3 className="font-medium mb-2">Registered Users</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">Students: <span className="font-medium">1,248</span></p>
                      <p className="text-sm">Staff: <span className="font-medium">84</span></p>
                    </div>
                    <button className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                      View all
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm mb-3">Contact our support team for assistance with your settings.</p>
                <button className={`w-full py-2 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-200'} transition-colors`}>
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashSettings;