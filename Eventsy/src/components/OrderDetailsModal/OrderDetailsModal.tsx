import { type FC, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type EventType } from '@/types/services';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import { type IVenue } from '@/types/venue';
import { type IFood } from '@/types/food';
import { type IAnimator } from '@/types/animator';
import { type IVehicle } from '@/types/vehicle';
// Import other service types if needed (Music, Beverage, Photographer)

// Тип для окремого елемента послуги в замовленні (з populated serviceId)
interface IOrderItem<T> {
    serviceId: T;
    clientDescription?: string;
    quantity?: number;
    hours?: number;
    paymentType?: 'full' | 'hourly';
    // Додайте інші специфічні поля, якщо потрібно
}

// Тип для даних замовлення, що приходять з бекенду (з populated services)
interface IOrder {
    _id: string;
    eventType: EventType;
    eventDate: string;
    generalDescription?: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'closed';
    createdAt: string;
    venues?: IOrderItem<IVenue>[];
    food?: IOrderItem<IFood>[];
    animators?: IOrderItem<IAnimator>[];
    vehicles?: IOrderItem<IVehicle>[];
    // Додайте інші категорії замовлень тут
    music?: IOrderItem<any>[]; // Приклад, якщо є інші категорії без чіткого типу поки що
    beverages?: IOrderItem<any>[];
    photographers?: IOrderItem<any>[];
}

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: IOrder;
}

const OrderDetailsModal: FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
    const [activeCategory, setActiveCategory] = useState<
        | 'venues'
        | 'food'
        | 'animators'
        | 'vehicles'
        | 'music'
        | 'beverages'
        | 'photographers'
        | null
    >(null);

    // Визначаємо наявні категорії в замовленні та встановлюємо першу як активну при відкритті
    useEffect(() => {
        if (isOpen && order) {
            const categories = [
                { key: 'venues', label: 'Локації' },
                { key: 'food', label: 'Їжа' },
                { key: 'animators', label: 'Аніматори' },
                { key: 'vehicles', label: 'Транспорт' },
                { key: 'music', label: 'Музика' },
                { key: 'beverages', label: 'Напої' },
                { key: 'photographers', label: 'Фотографи' },
            ].filter(cat => order[cat.key as keyof IOrder] && order[cat.key as keyof IOrder]!.length > 0);

            if (categories.length > 0) {
                setActiveCategory(categories[0].key as any);
            } else {
                setActiveCategory(null);
            }
        }
    }, [isOpen, order]);

    if (!isOpen) return null;

    const categories = [
        { key: 'venues', label: 'Локації' },
        { key: 'food', label: 'Їжа' },
        { key: 'animators', label: 'Аніматори' },
        { key: 'vehicles', label: 'Транспорт' },
        { key: 'music', label: 'Музика' },
        { key: 'beverages', label: 'Напої' },
        { key: 'photographers', label: 'Фотографи' },
    ].filter(cat => order[cat.key as keyof IOrder] && order[cat.key as keyof IOrder]!.length > 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-black-30 rounded-xl p-6 max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Деталі замовлення #{order._id.slice(-6)}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black-40 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Основна інформація */}
                <div className="bg-black-40 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
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
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'pending' ? 'bg-yellow-500 text-yellow-900' :
                                order.status === 'confirmed' ? 'bg-green-500 text-green-900' :
                                order.status === 'rejected' ? 'bg-red-500 text-red-900' :
                                'bg-gray-500 text-gray-900'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-muted">Загальна сума</p>
                            <p className="font-medium">{order.totalPrice} ₴</p>
                        </div>
                    </div>
                    {order.generalDescription && (
                        <div className="mt-4">
                            <p className="text-muted">Загальний опис</p>
                            <p className="font-medium">{order.generalDescription}</p>
                        </div>
                    )}
                </div>

                {/* Фільтри категорій та вміст */}
                {categories.length > 0 ? (
                    <div className="flex flex-1 overflow-hidden">
                        {/* Фільтри (збоку) */}
                        <div className="flex flex-col space-y-2 pr-4 border-r border-black-50 overflow-y-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat.key}
                                    className={`px-4 py-2 rounded-lg text-left ${activeCategory === cat.key ? 'bg-primary text-black' : 'bg-black-40 text-muted hover:bg-black-50'}`}
                                    onClick={() => setActiveCategory(cat.key as any)}
                                >
                                    {/* {cat.label} ({order[cat.key as keyof IOrder]!.length}) */}
                                </button>
                            ))}
                        </div>

                        {/* Вміст обраної категорії */}
                        <div className="flex-1 pl-4 overflow-y-auto">
                            {activeCategory && (
                                <div className="space-y-4">
                                    {(order[activeCategory as keyof IOrder] as IOrderItem<any>[] | undefined)?.map((item: IOrderItem<any>, index: number) => (
                                        // Тут буде відображення картки послуги
                                        // Це спрощений приклад, і його потрібно буде адаптувати/замінити на реальні компоненти карток
                                        <div key={index} className="bg-black-40 rounded-lg p-4 border border-black-50">
                                            <h4 className="font-semibold text-lg">{item.serviceId?.name || 'Невідома послуга'}</h4>
                                            <p className="text-muted">Кількість: {item.quantity}</p>
                                            {item.paymentType && (
                                                <p className="text-muted">Тип оплати: {item.paymentType === 'hourly' ? 'Погодинна' : 'За весь день'}</p>
                                            )}
                                            {item.hours && <p className="text-muted">Годин: {item.hours}</p>}
                                            {item.clientDescription && (
                                                <p className="text-muted mt-2">Опис клієнта: {item.clientDescription}</p>
                                            )}
                                            {/* Додайте іншу відповідну інформацію з item.serviceId */}
                                        </div>
                                    ))}
                                </div>
                            )}
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