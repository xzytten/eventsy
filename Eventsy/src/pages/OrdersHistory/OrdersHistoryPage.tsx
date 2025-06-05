import { type FC, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OutlinedButton from '@/components/OutlinedButton/OutlinedButton';
import { useUserStore } from '@/store/userStore';
import { getUserOrders, getOrderDetails } from '@/services/cartService';
import { toast } from 'react-hot-toast';
import { type EventType } from '@/types/services';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import OrderDetailsModal from '@/components/OrderDetailsModal/OrderDetailsModal';

// Тип для даних замовлення, що приходять з бекенду (спрощений)
interface IOrder {
    _id: string;
    eventType: EventType;
    eventDate: string;
    generalDescription?: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'closed';
    createdAt: string;
    venues?: Array<{
        serviceId: any;
        clientDescription: string;
        quantity: number;
        hours?: number;
        paymentType: 'full' | 'hourly';
    }>;
    food?: Array<{
        serviceId: any;
        clientDescription: string;
        quantity: number;
    }>;
    animators?: Array<{
        serviceId: any;
        clientDescription: string;
        quantity: number;
        hours?: number;
        paymentType: 'full' | 'hourly';
    }>;
    vehicles?: Array<{
        serviceId: any;
        clientDescription: string;
        quantity: number;
        hours?: number;
        paymentType: 'full' | 'hourly';
    }>;
}

const OrdersHistoryPage: FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isInitializing: isAuthLoading } = useUserStore();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            toast.error('Будь ласка, увійдіть в систему для перегляду історії замовлень');
            navigate('/login');
            return;
        }

        if (isAuthenticated) {
            const fetchOrders = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const data = await getUserOrders();
                    setOrders(data);
                } catch (err) {
                    console.error('Failed to fetch orders:', err);
                    setError(err instanceof Error ? err.message : 'Не вдалося завантажити історію замовлень');
                    toast.error(err instanceof Error ? err.message : 'Не вдалося завантажити історію замовлень');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOrders();
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    const handleOrderClick = async (order: IOrder) => {
        try {
            setIsLoadingDetails(true);
            const orderDetails = await getOrderDetails(order._id);
            setSelectedOrder(orderDetails);
        } catch (err) {
            console.error('Failed to fetch order details:', err);
            toast.error('Не вдалося завантажити деталі замовлення');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="flex items-center gap-4 mb-10">
                    <OutlinedButton
                        icon={<ArrowLeft size={18} />}
                        onClick={() => navigate('/cabinet')}
                    >
                        Назад
                    </OutlinedButton>
                    <h1 className="text-2xl font-semibold">Історія замовлень</h1>
                </div>
                <div className="text-center text-muted">Завантаження історії замовлень...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="flex items-center gap-4 mb-10">
                    <OutlinedButton
                        icon={<ArrowLeft size={18} />}
                        onClick={() => navigate('/cabinet')}
                    >
                        Назад
                    </OutlinedButton>
                    <h1 className="text-2xl font-semibold">Історія замовлень</h1>
                </div>
                <div className="text-center text-red-500">Помилка: {error}</div>
            </div>
        );
    }

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
                {orders.length === 0 ? (
                    <div className="text-center text-muted">
                        Історія замовлень порожня
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div 
                                key={order._id} 
                                className="bg-black-40 rounded-lg p-6 border border-black-50 cursor-pointer hover:border-primary transition-colors"
                                onClick={() => handleOrderClick(order)}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Замовлення #{order._id.slice(-6)}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        order.status === 'pending' ? 'bg-yellow-500 text-yellow-900' :
                                        order.status === 'confirmed' ? 'bg-green-500 text-green-900' :
                                        order.status === 'rejected' ? 'bg-red-500 text-red-900' :
                                        'bg-gray-500 text-gray-900'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-muted">
                                    <p><strong>Тема:</strong> {EVENT_TYPE_NAMES[order.eventType as EventType] || order.eventType}</p>
                                    <p><strong>Дата заходу:</strong> {new Date(order.eventDate).toLocaleDateString()}</p>
                                    <p><strong>Сума:</strong> {order.totalPrice} ₴</p>
                                    {order.generalDescription && (
                                        <p><strong>Опис:</strong> {order.generalDescription}</p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-2">Оформлено: {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    order={selectedOrder}
                />
            )}

            {isLoadingDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-black-30 rounded-xl p-6">
                        <div className="text-center text-muted">Завантаження деталей замовлення...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersHistoryPage; 