import { type FC, useState, useEffect } from 'react';
import { X, Users, Camera, Car, Utensils, MapPin, CupSoda, Music, ChevronDown, Menu } from 'lucide-react';
import { type EventType } from '@/types/services';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import { type IVenue } from '@/types/venue';
import { type IFood } from '@/types/food';
import { type IAnimator } from '@/types/animator';
import { type IVehicle } from '@/types/vehicle';
import { type IBeverage } from '@/types/beverage';
import { type IPhotographer } from '@/types/photographer';
import { updateOrderStatus } from '@/services/cartService';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/store/userStore';

interface IOrderItem<T> {
    serviceId: T;
    clientDescription?: string;
    quantity?: number;
    hours?: number;
    paymentType?: 'full' | 'hourly';
}

interface IOrder {
    _id: string;
    eventType: EventType;
    eventDate: string;
    generalDescription?: string;
    phoneNumber?: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'closed';
    createdAt: string;
    venues?: IOrderItem<IVenue>[];
    food?: IOrderItem<IFood>[];
    animators?: IOrderItem<IAnimator>[];
    vehicles?: IOrderItem<IVehicle>[];

    music?: IOrderItem<any>[];
    beverages?: IOrderItem<IBeverage>[];
    photographers?: IOrderItem<IPhotographer>[];
}

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: IOrder;
    onOrderUpdate?: (updatedOrder: IOrder) => void;
}


const ServiceCard: FC<{ item: IOrderItem<any>; type: string }> = ({ item, type }) => {
    const service = item.serviceId;
    if (!service) return null;

    const getPrice = () => {

        if (typeof item.quantity === 'number' && item.quantity > 1) {

            if (service.totalPrice) return service.totalPrice * item.quantity;

            if (service.price) return service.price * item.quantity;
        }


        if (typeof item.hours === 'number' && item.hours > 0) {
            if (service.pricePerHour) return service.pricePerHour * item.hours;
            if (service.totalPrice) return service.totalPrice * item.hours;
        }

        if (service.pricePerDay) return service.pricePerDay;
        if (service.totalPrice) return service.totalPrice;
        if (service.price) return service.price;

        return 0;
    };

    const getImage = () => {
        if (service.images && service.images.length > 0) {
            return `http://localhost:8087${service.images[0]}`;
        }
        return '/placeholder-service.jpg';
    };

    return (
        <div className="bg-black-40 rounded-lg p-6 space-y-4">
            <div className="w-full h-auto bg-black-30 flex items-center justify-center rounded-md overflow-hidden">
                <img
                    src={getImage()}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-service.jpg'; }}
                />
            </div>

            <div>
                <h3 className="text-lg font-medium">{service.name}</h3>
                {service.description && (
                    <p className="text-muted text-sm mt-1">{service.description}</p>
                )}
            </div>

            <div className="space-y-2">
                {item.quantity && item.quantity > 1 && (
                    <p className="text-muted">Кількість: {item.quantity}</p>
                )}
                {item.hours && (
                    <p className="text-muted">Годин: {item.hours}</p>
                )}
                {item.paymentType && (
                    <p className="text-muted">
                        Тип оплати: {item.paymentType === 'hourly' ? 'Погодинно' : 'На весь день'}
                    </p>
                )}
                {item.clientDescription && (
                    <div>
                        <p className="text-muted text-sm">Додатковий опис:</p>
                        <p className="text-sm bg-black-30 p-2 rounded">{item.clientDescription}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <span className="text-xl font-medium text-coral">
                    {getPrice()} ₴
                </span>
            </div>
        </div>
    );
};

const OrderDetailsModal: FC<OrderDetailsModalProps> = ({ isOpen, onClose, order, onOrderUpdate }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const { user } = useUserStore();
    const isAdmin = user?.role === 'admin';

    const categories = [
        { key: 'venues', label: 'Локації', icon: <MapPin size={20} /> },
        { key: 'food', label: 'Їжа', icon: <Utensils size={20} /> },
        { key: 'animators', label: 'Аніматори', icon: <Users size={20} /> },
        { key: 'vehicles', label: 'Транспорт', icon: <Car size={20} /> },
        { key: 'music', label: 'Музика', icon: <Music size={20} /> },
        { key: 'beverages', label: 'Напої', icon: <CupSoda size={20} /> },
        { key: 'photographers', label: 'Фотографи', icon: <Camera size={20} /> },
    ].filter(cat => {
        const value = order[cat.key as keyof IOrder];
        return Array.isArray(value) && value.length > 0;
    });

    const statusOptions = [
        { value: 'pending', label: 'Очікується підтвердження', color: 'bg-yellow-500 text-yellow-900' },
        { value: 'confirmed', label: 'Підтверджено', color: 'bg-green-500 text-green-900' },
        { value: 'rejected', label: 'Відхилено', color: 'bg-red-500 text-red-900' },
        { value: 'closed', label: 'Закрито', color: 'bg-gray-500 text-gray-900' },
    ];

    const currentStatus = statusOptions.find(option => option.value === order.status);

    const handleStatusUpdate = async (newStatus: 'pending' | 'confirmed' | 'rejected' | 'closed') => {
        if (!isAdmin) return;

        const updatedOrder = { ...order, status: newStatus };
        if (onOrderUpdate) {
            onOrderUpdate(updatedOrder);
        }

        setIsStatusDropdownOpen(false);

        try {
            await updateOrderStatus(order._id, newStatus);
        } catch (error) {
            console.error('Error updating order status:', error);
            if (onOrderUpdate) {
                onOrderUpdate(order);
            }
            toast.error('Помилка оновлення статусу замовлення');
        }
    };

    useEffect(() => {
        if (isOpen && activeCategory === null && categories.length > 0) {
            setActiveCategory(categories[0].key);
        }
    }, [isOpen, categories, activeCategory]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.status-dropdown')) {
                setIsStatusDropdownOpen(false);
            }
        };

        if (isStatusDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isStatusDropdownOpen]);

    if (!isOpen) return null;

    const activeItems = activeCategory ? order[activeCategory as keyof IOrder] as IOrderItem<any>[] : [];

    return (
        <div className="fixed inset-0 bg-black-30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-mainbg rounded-xl p-6 max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Деталі замовлення #{order._id.slice(-6)}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black-40 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-black-40 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-muted">Тема заходу</p>
                            <p className="font-medium">{EVENT_TYPE_NAMES[order.eventType] || order.eventType}</p>
                        </div>
                        <div>
                            <p className="text-muted">Дата заходу</p>
                            <p className="font-medium">{new Date(order.eventDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-muted">Статус</p>
                            {isAdmin ? (
                                <div className="relative status-dropdown">
                                    <button
                                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentStatus?.color || 'bg-gray-500 text-gray-900'} hover:opacity-80 transition-opacity`}
                                    >
                                        <span>{currentStatus?.label || order.status}</span>
                                        <ChevronDown size={16} className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isStatusDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 bg-mainbg border border-black-50 rounded-lg shadow-lg z-10 min-w-48">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleStatusUpdate(option.value as 'pending' | 'confirmed' | 'rejected' | 'closed')}
                                                    disabled={option.value === order.status}
                                                    className={`w-full text-left px-4 py-2 hover:bg-black-40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                        option.value === order.status ? 'bg-black-40' : ''
                                                    }`}
                                                >
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                                                        {option.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatus?.color || 'bg-gray-500 text-gray-900'}`}>
                                    {currentStatus?.label || order.status}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-muted">Загальна сума</p>
                            <p className="font-medium text-coral">{order.totalPrice} ₴</p>
                        </div>
                    </div>
                    {order.phoneNumber && (
                        <div className="mt-4">
                            <p className="text-muted">Номер телефону</p>
                            <p className="font-medium">{order.phoneNumber}</p>
                        </div>
                    )}
                    {order.generalDescription && (
                        <div className="mt-4">
                            <p className="text-muted">Загальний опис</p>
                            <p className="font-medium">{order.generalDescription}</p>
                        </div>
                    )}
                </div>

                {categories.length > 0 ? (
                    <div className="flex flex-1 overflow-hidden gap-6">
                        <div className="w-64 shrink-0 hidden lg:block">
                            <div className="bg-black-30 rounded-xl p-4 space-y-2">
                                <h3 className="text-lg font-semibold mb-4">Послуги</h3>
                                {categories.map(cat => (
                                    <button
                                        key={cat.key}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeCategory === cat.key
                                                ? 'bg-coral text-white'
                                                : 'bg-black-40 text-muted hover:bg-white/5'
                                            }`}
                                        onClick={() => setActiveCategory(cat.key)}
                                    >
                                        {cat.icon}
                                        <span>{cat.label}</span>
                                        <span className="ml-auto text-sm">
                                            {(order[cat.key as keyof IOrder] as IOrderItem<any>[])?.length || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="lg:hidden flex flex-col">
                            <button
                                className="mb-4 text-white self-start"
                                onClick={() => setOpenMenu(true)}
                                aria-label="Відкрити меню категорій"
                            >
                                <Menu size={32} />
                            </button>
                            {openMenu && (
                                <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
                                    <button
                                        className="absolute top-6 right-6 text-white"
                                        onClick={() => setOpenMenu(false)}
                                        aria-label="Закрити меню категорій"
                                    >
                                        <X size={36} />
                                    </button>
                                    <div className="w-11/12 max-w-xs bg-black-30 rounded-xl p-6 space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Послуги</h3>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.key}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeCategory === cat.key
                                                    ? 'bg-coral text-white'
                                                    : 'bg-black-40 text-muted hover:bg-white/5'
                                                }`}
                                                onClick={() => {
                                                    setActiveCategory(cat.key);
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                {cat.icon}
                                                <span>{cat.label}</span>
                                                <span className="ml-auto text-sm">
                                                    {(order[cat.key as keyof IOrder] as IOrderItem<any>[])?.length || 0}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">
                                    {categories.find(cat => cat.key === activeCategory)?.label}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeItems.map((item, index) => (
                                        <ServiceCard
                                            key={index}
                                            item={item}
                                            type={activeCategory || ''}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted">Немає детальної інформації про послуги для цього замовлення.</div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsModal; 