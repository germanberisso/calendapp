import axios from 'axios';

// Detect environment at runtime
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const baseURL = isProduction
    ? 'https://calendapp.onrender.com'  // Production backend
    : 'http://localhost:5000';           // Local backend

console.log('🔧 Axios configured for:', isProduction ? 'PRODUCTION' : 'LOCAL');
console.log('📡 Backend URL:', baseURL);

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
