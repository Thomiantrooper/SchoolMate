import { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  TextInput, 
  Alert, 
  Modal, 
  Badge, 
  Spinner,
  Avatar,
  Card,
  Tooltip
} from 'flowbite-react';
import { 
  HiOutlineExclamationCircle, 
  HiCamera, 
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineLogout,
  HiCheck,
  HiX
} from 'react-icons/hi';
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

export default function StaffProfile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  
  // State management
  const [profileImage, setProfileImage] = useState(currentUser?.profilePicture || '');
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Handle image changes
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setImageUploading(true);
        
        // Validate image size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          setUpdateErrorMessage('Image size should be less than 2MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target.result;
          setProfileImage(imageData);
          dispatch(updateProfileImage(imageData));
          
          // Update profile image in backend
          updateProfileImageInBackend(imageData);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setUpdateErrorMessage('Failed to upload image');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const updateProfileImageInBackend = async (imageData) => {
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicture: imageData }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update profile image');
      }
      
      setUpdateSuccessMessage('Profile image updated successfully!');
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    } catch (error) {
      setUpdateErrorMessage(error.message);
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
        throw new Error(data.message || 'Failed to update profile');
      }
      
      dispatch(updateSuccess(data));
      setUpdateSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateErrorMessage(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }
      
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    window.location.href = '/signin';
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({});
      setUpdateErrorMessage(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Staff Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and settings</p>
        </div>

        {/* Success/Error Messages */}
        {updateSuccessMessage && (
          <Alert color="success" className="mb-6" onDismiss={() => setUpdateSuccessMessage(null)}>
            <span className="font-medium">{updateSuccessMessage}</span>
          </Alert>
        )}
        {updateErrorMessage && (
          <Alert color="failure" className="mb-6" onDismiss={() => setUpdateErrorMessage(null)}>
            <span className="font-medium">{updateErrorMessage}</span>
          </Alert>
        )}

        {/* Profile Card */}
        <Card className="rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center md:w-1/3">
              <div className="relative mb-4">
                <Avatar
                  img={profileImage || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  rounded
                  size="xl"
                  className="border-4 border-white shadow-lg"
                />
                <Tooltip content="Change profile picture">
                  <button
                    onClick={handleClick}
                    disabled={imageUploading}
                    className={`absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors ${
                      imageUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {imageUploading ? <Spinner size="sm" /> : <HiCamera className="w-5 h-5" />}
                  </button>
                </Tooltip>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                />
              </div>
              
              <Badge color="blue" size="lg" className="mb-4">
                {currentUser.role || 'Staff'}
              </Badge>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">{currentUser.username}</h2>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            {/* Profile Form Section */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
                <Button
                  onClick={toggleEditMode}
                  gradientDuoTone={isEditing ? "redToOrange" : "purpleToBlue"}
                  outline
                  size="sm"
                >
                  {isEditing ? (
                    <>
                      <HiX className="mr-2" /> Cancel
                    </>
                  ) : (
                    <>
                      <HiOutlinePencilAlt className="mr-2" /> Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <TextInput
                    id="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <TextInput
                    type="email"
                    id="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <TextInput
                    type="password"
                    id="password"
                    placeholder="Leave blank to keep current"
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      gradientDuoTone="purpleToBlue"
                      disabled={loading}
                      className="w-full md:w-auto"
                    >
                      {loading ? <Spinner size="sm" className="mr-2" /> : <HiCheck className="mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>

              {/* Actions */}
              <div className="border-t border-gray-200 mt-8 pt-6 flex justify-between">
                <Tooltip content="Delete your account permanently">
                  <Button
                    color="failure"
                    outline
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center"
                  >
                    <HiOutlineTrash className="mr-2" /> Delete Account
                  </Button>
                </Tooltip>
                
                <Button
                  color="gray"
                  outline
                  onClick={handleSignOut}
                  className="flex items-center"
                >
                  <HiOutlineLogout className="mr-2" /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account? This action cannot be undone.
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteAccount} disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Yes, delete it'}
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}