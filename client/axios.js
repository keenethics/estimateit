import axios from 'axios';

const apiURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : window.location.origin;

const axiosInstance = axios.create({
  baseURL: apiURL,
});

export default axiosInstance;
