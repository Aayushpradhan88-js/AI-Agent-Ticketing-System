import React, { useState } from 'react';
// Import BrowserRouter from react-router-dom to provide routing context
import { BrowserRouter as Router, Link } from 'react-router-dom';

export const SignUp = () => {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // Changed to null for file input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    

    return (
        // Main container with green background, centered content, and responsive padding
          <div className="min-h-screen flex items-center justify-center bg-green-500 p-4">
            <style>
                {`
                    /* Inter font from Google Fonts */
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                    /* Basic Tailwind colors for demonstration */
                    .bg-green-500 { background-color: #22c55e; 
                    margin: 0;
                    height: 100vh;
                    width: 100vw }

                    input { 
                    color: #222; 
                    background: #fff; 
                    }
                    .bg-white { background-color: #ffffff; }
                    .text-gray-800 { color:rgb(209, 216, 224); }
                    .text-gray-600 { color:rgb(233, 239, 247); }
                    .border-gray-300 { border-color: #d1d5db; }
                    .focus\\:ring-blue-500:focus { --tw-ring-color: #3b82f6; }
                    .focus\\:border-blue-500:focus { border-color: #3b82f6; }
                    .bg-blue-600 { background-color: #2563eb; }
                    .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
                    .bg-red-600 { background-color: #dc2626; }
                    .hover\\:bg-red-700:hover { background-color: #b91c1c; }
                    .text-blue-600 { color: #2563eb; }
                    .hover\\:underline:hover { text-decoration-line: underline; }
                `}
            </style>
            {/* Card-like container for the form, with rounded corners and shadow */}
            {/* Changed max-w-md to max-w-sm to make the form page smaller */}
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
                {/* Top Design - Logo and Title */}
                <div className="text-center mb-2">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Logo</h3>
                    <p className="text-xl font-semibold text-gray-600">Create Your Account</p>
                </div>

                {/* Bottom Design - Form */}
                <form  className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            // id="username"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value

                            )}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            id="fullname"
                            type="text"
                            placeholder="Enter full name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                        <input
                            id="profilePicture"
                            type="file" // Corrected type to 'file' for image uploads
                            onChange={e => setProfilePicture(e.target.files[0])} // Store the file object
                            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                        />
                        {profilePicture && (
                            <p className="text-sm text-gray-500 mt-2">Selected file: {profilePicture.name}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md"
                    >
                        Sign Up
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/signin-account" className="text-blue-600 font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-600 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        type="button" // Changed to button type
                        className="w-full flex items-center justify-center bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 shadow-md"
                    >
                        {/* Google G icon - using inline SVG for simplicity */}
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.0003 12.723C12.0003 12.38 11.9723 12.037 11.9163 11.696L12.0003 11.693L23.6963 11.693C23.7853 12.278 23.8363 12.879 23.8363 13.488C23.8363 18.868 20.1533 22.5 15.0003 22.5C9.47133 22.5 5.00033 18.029 5.00033 12.5C5.00033 6.971 9.47133 2.5 15.0003 2.5C17.7663 2.5 20.0893 3.447 21.8493 5.000L18.7913 7.951C17.7123 7.001 16.4023 6.5 15.0003 6.5C11.6863 6.5 8.99133 9.195 8.99133 12.5C8.99133 15.805 11.6863 18.5 15.0003 18.5C17.0793 18.5 18.5793 17.616 19.3493 16.856C20.0103 16.195 20.4723 15.228 20.6773 14.214L15.0003 14.214V11.693H23.6963Z" fill="white"/>
                        </svg>
                        Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
};