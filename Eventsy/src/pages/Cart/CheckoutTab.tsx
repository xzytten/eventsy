import { type FC } from 'react';
import { motion } from 'framer-motion';
import { useServiceStore } from '@/store/serviceStore';
import { useUserStore } from '@/store/userStore';
import { toast } from 'react-hot-toast';
import { type EventType } from '@/types/services';
import CustomDatePicker from '@/components/DataPicker/CustomDatePicker';
import { EVENT_TYPE_NAMES } from '@/constants/types';

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
    console.log("eventType", eventType);

    // Calculate minimum date (2 days from now)
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
            // TODO: Тут буде логіка відправки замовлення на сервер
            console.log('Оформлення замовлення:', {
                eventType,
                venue,
                eventDate,
                generalDescription
            });
            toast.success('Замовлення успішно оформлено (імітація)');
        } catch (error) {
            toast.error('Помилка при оформленні замовлення');
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
                className="w-full bg-coral text-white py-3 rounded-lg text-lg font-medium hover:bg-coral/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!eventDate}
            >
                Оформити замовлення
            </button>
        </motion.div>
    );
};

export default CheckoutTab; 