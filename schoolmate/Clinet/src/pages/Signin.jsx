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

  const handleLoginClick = async () => {
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

      const prefix = formData.email.split('@')[0];
      if (/^std_\d+/.test(prefix)) {
        navigate('/student-page');
      } else if (/^staff_\d+/.test(prefix)) {
        navigate('/staff-page');
      } else {
        navigate('/home');
      }
    } catch (error) {
      dispatch(signInFailure(error.message || 'Something went wrong'));
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4'>
      <div className='w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden'>

        {/* Left Branding Section */}
        <div className='md:w-1/2 p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col justify-center'>
          <h1 className='text-4xl font-extrabold mb-4'>Welcome Back 👋</h1>
          <p className='text-md mb-6'>
            Sign in to continue your journey with <span className='font-bold'>SchoolMate</span>.
          </p>
          <img
            src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg'
            alt='Study Illustration'
            className='w-3/4 mx-auto'
          />
        </div>

        {/* Right Form Section */}
        <div className='md:w-1/2 p-10'>
          <Link to='/' className='block text-3xl font-bold text-center mb-8 dark:text-white'>
            SchoolMate
          </Link>

          <form className='flex flex-col gap-5'>
            <div>
              <Label htmlFor='email' value='Email address' />
              <TextInput
                type='email'
                id='email'
                placeholder='name@company.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor='password' value='Password' />
              <TextInput
                type='password'
                id='password'
                placeholder=''
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              gradientDuoTone='purpleToPink'
              type='button'
              disabled={loading}
              onClick={handleLoginClick}
              className='mt-2'
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className='flex justify-between items-center mt-5 text-sm'>
            <span className='text-gray-600 dark:text-gray-300'>Don’t have an account?</span>
            <Link to='/signup' className='text-purple-600 hover:underline font-medium'>
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