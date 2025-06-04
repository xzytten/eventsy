import { type FC } from 'react';
import type { IAnimator } from '@/types/animator';
import DetailsModal from '../DetailsModal/DetailsModal';

interface AnimatorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  animator: IAnimator | null;
}

const AnimatorDetailsModal: FC<AnimatorDetailsModalProps> = ({ isOpen, onClose, animator }) => {
  if (!isOpen || !animator) {
    return null;
  }

  return (
    <DetailsModal isOpen={isOpen} onClose={onClose} >
      <h2 className="text-2xl font-bold mb-4 text-coral">{animator.name}</h2>
      <div className="mb-6 aspect-video bg-black-20 flex items-center justify-center rounded-md overflow-hidden">
        <img
          src={animator.images?.[0] || '/placeholder-animator.jpg'}
          alt={animator.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3 text-muted text-lg leading-relaxed">
        <p><span>Опис:</span> {animator.description || 'Немає опису'}</p>
        <p><span>Досвід:</span> {animator.experience ? `${animator.experience} років` : 'Не вказано'}</p>
        <p><span>Вік:</span> {animator.ageRange ? `${animator.ageRange.min}-${animator.ageRange.max} років` : 'Не вказано'}</p>
        <p><span>Кількість дітей:</span> {animator.capacity ? `до ${animator.capacity}` : 'Не вказано'}</p>
        <p><span>Ціна за годину:</span> {animator.pricePerHour ? `${animator.pricePerHour} грн` : 'Не вказано'}</p>
        {animator.pricePerDay && <p><strong>Ціна за день:</strong> {animator.pricePerDay} грн</p>}
      </div>
    </DetailsModal>

  );
};

export default AnimatorDetailsModal; 