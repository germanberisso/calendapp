import axios from 'axios';

// Since backend and frontend are on the same Vercel deployment,
// we can use relative URLs for API calls
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseURL = isLocal ? 'http://localhost:5000' : '';

console.log('🔧 Axios configured for:', isLocal ? 'LOCAL' : 'PRODUCTION (same origin)');
console.log('📡 Backend URL:', baseURL || 'Same origin (relative URLs)');

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
