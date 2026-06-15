// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { userToken } = useAuth();

  if (!userToken) {
    // If user is not logged in, redirect to login
    // Pass the current location so that after login, user can be redirected back
    return <Navigate to="/login" state={{ from: location, message: "Please log in to access this page." }} replace />;
  }

  return children; // If logged in, render the children components
};

export default ProtectedRoute;