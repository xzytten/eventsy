import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { getAllOrders } from '@/services/cartService';
import { toast } from 'react-hot-toast';
import { type EventType } from '@/types/services';
import { EVENT_TYPE_NAMES } from '@/constants/types';

// Тип для даних замовлення, що приходять з бекенду (з populated user та service details)
interface IOrder {
    _id: string;
    user: { // Populated user data
        _id: string;
        name: string;
        email: string;
    };
    eventType: EventType;
    eventDate: string; // Will receive as string
    generalDescription?: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'closed';
    createdAt: string; // Order creation date
    // Include other populated service arrays if needed for display later
    venues?: Array<any>; // Simplified for now, can be IOrderItem<IVenue>[]
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

    useEffect(() => {
        // Only fetch orders if the user store is initialized
        // ProtectedRoute ensures user is authenticated and admin, but we check isInitializing here
        if (!isInitializing) {
            const fetchOrders = async () => {
                try {
                    setIsLoadingOrders(true);
                    setError(null);
                    const data = await getAllOrders();
                    setOrders(data);
                } catch (err) {
                    console.error('Failed to fetch all orders:', err);
                    // Handle 403 Forbidden specifically if the user somehow bypasses ProtectedRoute (unlikely but good practice)
                    const errorMessage = err instanceof Error ? err.message : 'Не вдалося завантажити список замовлень';
                    setError(errorMessage);
                    toast.error(errorMessage);
                } finally {
                    setIsLoadingOrders(false);
                }
            };
            fetchOrders();
        }
        // Note: Redirection for non-admin is handled by ProtectedRoute

    }, [isInitializing, user]); // Depend on isInitializing and user (though user change here should not happen if ProtectedRoute works)

    // We can show a simple loading state while ProtectedRoute determines access
    if (isInitializing) {
         return <div className="flex justify-center items-center min-h-screen text-white">Завантаження...</div>;
    }

    // ProtectedRoute handles non-admin, so if we reach here, user is admin (or null if initial check fails)
    // Display error if fetching orders failed
    if (error) {
        return (
             <div className="container mx-auto p-4 text-red-500 text-center">
                <h1 className="text-3xl font-bold mb-6">Помилка завантаження замовлень</h1>
                <p>Помилка: {error}</p>
            </div>
        );
    }

     // Display loading state while orders are being fetched
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
                                {/* Add more headers if needed */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black-50">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{order._id.slice(-6)}</td> {/* Last 6 chars */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted">{order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})</td> {/* Display user name and email */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted">{EVENT_TYPE_NAMES[order.eventType] || order.eventType}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted">{new Date(order.eventDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{order.totalPrice} ₴</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                                    {/* Add more data cells here */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanelPage; 