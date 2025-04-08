// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
// });
// export default api;



// components/api.js

import axios from 'axios';
import store from '../redux/store';

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  config => {
    const token = store.getState().authReducer.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
