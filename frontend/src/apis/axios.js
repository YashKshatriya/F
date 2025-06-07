// src/api/axios.js
import axios from "axios";

const baseURL = "https://f-iota-pink.vercel.app";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 5000, // 5 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      // Retry once with longer timeout
      return axiosInstance({
        ...error.config,
        timeout: 10000, // 10 seconds for retry
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;