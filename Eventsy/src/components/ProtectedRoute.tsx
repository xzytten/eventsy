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

    if (isInitializing) {
        return null;
    }

    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (requiredRole && (!isAuthenticated || user?.role !== requiredRole)) {
        return <Navigate to="/" replace />;
    }

    if (isAuthenticated && location.pathname.startsWith('/auth') && requireAuth && !requiredRole) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 
