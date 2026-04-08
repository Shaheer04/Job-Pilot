import axios from 'axios';

const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});
    

// Request interceptor: attaches JWT token if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
     if (token) {
      config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
});

// Response interceptor: handles common errors like 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is likely expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            
            // Redirect to login if we're not already there
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);
   
export default api;