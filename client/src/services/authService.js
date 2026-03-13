import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create generic axios instance with interceptor to attach JWT tokens to protected routes in the future
const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    // 1. Register User
    register: async (userData) => {
        const response = await axiosInstance.post('/auth/register', userData);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // 2. Login User
    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // 3. Logout User
    logout: async () => {
        // Technically stateless, but good practice to fire request to backend if auditing/logging is implemented later
        try {
            await axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error("Logout API error", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Utilities to get current state
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;
