import { type FC } from 'react';
import { motion } from 'framer-motion';
import type { IBeverage } from '@/types/beverage';

interface BeverageCardProps {
  beverage: IBeverage;
  isSelected?: boolean;
  onDetailsClick: (beverage: IBeverage) => void;
  onSelect?: (beverage: IBeverage) => void;
  showSelectButton?: boolean;
}

const BeverageCard: FC<BeverageCardProps> = ({
  beverage,
  isSelected = false,
  onDetailsClick,
  onSelect,
  showSelectButton = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(beverage);
  };

  return (
    <motion.div
      className={`bg-black-30 rounded-xl p-4 cursor-pointer h-full flex flex-col transition-shadow duration-300 ${isSelected ? 'ring-2 ring-coral shadow-lg' : 'hover:shadow-lg'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDetailsClick(beverage)}
    >
      <div className="aspect-video bg-black-30 flex items-center justify-center">
        <img
          src={beverage.images?.[0] ? `http://localhost:8087${beverage.images[0]}` : '/placeholder-beverage.jpg'}
          alt={beverage.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{beverage.name}</h3>
          <div className="space-y-1 text-muted text-text-milk flex flex-col gap-2">
            {beverage.volume && <p><span className="text-xl">Обʼєм:</span> {beverage.volume} мл</p>}
            {beverage.isAlcoholic && (
              <p><span className="text-xl">Алкоголь:</span> так {beverage.alcoholContent ? `(${beverage.alcoholContent}%)` : ''}</p>
            )}
            {!beverage.isAlcoholic && <p><span className="text-xl">Безалкогольний</span></p>}
            {beverage.ingredients?.length > 0 && (
              <p><span className="text-xl">Інгредієнти:</span> {beverage.ingredients.join(', ')}</p>
            )}
            {beverage.items && beverage.items?.length > 0 && (
              <p><span className="text-xl">Набір:</span> {beverage.items.map(item => `${item.name} (${item.quantity}шт)`).join(', ')}</p>
            )}
            <p>
              <span className="text-coral font-semibold text-xl">Ціна:</span> {beverage.totalPrice} грн
            </p>
          </div>
        </div>
        {showSelectButton && (
          <div className="mt-4">
            <button
              onClick={handleClick}
              className={`w-full py-2 px-4 rounded-lg transition-colors cursor-pointer ${isSelected
                ? 'bg-coral text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isSelected ? 'Вибрано' : 'Вибрати'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BeverageCard;
