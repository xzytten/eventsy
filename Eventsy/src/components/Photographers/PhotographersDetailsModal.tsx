import { type FC } from 'react';
import type { IPhotographer } from '@/types/photographer';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import DetailsModal from '../DetailsModal/DetailsModal';

interface PhotographerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  photographer: IPhotographer | null;
}

const PhotographerDetailsModal: FC<PhotographerDetailsModalProps> = ({ isOpen, onClose, photographer }) => {
  if (!isOpen || !photographer) {
    return null;
  }

  return (
    <DetailsModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-coral">{photographer.name}</h2>
      <div className="mb-6 bg-black-20 rounded-md overflow-hidden relative">
        <img
          src={`http://localhost:8087${photographer.images[0]}`|| '/placeholder-photographer.jpg'}
          alt={photographer.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3 text-muted text-lg leading-relaxed">
        <p><strong>Опис:</strong> {photographer.description || 'Немає опису'}</p>
        <p><strong>Досвід:</strong> {photographer.experience} років</p>
        <p><strong>Спеціалізація:</strong> {photographer.specialization.join(', ')}</p>
        <p><strong>Ціна за годину:</strong> {photographer.pricePerHour} грн</p>
        <p><strong>Ціна за день:</strong> {photographer.pricePerDay} грн</p>
        <p><strong>Типи подій:</strong> {(photographer.eventTypes && photographer.eventTypes.length > 0)
          ? photographer.eventTypes.map(type => EVENT_TYPE_NAMES[type] || type).join(', ')
          : 'Не вказано'}
        </p>
      </div>
    </DetailsModal>
  );
};

export default PhotographerDetailsModal;
