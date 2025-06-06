import { create } from 'zustand';
import { AuthService } from '@/services/authService';

interface User {
    _id: string;
    email: string;
    name: string;
    role?: 'user' | 'admin';
}

interface AuthResponse {
    user: User;
    token: string;
}

interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    initializeAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitializing: true,

    setUser: (user) => set({ user }),
    setToken: (token) => set({ token, isAuthenticated: !!token }),

    login: async (email: string, password: string) => {
        try {
            const authService = AuthService.getInstance();
            const response = await authService.login(email, password);
        
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true
            });

            localStorage.setItem('token', response.token);
        } catch (error) {
            console.error('Login error in store:', error);
            throw error;
        }
    },

    register: async (email: string, password: string, name: string) => {
        try {
            const authService = AuthService.getInstance();
            await authService.register(email, password, name);
        } catch (error) {
            console.error('Register error in store:', error);
            throw error;
        }
    },

    logout: () => {
        const authService = AuthService.getInstance();
        authService.logout();
        
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });

        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    initializeAuth: async () => {
        const authService = AuthService.getInstance();
        const token = localStorage.getItem('token');
        console.log('Store init - Raw token from localStorage:', token);

        if (token) {
            console.log('Store init - Verifying token...');
            const response = await authService.verifyToken(token);
            console.log('Store init - Token verification response:', response);

            if (response.user) {
                console.log('Store init - Token valid, setting user data:', response.user);
                set({ user: response.user, token, isAuthenticated: true });
            } else {
                 console.log('Store init - Token invalid or user not found.');
                 console.log('Store init: Calling authService.removeToken() due to invalid token');
                 authService.removeToken();
                 set({ user: null, token: null, isAuthenticated: false });
            }
        }
         console.log('Store init - Initialization finished.');
        set({ isInitializing: false });
    }
}));

useUserStore.getState().initializeAuth();

export { AuthService, type User, type AuthResponse }; 