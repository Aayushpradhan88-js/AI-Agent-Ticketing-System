import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import storage from '../../utils/localStorage.js';


export const CheckAuth = ({ children, protectedRoute })  => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = storage.isAuthenticated();

    if (protectedRoute) {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      if (isAuthenticated) {
        navigate("/tickets");
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return <div>loading...</div>;
  }
  return children;
}