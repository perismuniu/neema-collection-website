import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, setUser } from '../redux/slices';
import api from './utils/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const validateToken = async () => {
      if (token && !user) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/verify-token');
          dispatch(setUser(response.data.user));
        } catch (error) {
          dispatch(setCredentials(null));
          dispatch(setUser(null));
        }
      }
    };
    validateToken();
  }, [dispatch, token, user]);

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;