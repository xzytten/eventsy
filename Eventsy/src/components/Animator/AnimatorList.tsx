import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatorStore } from '@/store/animatorStore';
import { AnimatorCard } from './AnimatorCard';
import type { IAnimator } from '@/types/animator';
import AnimatorDetailsModal from './AnimatorDetailsModal';
import { type EventType } from '@/constants/types';

interface AnimatorListProps {
  selectedEventTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  isHourly?: boolean;
  onMaxPriceChange?: (max: number) => void;
  showSelectButton?: boolean;
}

export const AnimatorList: FC<AnimatorListProps> = ({ 
  selectedEventTypes = [], 
  priceRange, 
  isHourly = false,
  onMaxPriceChange,
  showSelectButton = false
}) => {
  const { 
    animators: availableAnimators, 
    isLoading, 
    error, 
    loadAnimators,
    selectAnimator
  } = useAnimatorStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimatorForDetails, setSelectedAnimatorForDetails] = useState<IAnimator | null>(null);

  useEffect(() => {
    if (availableAnimators.length === 0 && !isLoading) {
      loadAnimators();
    }
  }, [availableAnimators.length, isLoading, loadAnimators]);

  useEffect(() => {
    const max = availableAnimators.reduce((acc: number, animator: IAnimator) => {
      const price = isHourly ? (animator.pricePerHour ?? 0) : (animator.pricePerDay ?? 0);
      return price > acc ? price : acc;
    }, 0);
    onMaxPriceChange?.(max);
  }, [availableAnimators, isHourly, onMaxPriceChange]);

  const handleDetailsClick = (animator: IAnimator) => {
    setSelectedAnimatorForDetails(animator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnimatorForDetails(null);
  };

  // Фільтрація аніматорів за вибраними критеріями
  const filteredAnimators = availableAnimators.filter((animator: IAnimator) => {
    // Фільтр за типом події
    if (selectedEventTypes?.length > 0) {
      const hasMatchingEventType = animator.eventTypes?.some((type) => 
        selectedEventTypes.includes(type as EventType)
      );
      if (!hasMatchingEventType) return false;
    }

    // Фільтр за ціною
    if (priceRange) {
      const price = isHourly ? (animator.pricePerHour ?? 0) : (animator.pricePerDay ?? 0);
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

  if (!Array.isArray(filteredAnimators) || filteredAnimators.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Аніматорів не знайдено
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
          {filteredAnimators.map((animator: IAnimator) => (
            <motion.div
              key={animator._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <AnimatorCard 
                animator={animator} 
                onDetailsClick={handleDetailsClick}
                onSelect={selectAnimator}
                showSelectButton={showSelectButton}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatorDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        animator={selectedAnimatorForDetails}
      />
    </>
  );
}; 