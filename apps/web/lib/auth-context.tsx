'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, login as apiLogin, logout as apiLogout } from './api';

interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const userData = await getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed', error);
            localStorage.removeItem('access_token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: any) => {
        const response = await apiLogin(data);
        setUser(response.user);

        const isKorean = navigator.language.startsWith('ko');
        router.push(isKorean ? '/ko' : '/en');
    };

    const logout = () => {
        apiLogout();
        setUser(null);
        const isKorean = navigator.language.startsWith('ko');
        router.push(isKorean ? '/ko/auth/login' : '/en/auth/login');
    };

    const hasRole = (roles: string[]) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
