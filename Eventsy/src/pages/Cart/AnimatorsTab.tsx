import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatorStore } from '@/store/animatorStore';
import CartItemComponent from './CartItemComponent';
import AnimatorDetailsModal from '@/components/Animator/AnimatorDetailsModal';
import { type IAnimator } from '@/types/animator';
import { type CartItem } from '@/types/cart';
import { type FullServiceDetails } from './CartItemComponent';
import { type EventType } from '@/constants/types';

interface DetailedAnimatorCartItem extends CartItem {
  fullDetails?: IAnimator;
}

const AnimatorsTab: FC = () => {
  const {
    animators,
    selectedAnimators,
    loadAnimators,
  } = useAnimatorStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimatorForDetails, setSelectedAnimatorForDetails] = useState<IAnimator | null>(null);

  useEffect(() => {
    if (animators.length === 0) {
      loadAnimators();
    }
  }, [animators.length, loadAnimators]);

  const detailedAnimatorItems: DetailedAnimatorCartItem[] = selectedAnimators.map(animator => ({
    id: animator._id,
    title: animator.name,
    category: 'animators',
    price: animator.pricePerDay || animator.pricePerHour,
    hourlyPrice: animator.pricePerHour,
    duration: '1 день',
    image: animator.images?.[0] || '/placeholder-animator.jpg',
    quantity: 1,
    paymentType: animator.paymentType || (animator.pricePerHour ? 'hourly' : 'full'),
    hours: animator.hours || (animator.pricePerHour ? 1 : undefined),
    description: animator.description || '',
    location: 'Київ',
    eventTypes: (animator.eventTypes || []) as EventType[],
    fullDetails: animator
  }));

  const handleDetailsClick = (item: CartItem, fullDetails?: FullServiceDetails) => {
    if (fullDetails && 'experience' in fullDetails) {
      setSelectedAnimatorForDetails(fullDetails as IAnimator);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnimatorForDetails(null);
  };

  return (
    <motion.div
      key="animators"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-semibold mb-6">Ваші вибрані аніматори</h1>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {detailedAnimatorItems.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              fullDetails={item.fullDetails}
              onDetailsClick={handleDetailsClick}
            />
          ))}
        </AnimatePresence>

        {detailedAnimatorItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 p-8"
          >
            Немає вибраних аніматорів.
          </motion.div>
        )}
      </div>

      <AnimatorDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        animator={selectedAnimatorForDetails}
      />
    </motion.div>
  );
};

export default AnimatorsTab;
