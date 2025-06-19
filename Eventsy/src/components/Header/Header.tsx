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
    Shield,
    LayoutGrid,
    Menu,
    X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavOutlinedButton from '../NavOutlinedButton/NavOutlinedButton';
import { useState } from 'react';

const Header: FC = () => {
    const { user, isAuthenticated } = useUserStore();
    const location = useLocation();
    
    const isAdmin = isAuthenticated && user?.role === 'admin';
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <header>
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center space-x-8 text-text-milk text-lg">
                        <NavOutlinedButton to="/portfolio" icon={<Image size={18} />}>
                            Портфоліо
                        </NavOutlinedButton>
                        <NavOutlinedButton to="/about" icon={<Users size={18} />}>
                            Про нас
                        </NavOutlinedButton>
                        <NavOutlinedButton to="/services" icon={<LayoutGrid size={18} />}>
                            Послуги
                        </NavOutlinedButton>
                        <NavOutlinedButton to="/step-order" icon={<ListOrdered size={18} />}>
                            Оформити замовлення
                        </NavOutlinedButton>
                    </div>
                    {/* Mobile hamburger */}
                    <button
                        className="lg:hidden text-text-milk focus:outline-none"
                        onClick={() => setOpenMenu(!openMenu)}
                        aria-label="Відкрити меню"
                    >
                        {openMenu ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    {/* Desktop right nav */}
                    <div className="hidden lg:flex items-center space-x-4 text-text-milk text-lg">
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
                {/* Mobile menu */}
                {openMenu && (
                    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center gap-8 text-2xl text-text-milk">
                        <NavOutlinedButton to="/portfolio" icon={<Image size={22} />} onClick={() => setOpenMenu(false)}>
                            Портфоліо
                        </NavOutlinedButton>
                        <NavOutlinedButton to="/about" icon={<Users size={22} />} onClick={() => setOpenMenu(false)}>
                            Про нас
                        </NavOutlinedButton>
                        <NavOutlinedButton to="/services" icon={<LayoutGrid size={22} />} onClick={() => setOpenMenu(false)}>
                            Послуги
                        </NavOutlinedButton>
                        <NavOutlinedButton to="/step-order" icon={<ListOrdered size={22} />} onClick={() => setOpenMenu(false)}>
                            Оформити замовлення
                        </NavOutlinedButton>
                        <NavOutlinedButton to="/cart" icon={<ShoppingCart size={22} />} onClick={() => setOpenMenu(false)}>
                            Кошик
                        </NavOutlinedButton>
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <NavOutlinedButton to="/admin" icon={<Shield size={22} />} onClick={() => setOpenMenu(false)}>
                                        Всі замовлення
                                    </NavOutlinedButton>
                                )}
                                <NavOutlinedButton to="/chat" icon={<MessageCircle size={22} />} onClick={() => setOpenMenu(false)}>
                                    Чат
                                </NavOutlinedButton>
                                <NavOutlinedButton to="/cabinet" icon={<UserCircle size={22} />} onClick={() => setOpenMenu(false)}>
                                    Кабінет
                                </NavOutlinedButton>
                            </>
                        ) : (
                            <NavOutlinedButton to="/auth/login" onClick={() => setOpenMenu(false)}>Увійти</NavOutlinedButton>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header; 