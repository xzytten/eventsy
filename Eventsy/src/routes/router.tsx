import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import HomePage from '@/pages/HomePage';
import NotFound from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PortfolioPage from '@/pages/PortfolioPage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ChatPage from '@/pages/ChatPage';
import CabinetPage from '@/pages/CabinetPage';
import OrdersHistoryPage from '@/pages/OrdersHistoryPage';
import CartPage from '@/pages/CartPage';
import PageLayout from '@/layouts/PageLayout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/home" replace />
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                element: <PageLayout />,
                children: [
                    {
                        path: 'home',
                        element: (
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'portfolio',
                        element: <PortfolioPage />
                    },
                    {
                        path: 'about',
                        element: <AboutPage />
                    },
                    {
                        path: 'services',
                        element: <ServicesPage />
                    },
                    {
                        path: 'chat',
                        element: (
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'cabinet',
                        element: (
                            <ProtectedRoute>
                                <CabinetPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'orders-history',
                        element: (
                            <ProtectedRoute>
                                <OrdersHistoryPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'cart',
                        element: (
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        )
                    }
                ]
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: (
                            <ProtectedRoute requireAuth={false}>
                                <LoginPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'register',
                        element: (
                            <ProtectedRoute requireAuth={false}>
                                <RegisterPage />
                            </ProtectedRoute>
                        )
                    }
                ]
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]);