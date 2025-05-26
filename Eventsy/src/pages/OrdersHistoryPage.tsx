import { type FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OutlinedButton from '@/components/OutlinedButton/OutlinedButton';

const OrdersHistoryPage: FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
            <div className="flex items-center gap-4">
                <OutlinedButton
                    icon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/cabinet')}
                >
                    Назад
                </OutlinedButton>
                <h1 className="text-2xl font-semibold">Історія замовлень</h1>
            </div>

            <div className="bg-black-30 rounded-xl p-6 space-y-6">
                {/* Тут буде список замовлень */}
                <div className="text-center text-muted">
                    Історія замовлень порожня
                </div>
            </div>
        </div>
    );
};

export default OrdersHistoryPage; 