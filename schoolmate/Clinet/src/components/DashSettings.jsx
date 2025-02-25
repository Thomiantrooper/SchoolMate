import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeLayout';

const DashSettings = () => {
  const { darkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('settingsFormData');
    return savedData ? JSON.parse(savedData) : {
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
        gap: '20px',
        padding: '20px',
        backgroundColor: darkMode ? '#121212' : '#fff',
        color: darkMode ? '#f4f4f9' : '#333',
      }}
    >
      <div
        style={{
          flex: '1',
          backgroundColor: darkMode ? '#222' : '#f4f4f9',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ fontSize: '24px' }}>School System Settings</h2>
        <form>
          {['schoolName', 'schoolEmail', 'schoolPhone', 'schoolHours'].map((field) => (
            <div key={field} style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', display: 'block' }}>{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
              <input
                type={field.includes('Email') ? 'email' : 'text'}
                id={field}
                value={formData[field]}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px' }}
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            style={{
              backgroundColor: isSaved ? '#D3D3D3' : '#007bff',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: isSaved ? 'not-allowed' : 'pointer',
            }}
            disabled={isSaved}
          >
            {isSaved ? 'Settings Saved' : 'Save Settings'}
          </button>
        </form>
      </div>

      <div
        style={{
          flex: '1',
          backgroundColor: darkMode ? '#222' : '#f4f4f9',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ fontSize: '20px' }}>System Information</h3>
        <p style={{ fontSize: '16px' }}>This section contains important school system details.</p>
        <ul style={{ fontSize: '16px' }}>
          <li>System Version: 1.0.0</li>
          <li>Last Backup: 2025-02-01</li>
          <li>Registered Students: 200</li>
        </ul>
      </div>
    </div>
  );
};

export default DashSettings;
