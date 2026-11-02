import axios from 'axios';
import { backendBaseUrl, backendConfigurationError } from '../api/backendUrl';

const plantApi = axios.create({
  baseURL: backendBaseUrl,
});

plantApi.interceptors.request.use((config) => {
  if (backendConfigurationError) {
    return Promise.reject(new Error(backendConfigurationError));
  }
  const token = localStorage.getItem('plant_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

plantApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('plant_token');
      localStorage.removeItem('plant_user');
      if (window.location.pathname.startsWith('/plant')) {
        window.location.href = '/plant-login';
      }
    }
    return Promise.reject(error);
  },
);

export default plantApi;
