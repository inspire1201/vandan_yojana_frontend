import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6000";
// const API_BASE_URL = "";


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, // Set the base URL once here
  headers: {
    "Content-Type": "application/json", // Set default headers if needed
  },
});

export default axiosInstance;        