// src/services/apiService.ts
import axios from 'axios';
import { Configuration, HandlersApi } from './generated';

const BASE_PATH = import.meta.env.VITE_API_URL || 'http://localhost:3000';


const axiosInstance = axios.create();

const apiConfig = new Configuration({ basePath: BASE_PATH });
export const api = new HandlersApi(apiConfig, BASE_PATH, axiosInstance);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Access token expired. Attempting to refresh...');
        // The generated `refresh` method might not be correct for sending cookies.
        // We use a direct axios call to ensure `withCredentials` is sent.
        const { data } = await axios.post(`${BASE_PATH}/api/auth/refresh`, {}, { withCredentials: true });
        
        const newAccessToken = data.accessToken;
        localStorage.setItem('authToken', newAccessToken);
        console.log('Token refreshed successfully.');
        
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token is invalid. Logging out.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionExpiry');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);