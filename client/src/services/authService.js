import axiosInstance from "./apiService.js";

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

    // 4. Forgot Password (send OTP)
    forgotPassword: async (email) => {
        const response = await axiosInstance.post('/auth/forgot-password', { email });
        return response.data;
    },
    
    // 5. Verify OTP
    verifyOTP: async (data) => {
        // data = { email, otp }
        const response = await axiosInstance.post('/auth/verify-otp', data);
        return response.data;
    },
    
    // 6. Reset Password
    resetPassword: async (data) => {
        // data = { email, newPassword }
        const response = await axiosInstance.post('/auth/reset-password', data);
        return response.data;
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
