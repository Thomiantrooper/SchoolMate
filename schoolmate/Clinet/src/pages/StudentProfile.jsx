import { useState, useRef, useEffect } from 'react';
import { Button, TextInput, Alert, Badge, Spinner, Card } from 'flowbite-react';
import { HiCamera, HiAcademicCap, HiMail, HiUser, HiLockClosed } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/user/userSlice';
import { updateProfileImage } from '../redux/user/userSlice';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import AcademicMarks from './AcademicMarks'; // Import the new component

export default function StudentProfile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const storedImage = localStorage.getItem(`profileImage-${currentUser?._id}`);
  const [profileImage, setProfileImage] = useState(storedImage || currentUser?.profilePicture || '');
  
  const fileInputRef = useRef(null);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch student data when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/student/user/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setStudentData(data);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchStudentData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (profileImage) {
      localStorage.setItem(`profileImage-${currentUser?._id}`, profileImage);
    }
  }, [profileImage, currentUser]);

  const handleSignOut = () => {
    dispatch(logout());
    window.location.href = '/signin';
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        localStorage.setItem(`profileImage-${currentUser?._id}`, e.target.result);
        dispatch(updateProfileImage(e.target.result)); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateErrorMessage(null);
    setUpdateSuccessMessage(null);
    
    if (Object.keys(formData).length === 0) {
      setUpdateErrorMessage('No changes made');
      return;
    }
    
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateErrorMessage(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateSuccessMessage("Profile updated successfully!");
        setFormData({});
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateErrorMessage(error.message);
    }
  };

  if (!currentUser || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold">Student Profile</h1>
            <p className="mt-2 opacity-90">Manage your account information</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium text-lg ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-6 py-3 font-medium text-lg ${activeTab === 'marks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('marks')}
            >
              Academic Marks
            </button>
          </div>

          {/* Profile Content */}
          {activeTab === 'profile' ? (
            <div className="p-8 md:flex">
              {/* Left Column - Profile Picture */}
              <div className="md:w-1/3 flex flex-col items-center mb-8 md:mb-0">
                <div className="relative w-40 h-40 mb-4">
                  <img
                    src={profileImage}
                    alt="Student"
                    className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                    onClick={handleClick}
                    aria-label="Change profile picture"
                  >
                    <HiCamera className="w-5 h-5" />
                  </button>
                </div>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

                {/* Student Info */}
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">{studentData.name}</h2>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-center text-gray-600">
                      <HiAcademicCap className="mr-2" />
                      <span>Grade {studentData.grade}{studentData.section}</span>
                    </div>
                    <Badge color="info" className="inline-flex items-center mt-2">
                      SID: {studentData.studentEmail?.split('@')[0].toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="md:w-2/3 md:pl-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Email Address
                    </label>
                    <TextInput 
                      type="email" 
                      id="email" 
                      value={currentUser.email} 
                      readOnly 
                      icon={HiMail}
                      className="bg-gray-50 cursor-not-allowed"
                      shadow
                    />
                  </div>
                  
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Username
                    </label>
                    <TextInput 
                      type="text" 
                      id="username" 
                      placeholder="Enter your username" 
                      defaultValue={currentUser.username} 
                      onChange={handleChange} 
                      icon={HiUser}
                      shadow
                    />
                  </div>
                  
                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      New Password
                    </label>
                    <TextInput 
                      type="password" 
                      id="password" 
                      placeholder="Enter new password" 
                      onChange={handleChange} 
                      icon={HiLockClosed}
                      shadow
                    />
                  </div>
                  
                  {/* Alerts */}
                  {updateSuccessMessage && (
                    <Alert color="success" className="mt-4">
                      {updateSuccessMessage}
                    </Alert>
                  )}
                  
                  {updateErrorMessage && (
                    <Alert color="failure" className="mt-4">
                      {updateErrorMessage}
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      gradientDuoTone="purpleToBlue" 
                      className="w-full sm:w-auto"
                    >
                      Update Profile
                    </Button>
                    
                    <Button 
                      color="failure" 
                      outline 
                      onClick={handleSignOut}
                      className="w-full sm:w-auto"
                    >
                      Sign Out
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <AcademicMarks studentData={studentData} />
          )}
        </div>
      </div>
    </div>
  );
}