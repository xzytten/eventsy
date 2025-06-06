import type { FC } from 'react';
import { useUserStore } from '@/store/userStore';
import {
    Image,
    Users,
    Settings,
    MessageCircle,
    UserCircle,
    ShoppingCart,
    ListOrdered,
    Shield
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavOutlinedButton from '../NavOutlinedButton/NavOutlinedButton';

const Header: FC = () => {
    const { user, isAuthenticated } = useUserStore();
    const location = useLocation();
    
    const isAdmin = isAuthenticated && user?.role === 'admin';

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

                        <NavOutlinedButton to="/step-order" icon={<ListOrdered size={18} />}>
                            Оформити замовлення
                        </NavOutlinedButton>
                    </div>
                    <div className="flex items-center space-x-4 text-text-milk text-lg">
                        <NavOutlinedButton to="/cart" icon={<ShoppingCart size={18} />}>
                            Кошик
                        </NavOutlinedButton>
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                     <NavOutlinedButton to="/admin" icon={<Shield size={18} />}>
                                        Всі замовлення
                                    </NavOutlinedButton>
                                )}

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