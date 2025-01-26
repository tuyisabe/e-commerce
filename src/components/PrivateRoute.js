import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isAdmin } = useSelector((state) => state.auth);

  if (!user) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    toast.error('Access denied. Admin privileges required.');
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
