import { useState, useMemo, useEffect } from 'react';
import { Form, Link, useActionData, useSubmit, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { store } from '../store';
import { registerUser } from '../features/user/userSlice';
import countryList from 'react-select-country-list';
import bcrypt from 'bcryptjs';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const name = `${data.firstName} ${data.lastName}`;

  const payload = {
    name,
    email: data.email,
    password: data.password,
    comformationPassword: data.confirmationPassword,
    lastName: data.lastName,
    nationality: data.nationality,
    phoneNumber: data.phoneNumber,
  };

  try {
    const response = await axios.post(
      // 'https://rental-service-backend.onrender.com/api/v1/auth/register'
      'http://localhost:5000/api/v1/auth/register'
      , payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    const { user } = response.data;
    store.dispatch(registerUser({ user }));

    return { success: true, message: 'Account created and logged in successfully' };
  } catch (error) {
    console.error('Full error response:', error.response);
    const errorMessage =
      error?.response?.data?.msg ||
      error?.response?.data?.error?.message ||
      'An error occurred during registration';
    return { error: errorMessage, details: error.response };
  }
};

const Register = () => {
  const [nationalityInput, setNationalityInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const actionData = useActionData();
  const countries = useMemo(() => countryList().getData(), []);
  const submit = useSubmit();
  const navigate = useNavigate();

  const filteredCountries = countries.filter(country => 
    country.label.toLowerCase().startsWith(nationalityInput.toLowerCase())
  );

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success(actionData.message);
        navigate('/');
      } else if (actionData.error) {
        toast.error(actionData.error);
        console.log('Error details:', actionData.details);
      }
    }
  }, [actionData, navigate]);

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '554671960122-prtlihffmfurorufsr024e8m849nqvfl.apps.googleusercontent.com', // Replace with your actual Google Client ID
        callback: handleGoogleSignIn
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const confirmationPassword = formData.get('confirmationPassword');

    if (password !== confirmationPassword) {
      setPasswordError('Passwords do not match');
      toast.error('Passwords do not match');
    } else {
      setPasswordError('');
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedConfirmationPassword = await bcrypt.hash(confirmationPassword, salt);

        formData.set('password', hashedPassword);
        formData.set('confirmationPassword', hashedConfirmationPassword);

        submit(formData, { method: 'post' });
      } catch (error) {
        console.error('Error hashing password:', error);
        toast.error('An error occurred while processing the password.');
      }
    }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 6 && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const handleGoogleSignIn = async (response) => {
    try {
      const { credential } = response;

      const apiResponse = await axios.post(
        // 'https://rental-service-backend.onrender.com/api/v1/auth/google-signin'
        'http://localhost:5000/api/v1/auth/google-signin'
        , { credential }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const { user } = apiResponse.data;
      store.dispatch(registerUser({ user }));
      toast.success('Signed in with Google successfully');
      navigate('/');
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <section className='h-screen grid place-items-center'>
      <Form
        method='post'
        className='card w-[500px] p-6 bg-base-100 shadow-lg flex flex-col gap-y-4 mt-4 mb-4'
        onSubmit={handleSubmit}
      >
        <h4 className='text-center text-3xl font-bold'>Sign Up</h4>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <input
            type='text'
            name='firstName'
            placeholder='First Name'
            className='bg-transparent border border-gray-700 p-2 rounded'
            required
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last Name'
            className='bg-transparent border border-gray-700 p-2 rounded'
            required
          />
        </div>
        <input
          type='email'
          name='email'
          placeholder='Email Address'
          className='bg-transparent border border-gray-700 p-2 rounded w-full mb-4'
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          className='bg-transparent border border-gray-700 p-2 rounded w-full mb-4'
          required
          onChange={(e) => {
            if (!validatePassword(e.target.value)) {
              setPasswordError('Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character');
            } else {
              setPasswordError('');
            }
          }}
        />
        <input
          type='password'
          name='confirmationPassword'
          placeholder='Confirm Password'
          className='bg-transparent border border-gray-700 p-2 rounded w-full mb-4'
          required
        />
        {passwordError && <p className="text-red-500">{passwordError}</p>}
        <input
          type='tel'
          name='phoneNumber'
          placeholder='Phone Number'
          className='bg-transparent border border-gray-700 p-2 rounded w-full mb-4'
          required
        />
        <div className="relative mb-4">
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={nationalityInput}
            onChange={(e) => setNationalityInput(e.target.value)}
            className="bg-transparent border border-gray-700 p-2 rounded w-full"
            list="country-list"
            required
          />
          <datalist id="country-list">
            {filteredCountries.map((country) => (
              <option key={country.value} value={country.label} />
            ))}
          </datalist>
        </div>
        <div className='mt-4'>
          <button
            type='submit'
            className='btn btn-primary btn-block'
          >
            Sign Up
          </button>
        </div>
        <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded w-full mb-2 flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </button>
        <div id="googleSignInButton" className="w-full"></div>
        <p className='text-center'>
          Already a member?{' '}
          <Link
            to='/login'
            className='ml-2 link link-hover link-primary capitalize'
          >
            login
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Register;