import type { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
    const { isAuthenticated, isInitializing } = useUserStore();
    const location = useLocation();

    // Показуємо екран завантаження, поки стор ініціалізується
    if (isInitializing) {
         // TODO: Можливо, тут потрібен компонент завантаження замість null
        return null;
    }

    // Якщо потрібна автентифікація і користувач не авторизований
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Якщо користувач авторизований і намагається зайти на сторінки auth
    if (isAuthenticated && location.pathname.startsWith('/auth')) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
}; 