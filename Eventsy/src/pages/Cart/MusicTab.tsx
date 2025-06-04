import { type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import CartItemComponent from './CartItemComponent';
import { type CartItem } from '@/types/cart';

const MusicTab: FC = () => {
    const { items: cartItems } = useCartStore();
    const musicItems = cartItems.filter(item => item.category === 'music');

    const handleDetailsClick = (item: CartItem) => {
        // Music items don't have details modal yet
        console.log('Details clicked for music item:', item);
    };

    return (
        <motion.div
            key="music"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-2xl font-semibold mb-6">Ваші вибрані музичні послуги</h1>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {musicItems.map((item) => (
                        <CartItemComponent 
                            key={item.id} 
                            item={item} 
                            onDetailsClick={handleDetailsClick}
                        />
                    ))}
                </AnimatePresence>

                {musicItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 p-8"
                    >
                        Немає вибраних музичних послуг.
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default MusicTab; 