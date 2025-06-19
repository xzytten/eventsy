import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { getAllOrders, getOrderDetailsForAdmin } from '@/services/cartService';
import { toast } from 'react-hot-toast';
import { type EventType } from '@/types/services';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import OrderDetailsModal from '@/components/OrderDetailsModal/OrderDetailsModal';


interface IOrder {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    eventType: EventType;
    eventDate: string; 
    generalDescription?: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'closed';
    createdAt: string; 

    venues?: Array<any>;
    food?: Array<any>;
    animators?: Array<any>;
    vehicles?: Array<any>;
    music?: Array<any>;
    beverages?: Array<any>;
    photographers?: Array<any>;
}

const AdminPanelPage: FC = () => {
    const { user, isInitializing } = useUserStore();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);

    useEffect(() => {

        if (!isInitializing) {
            const fetchOrders = async () => {
                try {
                    setIsLoadingOrders(true);
                    setError(null);
                    const data = await getAllOrders();
                    setOrders(data);
                } catch (err) {
                    console.error('Failed to fetch all orders:', err);
                    const errorMessage = err instanceof Error ? err.message : 'Не вдалося завантажити список замовлень';
                    setError(errorMessage);
                    toast.error(errorMessage);
                } finally {
                    setIsLoadingOrders(false);
                }
            };
            fetchOrders();
        }

    }, [isInitializing, user]); 

    const handleOrderClick = async (orderId: string) => {
        try {
            setIsLoadingOrderDetails(true);
            const orderDetails = await getOrderDetailsForAdmin(orderId);
            setSelectedOrder(orderDetails);
            setIsOrderModalOpen(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Помилка завантаження деталей замовлення');
        } finally {
            setIsLoadingOrderDetails(false);
        }
    };

    const closeOrderModal = () => {
        setIsOrderModalOpen(false);
        setSelectedOrder(null);
    };

    const handleOrderUpdate = (updatedOrder: any) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
        
        if (selectedOrder && selectedOrder._id === updatedOrder._id) {
            setSelectedOrder(updatedOrder);
        }
    };

    if (isInitializing) {
        return <div className="flex justify-center items-center min-h-screen text-white">Завантаження...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-red-500 text-center">
                <h1 className="text-3xl font-bold mb-6">Помилка завантаження замовлень</h1>
                <p>Помилка: {error}</p>
            </div>
        );
    }


    if (isLoadingOrders) {
        return <div className="flex justify-center items-center min-h-screen text-white">Завантаження списку замовлень...</div>;
    }

    return (
        <div className="container mx-auto p-4 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">Панель адміністратора - Список замовлень</h1>

            {orders.length === 0 ? (
                <div className="text-center text-muted">Немає жодного замовлення в системі.</div>
            ) : (
                <div className="overflow-x-auto bg-black-30 rounded-xl p-4">
                    <table className="min-w-full divide-y divide-black-50">
                        <thead>
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">ID Замовлення</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Користувач</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Тема</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Дата заходу</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Сума</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Статус</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Оформлено</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black-50">
                            {orders.map((order) => (
                                <tr 
                                    key={order._id} 
                                    className="hover:bg-black-40 cursor-pointer transition-colors"
                                    onClick={() => handleOrderClick(order._id)}
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{order._id.slice(-6)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted">{order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted">{EVENT_TYPE_NAMES[order.eventType] || order.eventType}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted">{new Date(order.eventDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{order.totalPrice} ₴</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status === 'pending' && 'Очікується підтвердження'}
                                            {order.status === 'confirmed' && 'Підтверджено'}
                                            {order.status === 'rejected' && 'Відхилено'}
                                            {order.status === 'closed' && 'Закрито'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    isOpen={isOrderModalOpen}
                    onClose={closeOrderModal}
                    order={selectedOrder}
                    onOrderUpdate={handleOrderUpdate}
                />
            )}

            {isLoadingOrderDetails && (
                <div className="fixed inset-0 bg-black-30 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-mainbg rounded-lg p-6">
                        <div className="text-white">Завантаження деталей замовлення...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanelPage; 