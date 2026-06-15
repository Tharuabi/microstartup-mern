// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    alert('Please login first!');
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
