import type { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requiredRole?: 'user' | 'admin';
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requireAuth = true, requiredRole }) => {
    const { user, isAuthenticated, isInitializing } = useUserStore();
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

    // Якщо потрібна конкретна роль і користувач не має цієї ролі
    if (requiredRole && (!isAuthenticated || user?.role !== requiredRole)) {
        // Redirect, можливо, на сторінку 403 Forbidden або головну
        // TODO: Додати сторінку 403
        return <Navigate to="/" replace />;
    }

    // Якщо користувач авторизований і намагається зайти на сторінки auth (тільки якщо requireAuth === false або requiredRole не вказано)
    // Ця умова має бути після перевірки requiredRole
    if (isAuthenticated && location.pathname.startsWith('/auth') && requireAuth && !requiredRole) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 
