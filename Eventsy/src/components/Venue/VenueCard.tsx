import { type FC } from 'react';
import { motion } from 'framer-motion';
import { type IVenue } from '@/types/venue';
import { EVENT_TYPE_NAMES } from '@/constants/types';

interface VenueCardProps {
  venue: IVenue;
  isSelected?: boolean;
  onDetailsClick: (venue: IVenue) => void;
  onSelect?: (venue: IVenue) => void;
  showSelectButton?: boolean;
}

const VenueCard: FC<VenueCardProps> = ({ 
  venue, 
  isSelected = false, 
  onDetailsClick,
  onSelect,
  showSelectButton = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(venue);
  };

  return (
    <motion.div
      className={`bg-black-30 rounded-xl p-4 cursor-pointer h-full flex flex-col transition-shadow duration-300 ${isSelected ? 'ring-2 ring-coral shadow-lg' : 'hover:shadow-lg'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDetailsClick(venue)}
    >
      <div className="aspect-video bg-black-30 flex items-center justify-center">
        <img 
          src={venue.images?.[0] || '/placeholder-venue.jpg'} 
          alt={venue.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
          <div className="space-y-1 text-muted">
            <p>{venue.address}</p>
            {venue.capacity && (
              <p>Місткість: {venue.capacity} осіб</p>
            )}
            {venue.pricePerHour && (
              <p>Ціна за годину: {venue.pricePerHour} грн</p>
            )}
            {venue.pricePerDay && (
              <p>Ціна за день: {venue.pricePerDay} грн</p>
            )}
            <p>Типи подій: {venue.eventTypes.map(type => EVENT_TYPE_NAMES[type]).join(', ')}</p>
            {venue.rating && (
              <p>Рейтинг: {venue.rating}/5</p>
            )}
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
            {venue.pricePerHour ? `${venue.pricePerHour} грн/год` : `${venue.pricePerDay} грн/день`}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VenueCard; 