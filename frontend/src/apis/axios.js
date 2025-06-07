// src/api/axios.js
import axios from "axios";

const baseURL = "https://f-pqkn-yash-s-projects-13e9157c.vercel.app";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    if (error.code === "ECONNABORTED") {
      // Retry once with longer timeout
      console.log("Request timed out, retrying...");
      return axiosInstance({
        ...error.config,
        timeout: 15000, // 15 seconds for retry
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;