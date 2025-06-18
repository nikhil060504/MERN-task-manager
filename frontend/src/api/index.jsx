// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
// });
// export default api;

// components/api.js

import axios from "axios";
import store from "../redux/store";
import { LOGOUT } from "../redux/actions/actionTypes";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://mern-task-manager-yf33.onrender.com/api" // full URL to backend
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // Add debug logging
    console.log("[API Request] Config:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenValue: token ? `${token.substr(0, 10)}...` : "none",
    });
    // Only set Authorization if token is valid and not 'null'
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Add debug logging
    console.error("[API Response Error]", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      // Clear invalid token and dispatch logout
      localStorage.removeItem("token");
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(error);
  }
);

export default api;
