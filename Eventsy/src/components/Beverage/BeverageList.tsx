import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBeverageStore from '@/store/beverageStore';
import BeverageCard from './BeverageCard';
import BeverageDetailsModal from './BeverageDetailsModal';
import type { IBeverage } from '@/types/beverage';
import { type EventType } from '@/constants/types';

interface BeverageListProps {
  selectedEventTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  onMaxPriceChange?: (max: number) => void;
  showSelectButton?: boolean;
}

export const BeverageList: FC<BeverageListProps> = ({ 
  selectedEventTypes = [], 
  priceRange, 
  onMaxPriceChange,
  showSelectButton = false
}) => {
  const { 
    beverages: availableBeverages, 
    isLoading, 
    error, 
    loadBeverages,
    selectedBeverages,
    toggleSelectedBeverage
  } = useBeverageStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBeverageForDetails, setSelectedBeverageForDetails] = useState<IBeverage | null>(null);

  useEffect(() => {
    if (!isLoading && availableBeverages.length === 0) {
      loadBeverages();
    }
  }, [isLoading, availableBeverages.length, loadBeverages]);

  useEffect(() => {
    const max = availableBeverages.reduce((acc: number, beverage: IBeverage) => {
      const price = beverage.totalPrice || 0;
      return price > acc ? price : acc;
    }, 0);
    onMaxPriceChange?.(max);
  }, [availableBeverages, onMaxPriceChange]);

  const handleDetailsClick = (beverage: IBeverage) => {
    setSelectedBeverageForDetails(beverage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBeverageForDetails(null);
  };

  const filteredBeverages = availableBeverages.filter((beverage: IBeverage) => {
    if (selectedEventTypes?.length > 0) {
      const hasMatchingEventType = beverage.eventTypes?.some((type) => 
        selectedEventTypes.includes(type as EventType) || type === 'ANY_EVENT'
      );
      if (!hasMatchingEventType) return false;
    }

    if (priceRange) {
      const price = beverage.totalPrice || 0;
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

  if (!Array.isArray(filteredBeverages) || filteredBeverages.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Напої не знайдено
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
          {filteredBeverages.map((beverage: IBeverage) => (
            <motion.div
              key={beverage.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <BeverageCard
                beverage={beverage}
                isSelected={selectedBeverages.some(item => item.name === beverage.name)}
                onDetailsClick={() => handleDetailsClick(beverage)}
                onSelect={() => toggleSelectedBeverage(beverage)}
                showSelectButton={showSelectButton}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <BeverageDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        beverage={selectedBeverageForDetails}
      />
    </>
  );
};
