import { type FC } from 'react';
import { motion } from 'framer-motion';
import type { IPhotographer } from '@/types/photographer';

interface PhotographerCardProps {
  photographer: IPhotographer;
  isSelected?: boolean;
  onDetailsClick: (photographer: IPhotographer) => void;
  onSelect?: (photographer: IPhotographer) => void;
  showSelectButton?: boolean;
}

const PhotographerCard: FC<PhotographerCardProps> = ({
  photographer,
  isSelected = false,
  onDetailsClick,
  onSelect,
  showSelectButton = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(photographer);
  };

  return (
    <motion.div
      className={`bg-black-30 rounded-xl p-4 cursor-pointer h-full flex flex-col transition-shadow duration-300 ${
        isSelected ? 'ring-2 ring-coral shadow-lg' : 'hover:shadow-lg'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDetailsClick(photographer)}
    >
      <div className="aspect-video bg-black-30 flex items-center justify-center overflow-hidden">
        <img
          src={`http://localhost:8087${photographer.images[0]}`|| '/placeholder-photographer.jpg'}
          alt={photographer.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-photographer.jpg';
          }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{photographer.name}</h3>
          <div className="space-y-1 text-text-milk text-sm">
            <p><span className="font-semibold">Досвід:</span> {photographer.experience} років</p>
            <p><span className="font-semibold">Спеціалізація:</span> {photographer.specialization.join(', ')}</p>
            <p><span className="font-semibold">Погодинно:</span> {photographer.pricePerHour} грн</p>
            <p><span className="font-semibold">За день:</span> {photographer.pricePerDay} грн</p>
          </div>
        </div>
        {showSelectButton && (
          <div className="mt-4">
            <button
              onClick={handleClick}
              className={`w-full py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                isSelected ? 'bg-coral text-white' : 'bg-white/10 hover:bg-white/20 text-white'
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

export default PhotographerCard;
