import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {GoogleOAUTHButton} from '../../components/googleoauthbutton';

const LoginPage = () => {
const [form, setForm] = useState(
    {
      email: "",
      password: "",
    }
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Validate form data
    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
      console.log('Attempting login with:', { email: form.email }); // Don't log password
      console.log('Server URL:', serverUrl);
      
      const response = await fetch(`${serverUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim()
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log('Login successful, redirecting...');
        navigate("/tickets");
      } else {
        // Handle specific error responses
        const errorMessage = data.error || data.message || 'Login failed. Please try again.';
        setError(errorMessage);
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-inter">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">login Account</h1>
        <p className="text-center text-gray-600 mb-8"></p>

        {/* Google Sign-in Button */}
        <GoogleOAUTHButton text="Login with Google" disabled={loading} />
        
                <div className="flex items-center my-6"></div>
        {/* <button className="w-full flex items-center justify-center cursor-pointer space-x-2 bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-xl font-medium transition-colors hover:bg-gray-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
          <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_25)">
              <path d="M44.5 20H24V28.5H35.25C34.25 31.83 31.5 35 24 35C16.48 35 10 28.52 10 20C10 11.48 16.48 5 24 5C28.52 5 31.98 6.9 34.2 9.1L40.48 2.8C36.98 0.52 32.78 0 24 0C10.74 0 0 10.74 0 24C0 37.26 10.74 48 24 48C36.98 48 45.1 38.6 45.1 38.6C45.1 38.6 44.5 37 44.5 37V31.5H44.5C44.5 31.5 45.1 30.5 45.1 29.5V28.5H44.5V20Z" fill="#4285F4" />
              <path d="M44.5 20L24 20L24 28.5L35.25 28.5C34.25 31.83 31.5 35 24 35C16.48 35 10 28.52 10 20C10 11.48 16.48 5 24 5C28.52 5 31.98 6.9 34.2 9.1L40.48 2.8C36.98 0.52 32.78 0 24 0C10.74 0 0 10.74 0 24C0 37.26 10.74 48 24 48C36.98 48 45.1 38.6 45.1 38.6V20H44.5Z" fill="#FBBC05" />
              <path d="M24 0C10.74 0 0 10.74 0 24C0 37.26 10.74 48 24 48C36.98 48 45.1 38.6 45.1 38.6C45.1 38.6 44.5 37 44.5 37V31.5H44.5C44.5 31.5 45.1 30.5 45.1 29.5V28.5H44.5V20H24V0Z" fill="#EA4335" />
              <path d="M44.5 20L24 20V28.5H35.25C34.25 31.83 31.5 35 24 35C16.48 35 10 28.52 10 20C10 11.48 16.48 5 24 5C28.52 5 31.98 6.9 34.2 9.1L40.48 2.8C36.98 0.52 32.78 0 24 0C10.74 0 0 10.74 0 24C0 37.26 10.74 48 24 48C36.98 48 45.1 38.6 45.1 38.6C45.1 38.6 44.5 37 44.5 37V31.5H44.5C44.5 31.5 45.1 30.5 45.1 29.5V28.5H44.5V20Z" fill="#34A853" />
            </g>
            <defs>
              <clipPath id="clip0_1_25">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>Login with Google</span>
        </button> */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/*---------- Login Form ----------*/}
        <form onSubmit={handleLogin} className="space-y-6">
          {/*--- Email ---*/}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <input type="email" name="email"placeholder='email' id="email" autoComplete="email" required className="block  text-black w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              value={form.email}
              onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" 
                placeholder='password'
                id="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-xl pr-10 placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={form.password}
            onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 cursor-pointer flex items-center text-sm leading-5 text-gray-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {/* Eye open icon */}
                {showPassword ? (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.183z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.251 7.525 19.5 12 19.5c.995 0 1.968-.135 2.903-.38M16.32 7.227a12.08 12.08 0 013.774 4.773c-1.292 4.251-5.591 7.5-10.09 7.5-1.127 0-2.227-.197-3.268-.568m-2.106-.511a12.083 12.083 0 015.653-5.061m6.062-6.062a1.5 1.5 0 10-2.122-2.122m-2.122 2.122a1.5 1.5 0 10-2.122-2.122m-2.122 2.122a1.5 1.5 0 10-2.122-2.122M12 1.5a9.75 9.75 0 00-7.818 3.992M12 1.5a9.75 9.75 0 017.818 3.992m-.851-4.991l-2.06 2.06m-6.062-6.062a1.5 1.5 0 10-2.122 2.122m2.122-2.122L12 1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={loading}
            >
               {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Create a new account, then
          <a className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              <Link to="/register-form">register account</Link>
            </a>.
        </p>
      </div>
    </div>
  )
}

export default LoginPage