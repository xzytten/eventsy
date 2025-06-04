import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import HomePage from '@/pages/Home/HomePage';
import NotFound from '@/pages/NotFound/NotFound';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PortfolioPage from '@/pages/Portfolio/PortfolioPage';
import AboutPage from '@/pages/About/AboutPage';
import ServicesPage from '@/pages/Services/ServicesPage';
import ChatPage from '@/pages/Chat/ChatPage';
import CabinetPage from '@/pages/Cabinet/CabinetPage';
import OrdersHistoryPage from '@/pages/OrdersHistory/OrdersHistoryPage';
import CartPage from '@/pages/Cart/CartPage';
import OrderSuccessPage from '@/pages/OrderSuccess/OrderSuccessPage';
import StepOrderPage from '@/pages/StepOrder/StepOrderPage';
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
                        path: 'step-order',
                        element: <StepOrderPage />
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
                        element: <CartPage />
                    },
                    {
                        path: 'order-success',
                        element: (
                            <ProtectedRoute>
                                <OrderSuccessPage />
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