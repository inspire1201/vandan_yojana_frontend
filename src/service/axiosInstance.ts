import axios from "axios";
import { store } from '../store/store';
// import { logout } from '../store/authSlice';
// import toast from "react-hot-toast";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const API_BASE_URL = "/api" ;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;        