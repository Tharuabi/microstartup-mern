import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-startup-uljt.onrender.com',
  withCredentials: true,
});


// Optional: Add interceptors for requests (e.g., adding token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or use context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
