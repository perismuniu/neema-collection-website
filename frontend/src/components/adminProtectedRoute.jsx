import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;