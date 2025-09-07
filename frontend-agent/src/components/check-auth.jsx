import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const CheckAuth = ({ children, protected: protectedRoute }) => {
   const navigate = useNavigate();
   const location = useLocation();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

    // Function to check authentication status with backend
    const checkAuthStatus = async () => {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
        
        try {
            const response = await fetch(`${serverUrl}/api/v1/auth/me`, {
                method: 'GET',
                credentials: 'include', // Include cookies for session-based auth
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                // Store user data
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // If it's session-based auth, we might not have a token
                if (data.authType === 'session' && !localStorage.getItem('token')) {
                    // For session-based auth, we can create a dummy token or handle differently
                    localStorage.setItem('authType', 'session');
                }
                
                return true;
            } else {
                // Clear any existing auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('authType');
                return false;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // On network error, check if we have a token locally
            const token = localStorage.getItem('token');
            return !!token;
        }
    };

    useEffect(() => {
        const handleAuth = async () => {
            setLoading(true);
            setError('');
            
            // Handle OAuth callback
            const urlParams = new URLSearchParams(location.search);
            const authSuccess = urlParams.get('auth');
            const authError = urlParams.get('error');
            
            if (authSuccess === 'success') {
                // OAuth success - check auth status with backend
                const isAuthenticated = await checkAuthStatus();
                if (isAuthenticated) {
                    navigate('/tickets', { replace: true });
                    return;
                } else {
                    setError('Authentication failed. Please try again.');
                }
            } else if (authError) {
                setError('OAuth authentication failed. Please try again.');
            }
            
            // Regular auth check
            const isAuthenticated = await checkAuthStatus();
            
            if (protectedRoute) {
                if (!isAuthenticated) {
                    navigate("/login");
                } else {
                    setLoading(false);
                }
            } else {
                if (isAuthenticated && location.pathname === '/login') {
                    navigate("/tickets");
                } else {
                    setLoading(false);
                }
            }
        };
        
        handleAuth();
    }, [navigate, protectedRoute, location]);
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }
    
    return children;
}
