import { useState, useRef, useEffect } from 'react';
import { Button, TextInput, Alert, Modal, Badge } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiCamera } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/user/userSlice';
import { updateProfileImage } from '../redux/user/userSlice';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/user/userSlice';

export default function StudentProfile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const storedImage = localStorage.getItem(`profileImage-${currentUser?._id}`);
  const [profileImage, setProfileImage] = useState(storedImage || currentUser?.profilePicture || '');
  
  const fileInputRef = useRef(null);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

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
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateErrorMessage(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        localStorage.removeItem(`profileImage-${currentUser._id}`);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 animate-wave opacity-30"></div>
      <div className="relative max-w-3xl w-full p-10 bg-gray-200 shadow-2xl rounded-3xl">
        <h1 className="text-center text-3xl font-semibold text-gray-800">Student Profile</h1>

        {/* Profile Image Section */}
        <div className="relative mx-auto w-32 h-32 mt-6">
          <img
            src={profileImage}
            alt="Student"
            className="rounded-full w-full h-full object-cover border-4 border-gray-400"
          />
          <button
            className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full"
            onClick={handleClick}
          >
            <HiCamera className="w-6 h-6" />
          </button>
        </div>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

        {/* Student Badge */}
        <div className="text-center mt-4">
          <Badge color="blue">Student</Badge>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextInput type="text" id="username" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange} />
          <TextInput type="email" id="email" placeholder="Email" defaultValue={currentUser.email} onChange={handleChange} />
          <TextInput type="password" id="password" placeholder="New Password" onChange={handleChange} />
          <Button type="submit" gradientDuoTone="purpleToBlue" outline className="w-full">
            Update Profile
          </Button>
        </form>

        {/* Actions: Delete & Sign Out */}
        <div className="flex justify-between text-red-500 mt-6">
          <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer" onClick={handleSignOut}>Sign Out</span>
        </div>
      </div>
    </div>
  );
}
