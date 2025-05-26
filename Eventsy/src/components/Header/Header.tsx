import type { FC } from 'react';
import { useUserStore } from '@/store/userStore';
import NavItem from '../NavItem/NavItem';
import {
    Image,
    Users,
    Settings,
    MessageCircle,
    UserCircle,
    LogOut,
    LogIn
} from 'lucide-react';
import OutlinedButton from '../OutlinedButton/OutlinedButton';
import { useLocation, useNavigate } from 'react-router-dom';
import NavOutlinedButton from '../NavOutlinedButton/NavOutlinedButton';

const Header: FC = () => {
    const { isAuthenticated } = useUserStore();
    const location = useLocation();
    const isLoginPage = location.pathname === '/auth/login';
    const navigate = useNavigate();
    return (
        <header >
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8 text-text-milk text-lg">
                        <NavOutlinedButton to="/portfolio" icon={<Image size={18} />}>
                            Портфоліо
                        </NavOutlinedButton>

                        <NavOutlinedButton to="/about" icon={<Users size={18} />}>
                            Про нас
                        </NavOutlinedButton>

                        <NavOutlinedButton to="/services" icon={<Settings size={18} />}>
                            Послуги
                        </NavOutlinedButton>
                    </div>
                    <div className="flex items-center space-x-4 text-text-milk text-lg">
                        {isAuthenticated ? (
                            <>
                                <NavOutlinedButton to="/chat" icon={<MessageCircle size={18} />}>
                                    Чат
                                </NavOutlinedButton>

                                <NavOutlinedButton to="/cabinet" icon={<UserCircle size={18} />}>
                                    Кабінет
                                </NavOutlinedButton>
                            </>
                        ) : (
                            <NavOutlinedButton to="/auth/login">Увійти</NavOutlinedButton>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header; 