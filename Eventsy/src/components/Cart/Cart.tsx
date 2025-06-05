import { type FC } from 'react';
import { X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import useFoodStore from '@/store/foodStore';
import { useServiceStore } from '@/store/serviceStore';
import { type ServiceCategory } from '@/types/services';
import { type EventType } from '@/types/services';

const eventTypeLabels: Record<EventType, string> = {
    WEDDING: 'Весілля',
    BIRTHDAY: 'День народження',
    CORPORATE: 'Корпоратив',
    CONFERENCE: 'Конференція',
    GRADUATION: 'Випускний',
    BAPTISM: 'Хрестини',
    ANNIVERSARY: 'Ювілей',
    BANQUET: 'Банкет',
    BUFFET: 'Фуршет',
    ANY_EVENT: 'Будь-який захід'
};

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

const Cart: FC<CartProps> = ({ isOpen, onClose }) => {
    const { items: cartItems, getTotalPrice } = useCartStore();
    const { updateFoodDescription } = useFoodStore();
    const { eventType } = useServiceStore();
    console.log("eventType", eventType)
    console.log('eventType')
    const handleUpdateClientDescription = (id: string, description: string, category: ServiceCategory) => {
        switch (category) {
            case 'food':
                updateFoodDescription(id, description);
                break;
            default:
                console.warn(`No specific description update function for category: ${category}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#181820] z-50 flex items-center justify-center">
            <div className="w-full max-w-3xl mx-auto px-4">
                <div className="rounded-xl flex flex-col max-h-[80vh]">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Кошик</h2>
                            {eventType && (
                                <p className="text-muted mt-1">
                                    Тема: <span className="text-coral">{eventTypeLabels[eventType]}</span>
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6 border-t border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl">Всього:</span>
                            <span className="text-2xl font-semibold text-coral">
                                {getTotalPrice()} ₴
                            </span>
                        </div>
                        <button
                            className="w-full bg-coral text-white py-4 rounded-lg text-lg font-medium hover:bg-coral/90 transition-colors"
                            disabled={cartItems.length === 0}
                        >
                            Оформити замовлення
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 