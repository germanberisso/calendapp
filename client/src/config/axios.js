import axios from 'axios';

// Configure base URL based on environment
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
