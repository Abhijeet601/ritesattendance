import axios from 'axios';

const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const fallbackBackendUrl =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8001';
const backendBaseUrl = (configuredBackendUrl || fallbackBackendUrl).replace(/\/+$/, '');

const plantApi = axios.create({
  baseURL: backendBaseUrl,
});

plantApi.interceptors.request.use((config) => {
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
