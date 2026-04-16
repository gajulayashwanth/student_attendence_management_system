import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    tokens: JSON.parse(localStorage.getItem('tokens')) || null,
    isAuthenticated: !!localStorage.getItem('tokens'),
    isLoading: false,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(credentials);
            const { tokens, user } = response.data;

            localStorage.setItem('tokens', JSON.stringify(tokens));
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                tokens,
                isAuthenticated: true,
                isLoading: false,
            });

            return user;
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed.';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    adminLogin: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.adminLogin(credentials);
            const { tokens, user } = response.data;

            localStorage.setItem('tokens', JSON.stringify(tokens));
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                tokens,
                isAuthenticated: true,
                isLoading: false,
            });

            return user;
        } catch (error) {
            const message = error.response?.data?.error || 'Invalid credentials.';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.register(data);
            const { tokens, user } = response.data;

            localStorage.setItem('tokens', JSON.stringify(tokens));
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                tokens,
                isAuthenticated: true,
                isLoading: false,
            });

            return user;
        } catch (error) {
            const message =
                error.response?.data?.email?.[0] ||
                error.response?.data?.confirm_password?.[0] ||
                error.response?.data?.password?.[0] ||
                'Registration failed.';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
        });
    },

    checkApproval: async () => {
        try {
            const response = await authService.checkApproval();
            const { is_approved, role } = response.data;

            const currentUser = get().user;
            if (currentUser) {
                const updatedUser = { ...currentUser, is_approved, role };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                set({ user: updatedUser });
            }

            return response.data;
        } catch (error) {
            return null;
        }
    },

    clearError: () => set({ error: null }),

    updateUser: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData });
    },
}));

export default useAuthStore;
