import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const[username, setUserName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState(null);

  const handleRegister = async(e) => {
    e.prevent.default
    setLoading(true);
    setError('');

    const response = await axios.post('http://localhost:3000/api/v1/register', {
      username,
      email,
      password
    });

    const userData = {
      id: response.data.user.id,
      username: response.data.user.username,
      email: response.data.user.email
    }

    const navigate = useNavigate();
    if(response.status === 200){
      localStorage.setItem("registed Token", response.data.token);
      localStorage.ssetItem("register user", userData);
      navigate("/onboarding");
    }
  }


};

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-inter">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create an Account</h1>
        <p className="text-center text-gray-600 mb-8"></p>

        {/*---------- Registration Form ----------*/}
        <form onSubmit={handleRegister} className="space-y-6">
          {/*--- username ---*/}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1">
              <input type="text" name="username" placeholder='username' id="username" autoComplete="username" required className="block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-black-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/*--- Email ---*/}
          <div>
            <label htmlFor="email" className="block text-sm font-mediu text-gray-700">Email</label>
            <div className="mt-1">
              <input type="email" name="email" placeholder='email' id="email" autoComplete="email" required className="block text-black w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="block w-full px-4 py-2 border border-gray-300 text-black rounded-xl pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {/* Eye open icon */}
                {showPassword ? (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.183z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  /* Eye closed icon */
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.251 7.525 19.5 12 19.5c.995 0 1.968-.135 2.903-.38M16.32 7.227a12.08 12.08 0 013.774 4.773c-1.292 4.251-5.591 7.5-10.09 7.5-1.127 0-2.227-.197-3.268-.568m-2.106-.511a12.083 12.083 0 015.653-5.061m6.062-6.062a1.5 1.5 0 10-2.122-2.122m-2.122 2.122a1.5 1.5 0 10-2.122-2.122m-2.122 2.122a1.5 1.5 0 10-2.122-2.122M12 1.5a9.75 9.75 0 00-7.818 3.992M12 1.5a9.75 9.75 0 017.818 3.992m-.851-4.991l-2.06 2.06m-6.062-6.062a1.5 1.5 0 10-2.122 2.122m2.122-2.122L12 1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex cursor-pointer justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          If you already have an account, then?
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
