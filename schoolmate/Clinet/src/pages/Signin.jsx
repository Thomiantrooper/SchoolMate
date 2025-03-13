import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Please fill all the fields'));
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || 'Sign-in failed'));
        return;
      }

      dispatch(signInSuccess(data));
      
      // Check if email starts with std_ followed by numbers
      if (/^std_\d+/.test(formData.email.split('@')[0])) {
        navigate('/student-page');
      } else if (/^staff_\d+/.test(formData.email.split('@')[0])){
        navigate('/staff-page');
      } else {
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message || 'Something went wrong'));
    }
  };

  return (
    <div className='min-h-screen mt-20 flex items-center justify-center'>
      <div className='p-6 max-w-3xl mx-auto flex flex-col md:flex-row md:items-center gap-5 shadow-lg bg-white dark:bg-gray-900 rounded-lg'>
        
        {/* Left Section */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              SchoolMate
            </span>
          </Link>
          <p className='text-sm mt-5 text-gray-600 dark:text-gray-300'>
            Virtual study area to make learning easier
          </p>
        </div>

        {/* Right Section */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span> Don't have an account?</span>
            <Link to='/signup' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
