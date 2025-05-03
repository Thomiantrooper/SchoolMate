import { useState, useRef, useEffect } from 'react';
import { Button, TextInput, Alert, Modal, Spinner } from 'flowbite-react'; 
import { HiOutlineExclamationCircle, HiOutlineCamera, HiOutlineCheckCircle } from 'react-icons/hi';
import { FiLogOut, FiTrash2 } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/user/userSlice';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/user/userSlice';

export default function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  
  const storedImage = localStorage.getItem(`profileImage-${currentUser?._id}`);
  const [profileImage, setProfileImage] = useState(storedImage || currentUser?.profilePicture || '');
  
  const fileInputRef = useRef(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (profileImage) {
      localStorage.setItem(`profileImage-${currentUser?._id}`, profileImage);
    }
  }, [profileImage, currentUser]);

  const handleSignOut = () => {
    dispatch(logout());
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setImageUploading(true);
        // You might want to upload the image to your server here
        // For demo purposes, we'll just use the local file
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result); 
          localStorage.setItem(`profileImage-${currentUser?._id}`, e.target.result);
          setImageUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setUpdateUserError('Image upload failed');
        setImageUploading(false);
      }
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
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
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
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully!");
        // Clear form after successful update
        setFormData({});
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
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

  if (!currentUser) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="xl" />
    </div>
  );

  return (
    <div className='max-w-lg mx-auto p-6 w-full bg-white rounded-lg shadow-md dark:bg-gray-800'>
      <h1 className='mb-8 text-center font-bold text-3xl text-gray-800 dark:text-white'>Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className="relative self-center">
          <div 
            className='w-40 h-40 cursor-pointer shadow-lg overflow-hidden rounded-full relative group'
            onClick={handleClick}
          >
            <img
              src={profileImage}
              alt='user'
              className='rounded-full w-full h-full object-cover border-4 border-gray-200 dark:border-gray-600'
            />
            {imageUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <HiOutlineCamera className="w-10 h-10 text-white" />
            </div>
          </div>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <TextInput 
              type='text' 
              id='username' 
              placeholder='username' 
              defaultValue={currentUser.username} 
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <TextInput 
              type='email' 
              id='email' 
              placeholder='email' 
              defaultValue={currentUser.email} 
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <TextInput 
              type='password' 
              id='password' 
              placeholder='••••••••' 
              onChange={handleChange}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Leave blank to keep current password</p>
          </div>
        </div>

        <Button 
          type='submit' 
          gradientDuoTone='purpleToBlue' 
          className="mt-4"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Save Changes'}
        </Button>
      </form>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button 
          color="failure" 
          outline 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FiTrash2 className="w-5 h-5" />
          Delete Account
        </Button>
        <Button 
          color="gray" 
          outline 
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <FiLogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>

      {updateUserSuccess && (
        <Alert color='success' className='mt-6' icon={HiOutlineCheckCircle}>
          <div className="font-medium">{updateUserSuccess}</div>
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-6'>
          <div className="font-medium">{updateUserError}</div>
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700" />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-red-500 dark:text-red-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg font-medium text-gray-700 dark:text-gray-300'>
              Are you sure you want to delete your account?
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. All your data will be permanently removed.
            </p>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser} disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Yes, I'm sure"}
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}