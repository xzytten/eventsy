import type { FC } from 'react';
import {
    User2,
    CalendarDays,
    Mail,
    LogOut,
    BookText,
} from 'lucide-react';
import OutlinedButton from '@/components/OutlinedButton/OutlinedButton';
import InfoField from '@/components/InfoField/InfoField';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const CabinetPage: FC = () => {

    const user = useUserStore((state) => state.user)
    const logout = useUserStore((state) => state.logout)
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto h-full px-4 py-10 space-y-10">
            {/* Персональні дані */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Персональні дані</h2>
                <div className="bg-black-30 rounded-xl p-6 grid gap-4 text-sm md:text-base">
                    <InfoField
                        icon={<User2 size={18} color='var(--color-blue-gray)' />}
                        label="Ім'я"
                        value={user?.name || ''}
                    />
                    <InfoField
                        icon={<CalendarDays size={18} color='var(--color-blue-gray)' />}
                        label="Дата реєстрації"
                        value={
                            user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('uk-UA', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })
                                : ''
                        }
                    />
                    <InfoField
                        icon={<Mail size={18} color='var(--color-blue-gray)' />}
                        label="Пошта"
                        value={user?.email || ''}

                    />
                </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-between gap-4 flex-col sm:flex-row ">
                <OutlinedButton
                    icon={<BookText size={18} className="text-emerald-400" />}
                    className="border-emerald-400 text-emerald-300 hover:bg-emerald-900/20 hover:text-emerald-200 hover:border-emerald-300"
                    onClick={() => navigate('/orders-history')}
                >
                    Історія замовлень
                </OutlinedButton>
                <OutlinedButton
                    icon={<LogOut size={18} className="text-red-400" />}
                    className="border-red-400 text-red-300 hover:bg-red-900/20 hover:text-red-200 hover:border-red-300"
                    onClick={logout}
                >
                    Вийти з аккаунту
                </OutlinedButton>
            </div>
        </div>
    );
};

export default CabinetPage;
