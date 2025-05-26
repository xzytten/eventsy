import { API_URL } from '@/config';

interface User {
    _id: string;
    email: string;
    name: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

class AuthService {
    private static instance: AuthService;
    private token: string | null = null;

    private constructor() {
        this.token = localStorage.getItem('token');
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public getToken(): string | null {
        return this.token;
    }

    public setToken(token: string): void {
        this.token = token;
        localStorage.setItem('token', token);
        console.log('AuthService: Token set in localStorage', token);
    }

    public removeToken(): void {
        console.log('AuthService: Removing token from localStorage');
        this.token = null;
        localStorage.removeItem('token');
        console.log('AuthService: Token removed');
    }

    public logout(): void {
        this.removeToken();
    }

    public async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data;
    }

    public async register(email: string, password: string, name: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data;
    }

    public async verifyToken(token: string): Promise<{ user: User | null }> {
        try {
            console.log('Sending verify token request to:', `${API_URL}/auth/verify`);
            const response = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Verify token response status:', response.status);

            if (!response.ok) {
                console.log('Verify token failed with status:', response.status);
                if (response.status === 401) {
                    console.log('Token is invalid (401 Unauthorized)');
                }
                return { user: null };
            }

            const data = await response.json();
            console.log('Verify token response data:', data);

            if (data && data.user) {
                console.log('Token is valid, received user data.');
                return { user: data.user };
            } else {
                console.log('Token valid, but no user data received.');
                return { user: null };
            }

        } catch (error) {
            console.error('Token verification error:', error);
            return { user: null };
        }
    }
}

export { AuthService, type User, type AuthResponse }; 