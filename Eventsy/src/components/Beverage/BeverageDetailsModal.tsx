import { type FC } from 'react';
import { type IBeverage } from '@/types/beverage';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import DetailsModal from '../DetailsModal/DetailsModal';

interface BeverageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  beverage: IBeverage | null;
}

const BeverageDetailsModal: FC<BeverageDetailsModalProps> = ({ isOpen, onClose, beverage }) => {
  if (!isOpen || !beverage) {
    return null;
  }

  return (
    <DetailsModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-coral">{beverage.name}</h2>
      <div className="mb-6 bg-black-20 rounded-md overflow-hidden relative">
        <img
          src={beverage.images?.[0] ? `http://localhost:8087${beverage.images[0]}` : '/placeholder-beverage.jpg'}
          alt={beverage.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3 text-muted text-lg leading-relaxed">
        <p><strong>Опис:</strong> {beverage.description || 'Немає опису'}</p>
        <p><strong>Ціна:</strong> {beverage.totalPrice} грн</p>
        {beverage.volume && <p><strong>Обʼєм:</strong> {beverage.volume} мл</p>}
        {beverage.isAlcoholic && (
          <p><strong>Алкоголь:</strong> так{beverage.alcoholContent ? ` (${beverage.alcoholContent}%)` : ''}</p>
        )}
        {!beverage.isAlcoholic && (
          <p><strong>Безалкогольний</strong></p>
        )}
        {beverage.ingredients?.length > 0 && (
          <p><strong>Інгредієнти:</strong> {beverage.ingredients.join(', ')}</p>
        )}
        {beverage.items && beverage.items.length > 0 && (
          <p><strong>Набір:</strong> {beverage.items.map(item => `${item.name} (${item.quantity}шт)`).join(', ')}</p>
        )}
        <p>
          <strong>Типи подій:</strong>{' '}
          {(beverage.eventTypes && beverage.eventTypes.length > 0)
            ? beverage.eventTypes.map(type => EVENT_TYPE_NAMES[type] || type).join(', ')
            : 'Не вказано'}
        </p>
      </div>
    </DetailsModal>
  );
};

export default BeverageDetailsModal;
