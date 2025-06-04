import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartItemComponent from './CartItemComponent';
import useFoodStore from '@/store/foodStore';
import { type IFood } from '@/types/food';
import { type CartItem } from '@/types/cart';
import FoodDetailsModal from '@/components/Food/FoodDetailsModal';
import { type FullServiceDetails } from './CartItemComponent';


interface DetailedFoodCartItem extends CartItem {
    fullDetails?: IFood;
}

const FoodTab: FC = () => {
    const {
        food: availableFood,
        selectedFoodIds,
        loadFood,
    } = useFoodStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFoodForDetails, setSelectedFoodForDetails] = useState<IFood | null>(null);

    useEffect(() => {
        if (availableFood.length === 0) {
            loadFood();
        }
    }, [availableFood.length, loadFood]);

    const selectedFoodItems = availableFood.filter(food => selectedFoodIds.includes(food._id ?? ''));

    const detailedFoodItems: DetailedFoodCartItem[] = selectedFoodItems.map((food) => ({
        id: food._id ?? '',
        title: food.name || food.type || 'Їжа',
        category: 'food',
        price: food.price || food.totalPrice,
        image: food.images?.[0] || '/placeholder-food.jpg',
        eventTypes: food.eventTypes || [],
        quantity: 1,
        duration: '1 день',
        location: 'Київ',
        paymentType: 'full',
        description: food.description || '',
        fullDetails: food
    }));

    const handleDetailsClick = (item: CartItem, fullDetails?: FullServiceDetails) => {
        if (fullDetails && 'items' in fullDetails) {
            setSelectedFoodForDetails(fullDetails as IFood);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFoodForDetails(null);
    };

    return (
        <motion.div
            key="food"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-2xl font-semibold mb-6">Ваші вибрані страви</h1>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {detailedFoodItems.map((item) => (
                        <CartItemComponent
                            key={item.id}
                            item={item}
                            fullDetails={item.fullDetails}
                            onDetailsClick={handleDetailsClick}
                        />
                    ))}
                </AnimatePresence>

                {detailedFoodItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 p-8"
                    >
                        Немає вибраних страв.
                    </motion.div>
                )}
            </div>

            <FoodDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                food={selectedFoodForDetails}
            />
        </motion.div>
    );
};

export default FoodTab; 