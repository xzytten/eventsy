import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '@/store/venueStore';
import VenueCard from './VenueCard';
import type { IVenue } from '@/types/venue';
import VenueDetailsModal from './VenueDetailsModal';
import { type EventType } from '@/constants/types';

interface VenueListProps {
  selectedEventTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  isHourly?: boolean;
  onMaxPriceChange?: (max: number) => void;
  showSelectButton?: boolean;
}

export const VenueList: FC<VenueListProps> = ({ 
  selectedEventTypes = [], 
  priceRange, 
  isHourly = false,
  onMaxPriceChange,
  showSelectButton = false
}) => {
  const { 
    venues: availableVenues, 
    isLoading, 
    error, 
    loadVenues,
    selectedVenues,
    selectVenue
  } = useVenueStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenueForDetails, setSelectedVenueForDetails] = useState<IVenue | null>(null);

  useEffect(() => {
    if (availableVenues.length === 0 && !isLoading) {
      loadVenues();
    }
  }, [availableVenues.length, isLoading, loadVenues]);

  useEffect(() => {
    const max = availableVenues.reduce((acc: number, venue: IVenue) => {
      const price = isHourly ? (venue.pricePerHour ?? 0) : (venue.pricePerDay ?? 0);
      return price > acc ? price : acc;
    }, 0);
    onMaxPriceChange?.(max);
  }, [availableVenues, isHourly, onMaxPriceChange]);

  const handleDetailsClick = (venue: IVenue) => {
    setSelectedVenueForDetails(venue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVenueForDetails(null);
  };

  // Фільтрація локацій за вибраними критеріями
  const filteredVenues = availableVenues.filter((venue: IVenue) => {
    // Фільтр за типом події
    if (selectedEventTypes?.length > 0) {
      const hasMatchingEventType = venue.eventTypes?.some((type) => 
        selectedEventTypes.includes(type as EventType)
      );
      if (!hasMatchingEventType) return false;
    }

    // Фільтр за ціною
    if (priceRange) {
      const price = isHourly ? (venue.pricePerHour ?? 0) : (venue.pricePerDay ?? 0);
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

  if (!Array.isArray(filteredVenues) || filteredVenues.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Локацій не знайдено
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
          {filteredVenues.map((venue: IVenue) => (
            <motion.div
              key={venue._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <VenueCard 
                venue={venue} 
                onDetailsClick={handleDetailsClick}
                isSelected={selectedVenues.some(v => v._id === venue._id)}
                onSelect={selectVenue}
                showSelectButton={showSelectButton}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <VenueDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        venue={selectedVenueForDetails}
      />
    </>
  );
}; 