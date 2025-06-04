import { type FC } from 'react';
import { type IFood } from '@/types/food';
import { EVENT_TYPE_NAMES } from '@/constants/types';
import DetailsModal from '../DetailsModal/DetailsModal';

interface FoodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: IFood | null;
}

const FoodDetailsModal: FC<FoodDetailsModalProps> = ({ isOpen, onClose, food }) => {
  if (!isOpen || !food) {
    return null;
  }

  return (
    <DetailsModal isOpen={isOpen} onClose={onClose} >
      <h2 className="text-2xl font-bold mb-4 text-coral">{food.name}</h2>
      <div className="mb-6 aspect-video bg-black-20 flex items-center justify-center rounded-md overflow-hidden">
        <img
          src={food.images?.[0] || '/placeholder-food.jpg'}
          alt={food.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3 text-muted text-lg leading-relaxed">
        <p><strong>Опис:</strong> {food.description || 'Немає опису'}</p>
        {food.price && <p><strong>Ціна:</strong> {food.price} грн</p>}
        {food.portion && <p><strong>Порцій:</strong> {food.portion}</p>}
        {food.weight && <p><strong>Вага:</strong> {food.weight}г</p>}
        {food.servesPeople && <p><strong>На осіб:</strong> {food.servesPeople}</p>}
        {food.items && food.items.length > 0 && (
          <p><strong>Набір:</strong> {food.items.map(item => `${item.name} (${item.quantity}шт)`).join(', ')}</p>
        )}
        {food.allergens && food.allergens.length > 0 && (
          <p><strong>Алергени:</strong> {food.allergens.join(', ')}</p>
        )}
        <p><strong>Типи подій:</strong> {(food.eventTypes && food.eventTypes.length > 0) ? food.eventTypes.map(type => EVENT_TYPE_NAMES[type] || type).join(', ') : 'Не вказано'}</p>
        {(food.isVegetarian || food.isVegan) && (
          <p>
            {food.isVegan ? 'Веганське' : food.isVegetarian ? 'Вегетаріанське' : ''}
          </p>
        )}
      </div>
    </DetailsModal>
  );
};

export default FoodDetailsModal; 