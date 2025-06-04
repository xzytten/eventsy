import { type FC } from 'react';
import { motion } from 'framer-motion';
import { type IFood } from '@/types/food';

interface FoodCardProps {
  food: IFood;
  isSelected?: boolean;
  onDetailsClick: (food: IFood) => void;
  onSelect?: (food: IFood) => void;
  showSelectButton?: boolean;
}

const FoodCard: FC<FoodCardProps> = ({ 
  food, 
  isSelected = false, 
  onDetailsClick,
  onSelect,
  showSelectButton = false 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(food);
  };

  return (
    <motion.div
      className={`bg-black-30 rounded-xl p-4 cursor-pointer h-full flex flex-col transition-shadow duration-300 ${isSelected ? 'ring-2 ring-coral shadow-lg' : 'hover:shadow-lg'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDetailsClick(food)}
    >
      <div className="aspect-video bg-black-30 flex items-center justify-center">
        <img
          src={food.images?.[0] || '/placeholder-food.jpg'}
          alt={food.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{food.name}</h3>
          <div className="space-y-1 text-muted text-text-milk flex flex-col justify-between">
            <div className='flex flex-col gap-2'>
              {food.price && <p><span className='text-xl'>Ціна: </span> {food.price} грн</p>}
              {food.portion && <p><span className='text-xl'>Порцій: </span> {food.portion}</p>}
              {food.weight && <p><span className='text-xl'>Вага:</span> {food.weight}г</p>}
              {food.servesPeople && <p>На {food.servesPeople} осіб</p>}
              {food.items && food.items.length > 0 && (
                <p>Набір: {food.items.map(item => `${item.name} (${item.quantity}шт)`).join(', ')}</p>
              )}
              {(food.isVegetarian || food.isVegan) && (
                <p>
                  {food.isVegan ? 'Веганське' : food.isVegetarian ? 'Вегетаріанське' : ''}
                </p>
              )}
            </div>
            <div>
              <span className="text-coral font-semibold">
                {food.price && <p><span className='text-xl'>Ціна:</span> {food.price} грн</p>}
                {food.totalPrice && <p><span className='text-xl'>Ціна:</span> {food.totalPrice} грн</p>}
              </span>
            </div>
          </div>
        </div>
        {showSelectButton && (
          <div className="mt-4">
            <button
              onClick={handleClick}
              className={`w-full py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                isSelected 
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

export default FoodCard; 