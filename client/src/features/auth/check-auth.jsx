import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; //warp code
import storage from '../../utils/localStorage.js';

export const CheckAuth = ({ children, protectedRoute })  => {
  const navigate = useNavigate();
  const location = useLocation(); //warp code analyze
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = storage.isAuthenticated();
    const user = storage.getUser(); //warp code analyze

    if (protectedRoute) {
      // Check if user is authenticated //warp code analyze
      if (!isAuthenticated) {
        navigate("/login");
        return; //warp code analyze
      }
      
      // Check if user has completed onboarding (except for onboarding page itself)
      if (location.pathname !== '/onboarding' && user && !user.onboardingCompleted) {
        navigate("/onboarding");
        return;
      }
      
      setLoading(false);//warp code analyze
    } else {
      // For non-protected routes (login, register)
      if (isAuthenticated) {
        // If authenticated, check onboarding status//warp code analyze
        if (user && !user.onboardingCompleted) {
          navigate("/onboarding");
        } else {
          navigate("/tickets");
        } //warp code analyze
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute, location.pathname]); //warp code analyze

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return children;
}
