import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FoodTabItem from '@/components/Food/FoodTabItem';
import useFoodStore from '@/store/foodStore';
import { type IFood } from '@/types/food';
import { type CartItem } from '@/types/cart';
import FoodDetailsModal from '@/components/Food/FoodDetailsModal';

interface DetailedFoodCartItem extends CartItem {
    fullDetails?: IFood;
}

const FoodTab: FC = () => {
    const {
        food: availableFood,
        selectedFood,
        loadFood,
        toggleSelectedFood,
        updateFoodDescription
    } = useFoodStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFoodForDetails, setSelectedFoodForDetails] = useState<IFood | null>(null);

    useEffect(() => {
        if (availableFood.length === 0) {
            loadFood();
        }
    }, [availableFood.length, loadFood]);

    const detailedFoodItems: DetailedFoodCartItem[] = selectedFood.map((food) => ({
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
        clientDescription: food.clientDescription || '',
        fullDetails: food
    }));

    const handleDetailsClick = (item: CartItem, fullDetails?: IFood) => {
        if (fullDetails) {
            setSelectedFoodForDetails(fullDetails);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFoodForDetails(null);
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        // Для їжі не потрібно оновлювати кількість
    };

    const handleRemove = (id: string) => {
        const foodToRemove = selectedFood.find(food => food._id === id);
        if (foodToRemove) {
            toggleSelectedFood(foodToRemove);
        }
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
                        <FoodTabItem
                            key={item.id}
                            item={item}
                            fullDetails={item.fullDetails}
                            onDetailsClick={handleDetailsClick}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={() => handleRemove(item.id)}
                            onUpdateClientDescription={(description) => updateFoodDescription(item.id, description)}
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