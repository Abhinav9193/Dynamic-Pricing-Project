import axios from 'axios';

const getBaseURL = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
        return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
    }
    return 'http://localhost:8080/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

// Always attach JWT token to every request
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401/403 by redirecting to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
