import axios from 'axios';
import {store} from '../../redux/store'

const api = axios.create({
  baseURL: 'http://localhost:3002/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    if (error.response && error.response.status === 401) {
       // Token has expired
       store.dispatch({ type: 'auth/setCredentials', payload: null });
       store.dispatch({ type: 'auth/setUser', payload: null });
      // Redirect to /auth
      window.location.href = '/auth';
    } else {
      // Handle other error statuses or allow them to bubble up
      return Promise.reject(error);
    }
  }
);


export default api;