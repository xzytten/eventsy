import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import { useServiceStore } from '@/store/serviceStore';
import { useUserStore } from '@/store/userStore';
import { toast } from 'react-hot-toast';
import { type EventType } from '@/types/services';
import CustomDatePicker from '@/components/DataPicker/CustomDatePicker';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import { submitOrder } from '@/utils/orderUtils';

const CheckoutTab: FC = () => {
    const {
        generalDescription,
        updateGeneralDescription,
        getTotalPrice,
        eventType,
        venue,
        eventDate,
        setEventDate
    } = useServiceStore();
    const { isAuthenticated } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const digitsOnly = e.target.value.replace(/\D/g, '');
        setPhoneNumber(digitsOnly.slice(0, 9)); 
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Будь ласка, увійдіть в систему для оформлення замовлення');
            return;
        }

        if (!eventDate) {
            toast.error('Будь ласка, виберіть дату заходу');
            return;
        }

        try {
            setIsSubmitting(true);
            const totalPrice = getTotalPrice();
            const fullPhoneNumber = `+380${phoneNumber}`;
            await submitOrder(totalPrice, fullPhoneNumber);
            
            localStorage.removeItem('active_step');
            localStorage.removeItem('animator-storage');
            localStorage.removeItem('eventsy_event_type');
            localStorage.removeItem('food-storage');
            localStorage.removeItem('vehicle-storage');
            localStorage.removeItem('venue-storage');
            localStorage.removeItem('beverage-storage');
            localStorage.removeItem('photographer-storage');
            localStorage.removeItem('eventsy_event_date');
            localStorage.removeItem('eventsy_general_description');
            localStorage.removeItem('cart-description');
            localStorage.removeItem('event-date');

            sessionStorage.setItem('fromCheckout', 'true');

            toast.success('Замовлення успішно оформлено!');
            console.log('Redirecting to /order-success');
            window.location.href = '/order-success';
        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error(error instanceof Error ? error.message : 'Помилка при оформленні замовлення');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            key="checkout-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-black-30 rounded-xl p-4 space-y-4"
        >
            <h1 className="text-2xl font-semibold mb-6 text-center">Оформлення замовлення</h1>

            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-lg font-medium">Тема:</p>
                    <p className="font-semibold text-xl text-coral">
                        {eventType ? EVENT_TYPE_NAMES[eventType] : 'Не вибрано'}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-lg font-medium">Дата заходу:</p>
                    <CustomDatePicker
                        value={eventDate}
                        onChange={setEventDate}
                        minDate={minDate}
                        placeholder="Виберіть дату"
                    />
                </div>
                <div className="flex items-center">
                    <span className="px-3 py-2 text-xm text-text-milk rounded-l-md select-none">
                        +380
                    </span>
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="__ ___ __ __"
                        maxLength={9}
                        pattern="[0-9]{9}"
                        required
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-coral focus:border-coral"
                    />
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-medium">Всього:</p>
                    <p className="text-2xl font-semibold text-coral">{getTotalPrice()} ₴</p>
                </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-2">
                <label htmlFor="general-description" className="text-lg font-medium">
                    Загальний опис до замовлення (необов'язково):
                </label>
                <textarea
                    id="general-description"
                    className="w-full p-3 rounded-lg bg-black-40 text-white placeholder-muted resize-none border border-black-50 focus:border-coral focus:outline-none"
                    rows={3}
                    placeholder="Додати загальний опис або особливі побажання до всього замовлення"
                    value={generalDescription || ''}
                    onChange={(e) => updateGeneralDescription(e.target.value)}
                />
            </div>

            <button
                onClick={handleCheckout}
                disabled={!eventDate || isSubmitting}
                className="w-full bg-coral text-white py-3 rounded-lg text-lg font-medium hover:bg-coral/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Обробка замовлення...' : 'Оформити замовлення'}
            </button>
        </motion.div>
    );
};

export default CheckoutTab; 