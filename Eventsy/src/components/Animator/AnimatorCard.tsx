import { type FC } from 'react';
import type { IAnimator } from '@/types/animator';
import { motion } from 'framer-motion';
import { useAnimatorStore } from '@/store/animatorStore';

interface AnimatorCardProps {
  animator: IAnimator;
  onDetailsClick: (animator: IAnimator) => void;
  onSelect?: (animator: IAnimator) => void;
  showSelectButton?: boolean;
}

export const AnimatorCard: FC<AnimatorCardProps> = ({ 
  animator, 
  onDetailsClick,
  onSelect,
  showSelectButton = false 
}) => {
  const { selectedAnimators } = useAnimatorStore();
  const isSelected = selectedAnimators.some(a => a._id === animator._id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(animator);
  };

  return (
    <motion.div
      className={`bg-black-30 rounded-xl p-4 cursor-pointer h-full flex flex-col transition-shadow duration-300 ${isSelected ? 'ring-2 ring-coral shadow-lg' : 'hover:shadow-lg'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDetailsClick(animator)}
    >
      <div className="aspect-video bg-black-30 flex items-center justify-center">
        <img 
          src={animator.images[0] || '/placeholder-animator.jpg'} 
          alt={animator.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{animator.name}</h3>
          <div className="space-y-1 text-muted text-text-milk">
            <p>Досвід: {animator.experience} {animator.experience < 10 ? 'роки' : 'років'}</p>
            <p><span className='text-xl text-text-milk'>Вік: </span> від {animator.ageRange.min}  {animator.ageRange.max !== 100 && `до ${animator.ageRange.max}`} років</p>
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
        <div className="flex justify-between items-center mt-4">
          <span className="text-coral font-semibold">
            {animator.pricePerHour} грн/год
            {animator.pricePerDay && ` | ${animator.pricePerDay} грн/день`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}; 