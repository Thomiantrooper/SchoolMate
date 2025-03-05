import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeLayout';

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
  };

  const handleSave = () => {
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match.');
      return;
    }
    console.log('Settings saved:', formData);
    setIsSaved(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '30px', 
        padding: '20px',
        backgroundColor: darkMode ? '#121212' : '#f9f9f9',
        color: darkMode ? '#f4f4f9' : '#333',
      }}
    >
      {/* Left Panel - School Settings */}
      <div
        style={{
          flex: '1.5', 
          backgroundColor: darkMode ? '#222' : '#fff',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: darkMode
            ? '0px 4px 8px rgba(0,0,0,0.2)'
            : '0px 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>
          ⚙️ School System Settings
        </h2>
        <form>
          {['schoolName', 'schoolEmail', 'schoolPhone', 'schoolHours'].map((field) => (
            <div key={field} style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                {field.replace(/([A-Z])/g, ' $1').trim()}:
              </label>
              <input
                type={field.includes('Email') ? 'email' : 'text'}
                id={field}
                value={formData[field]}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid gray',
                  backgroundColor: darkMode ? '#333' : '#fff',
                  color: darkMode ? '#f4f4f9' : '#333',
                }}
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            style={{
              backgroundColor: isSaved ? '#aaa' : '#007bff',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: isSaved ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              border: 'none',
              transition: '0.3s',
            }}
            disabled={isSaved}
          >
            {isSaved ? '✅ Settings Saved' : '💾 Save Settings'}
          </button>
        </form>
      </div>

      {/* Right Panel - System Information */}
      <div
        style={{
          flex: '1.2', // Increased width slightly
          backgroundColor: darkMode ? '#222' : '#fff',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: darkMode
            ? '0px 4px 8px rgba(0,0,0,0.2)'
            : '0px 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ fontSize: '22px', display: 'flex', alignItems: 'center' }}>
          📊 System Information
        </h3>
        <p style={{ fontSize: '16px', marginTop: '10px' }}>
          This section contains important school system details.
        </p>
        <hr style={{ margin: '10px 0', border: '0.5px solid gray' }} />
        <ul style={{ fontSize: '16px', paddingLeft: '15px', lineHeight: '1.8' }}>
          <li>📌 <b>System Version:</b> 1.0.0</li>
          <li>📅 <b>Last Backup:</b> 2025-02-01</li>
          <li>🎓 <b>Registered Students:</b> 200</li>
        </ul>
      </div>
    </div>
  );
};

export default DashSettings;
