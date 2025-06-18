import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePhotographerStore from '@/store/photographerStore';
import type { IPhotographer } from '@/types/photographer';

import { type EventType } from '@/constants/types';
import PhotographerCard from './PhotographersCard';
import PhotographerDetailsModal from './PhotographersDetailsModal';

interface PhotographerListProps {
  selectedEventTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  onMaxPriceChange?: (max: number) => void;
  showSelectButton?: boolean;
}

export const PhotographerList: FC<PhotographerListProps> = ({
  selectedEventTypes = [],
  priceRange,
  onMaxPriceChange,
  showSelectButton = false
}) => {
  const {
    photographers: availablePhotographers,
    isLoading,
    error,
    loadPhotographers,
    selectedPhotographers,
    toggleSelectedPhotographer
  } = usePhotographerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState<IPhotographer | null>(null);

  useEffect(() => {
    if (!isLoading && availablePhotographers.length === 0) {
      loadPhotographers();
    }
  }, [isLoading, availablePhotographers.length, loadPhotographers]);

  useEffect(() => {
    const max = availablePhotographers.reduce((acc: number, p: IPhotographer) => {
      const price = p.pricePerHour || p.pricePerDay || 0;
      return price > acc ? price : acc;
    }, 0);
    onMaxPriceChange?.(max);
  }, [availablePhotographers, onMaxPriceChange]);

  const handleDetailsClick = (photographer: IPhotographer) => {
    setSelectedPhotographer(photographer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhotographer(null);
  };

  const filteredPhotographers = availablePhotographers.filter((p: IPhotographer) => {
    if (selectedEventTypes.length > 0) {
      const matchesEvent = p.eventTypes.some(type => selectedEventTypes.includes(type as EventType));
      if (!matchesEvent) return false;
    }

    if (priceRange) {
      const price = p.pricePerHour || p.pricePerDay || 0;
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

  if (!Array.isArray(filteredPhotographers) || filteredPhotographers.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Фотографів не знайдено
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
          {filteredPhotographers.map((photographer) => (
            <motion.div
              key={photographer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <PhotographerCard
                photographer={photographer}
                isSelected={selectedPhotographers.some(item => item._id === photographer._id)}
                onDetailsClick={() => handleDetailsClick(photographer)}
                onSelect={() => toggleSelectedPhotographer(photographer)}
                showSelectButton={showSelectButton}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <PhotographerDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        photographer={selectedPhotographer}
      />
    </>
  );
};
