import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVehicleStore } from '@/store/vehicleStore';
import VehicleCard from './VehicleCard';
import type { IVehicle } from '@/types/vehicle';
import VehicleDetailsModal from './VehicleDetailsModal';
import { type EventType } from '@/constants/types';

interface VehicleListProps {
  selectedEventTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  isHourly?: boolean;
  onMaxPriceChange?: (max: number) => void;
  showSelectButton?: boolean;
}

export const VehicleList: FC<VehicleListProps> = ({ 
  selectedEventTypes = [], 
  priceRange, 
  isHourly = false,
  onMaxPriceChange,
  showSelectButton = false
}) => {
  const { 
    vehicles: availableVehicles, 
    isLoading, 
    error, 
    loadVehicles,
    selectVehicle,
    selectedVehicles
  } = useVehicleStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<IVehicle | null>(null);

  useEffect(() => {
    if (availableVehicles.length === 0 && !isLoading) {
      loadVehicles();
    }
  }, [availableVehicles.length, isLoading, loadVehicles]);

  useEffect(() => {
    const max = availableVehicles.reduce((acc: number, vehicle: IVehicle) => {
      const price = isHourly ? (vehicle.pricePerHour ?? 0) : (vehicle.pricePerDay ?? 0);
      return price > acc ? price : acc;
    }, 0);
    onMaxPriceChange?.(max);
  }, [availableVehicles, isHourly, onMaxPriceChange]);

  const handleDetailsClick = (vehicle: IVehicle) => {
    setSelectedVehicleForDetails(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicleForDetails(null);
  };

  // Фільтрація автомобілів за вибраними критеріями
  const filteredVehicles = availableVehicles.filter((vehicle: IVehicle) => {
    // Фільтр за типом події
    if (selectedEventTypes?.length > 0) {
      const hasMatchingEventType = vehicle.eventTypes?.some((type) => 
        selectedEventTypes.includes(type as EventType)
      );
      if (!hasMatchingEventType) return false;
    }

    // Фільтр за ціною
    if (priceRange) {
      const price = isHourly ? (vehicle.pricePerHour ?? 0) : (vehicle.pricePerDay ?? 0);
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

  if (!Array.isArray(filteredVehicles) || filteredVehicles.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Автомобілів не знайдено
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
          {filteredVehicles.map((vehicle: IVehicle) => (
            <motion.div
              key={vehicle._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <VehicleCard 
                vehicle={vehicle} 
                onDetailsClick={handleDetailsClick}
                isSelected={selectedVehicles.some(v => v._id === vehicle._id)}
                onSelect={selectVehicle}
                showSelectButton={showSelectButton}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <VehicleDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicle={selectedVehicleForDetails}
      />
    </>
  );
};
