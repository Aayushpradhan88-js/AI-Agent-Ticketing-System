import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

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

    //-----Validate form data-----//
    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

      const response = await axios.post(`${serverUrl}/api/v1/auth/login`, {
        form
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.token) {
        localStorage.setItem('ticketing', JSON.stringify(data.token));
        localStorage.setItem('user ticket', JSON.stringify(data.user));
        console.log('Login successful, redirecting...');
        
        // Check onboarding status and redirect accordingly /*
        if (data.user && data.user.onboardingCompleted) {
          navigate("/tickets");
        } else {
          navigate("/onboarding");
        } 
        setLoading(false);
      } else {
        // Handle specific error responses
        const errorMessage = data.error || data.message || 'Login failed. Please try again.';
        setError(errorMessage);
        console.error('Login failed:', data);
         setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-300 flex items-center justify-center min-h-screen p-4 font-inter">
      <div className="bg-white p-8 sm:p-10 rounded-3xl  w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">login Account</h1>
        <p className="mb-8"></p>

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
              <input type="email" name="email" placeholder='email' id="email" autoComplete="email" required className="  text-black w-full px-4 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className=" text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder='password'
                id="password"
                autoComplete="new-password"
                required
                className=" text-black w-full px-4 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <i class="ri-eye-line"></i>
                ) : (
                  <i class="ri-eye-off-line"></i>
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