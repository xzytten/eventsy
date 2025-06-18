import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePhotographerStore from '@/store/photographerStore';
import { type CartItem } from '@/types/cart';
import { type FullServiceDetails } from './CartItemComponent';
import { type EventType } from '@/constants/types';
import type { IPhotographer } from '@/types/photographer';
import PhotographerTabItem from '@/components/Photographers/PhotographersTabItem';
import PhotographerDetailsModal from '@/components/Photographers/PhotographersDetailsModal';

interface DetailedPhotographerCartItem extends CartItem {
  fullDetails?: IPhotographer;
}

const PhotographersTab: FC = () => {
  const {
    photographers,
    selectedPhotographers,
    loadPhotographers,
    updatePhotographerDescription,
  } = usePhotographerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotographerForDetails, setSelectedPhotographerForDetails] = useState<IPhotographer | null>(null);

  useEffect(() => {
    if (photographers.length === 0) {
      loadPhotographers();
    }
  }, [photographers.length, loadPhotographers]);

  const handleUpdateClientDescription = (photographerId: string, description: string) => {
    updatePhotographerDescription(photographerId, description);
  };

  const detailedPhotographerItems: DetailedPhotographerCartItem[] = selectedPhotographers.map(photographer => ({
    id: photographer._id,
    title: photographer.name,
    category: 'photographers',
    price: photographer.pricePerDay || photographer.pricePerHour,
    hourlyPrice: photographer.pricePerHour,
    duration: '1 день',
    images: photographer.images || '/placeholder-photographer.jpg',
    quantity: 1,
    paymentType: photographer.paymentType || (photographer.pricePerHour ? 'hourly' : 'full'),
    hours: photographer.pricePerHour || (photographer.pricePerHour ? 1 : undefined),
    description: photographer.description || '',
    clientDescription: photographer.clientDescription || '',
    location: 'Київ',
    eventTypes: (photographer.eventTypes || []) as EventType[],
    fullDetails: photographer,
  }));

  const handleDetailsClick = (item: CartItem, fullDetails?: FullServiceDetails) => {
    if (fullDetails && 'experience' in fullDetails) {
      setSelectedPhotographerForDetails(fullDetails as IPhotographer);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhotographerForDetails(null);
  };

  return (
    <motion.div
      key="photographers"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-semibold mb-6">Ваші вибрані фотографи</h1>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {detailedPhotographerItems.map((item) => (
            <PhotographerTabItem
              key={item.id}
              item={item}
              fullDetails={item.fullDetails}
              onDetailsClick={handleDetailsClick}
              onUpdateClientDescription={handleUpdateClientDescription}
            />
          ))}
        </AnimatePresence>

        {detailedPhotographerItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 p-8"
          >
            Немає вибраних фотографів.
          </motion.div>
        )}
      </div>

      <PhotographerDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        photographer={selectedPhotographerForDetails}
      />
    </motion.div>
  );
};

export default PhotographersTab;
