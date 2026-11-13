import axios from 'axios';
import { backendBaseUrl, backendConfigurationError } from './backendUrl';

// Create axios instance
const api = axios.create({
  baseURL: backendBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicAuthPaths = new Set(['/api/login', '/api/auth/admin/login']);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (backendConfigurationError) {
      return Promise.reject(new Error(backendConfigurationError));
    }
    const token = localStorage.getItem('token');
    const requestPath = config.url?.split('?')[0];
    if (token && !publicAuthPaths.has(requestPath)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
