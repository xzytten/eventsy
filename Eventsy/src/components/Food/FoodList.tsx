import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useFoodStore from '@/store/foodStore';
import FoodCard from './FoodCard';
import type { IFood } from '@/types/food';
import FoodDetailsModal from './FoodDetailsModal';
import { type EventType } from '@/constants/types';

interface FoodListProps {
  selectedEventTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  onMaxPriceChange?: (max: number) => void;
  showSelectButton?: boolean;
}

export const FoodList: FC<FoodListProps> = ({ 
  selectedEventTypes = [], 
  priceRange, 
  onMaxPriceChange,
  showSelectButton = false
}) => {
  const { 
    food: availableFood, 
    isLoading, 
    error, 
    loadFood,
    selectedFood,
    toggleSelectedFood
  } = useFoodStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFoodForDetails, setSelectedFoodForDetails] = useState<IFood | null>(null);

  useEffect(() => {
    if (!isLoading && availableFood.length === 0) {
      loadFood();
    }
  }, [isLoading, availableFood.length, loadFood]);

  useEffect(() => {
    const max = availableFood.reduce((acc: number, food: IFood) => {
      const price = food.price || food.totalPrice || 0;
      return price > acc ? price : acc;
    }, 0);
    onMaxPriceChange?.(max);
  }, [availableFood, onMaxPriceChange]);

  const handleDetailsClick = (food: IFood) => {
    setSelectedFoodForDetails(food);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFoodForDetails(null);
  };

  // Фільтрація їжі за вибраними критеріями
  const filteredFood = availableFood.filter((food: IFood) => {
    // Фільтр за типом події
    if (selectedEventTypes?.length > 0) {
      const hasMatchingEventType = food.eventTypes?.some((type) => 
        selectedEventTypes.includes(type as EventType)
      );
      if (!hasMatchingEventType) return false;
    }

    // Фільтр за ціною
    if (priceRange) {
      const price = food.price || food.totalPrice || 0;
      if (price < priceRange.min || price > priceRange.max) {
        return false;
      }
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!Array.isArray(filteredFood) || filteredFood.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Їжі не знайдено
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {filteredFood.map((food: IFood) => (
            <motion.div
              key={food._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <FoodCard 
                food={food} 
                isSelected={selectedFood.some(item => item._id === food._id)}
                onDetailsClick={handleDetailsClick}
                onSelect={() => toggleSelectedFood(food)}
                showSelectButton={showSelectButton}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <FoodDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        food={selectedFoodForDetails}
      />
    </>
  );
}; 