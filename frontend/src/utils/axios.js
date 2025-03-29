import axios from 'axios';

// In development, use relative URLs to leverage Vite's proxy
// In production, use the full URL from environment variables
const isDevelopment = import.meta.env.DEV;
const API_URL = isDevelopment ? '' : (import.meta.env.VITE_BASE_URL || 'https://final-uber-6.onrender.com');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Axios error:", error);
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      localStorage.removeItem('token');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 