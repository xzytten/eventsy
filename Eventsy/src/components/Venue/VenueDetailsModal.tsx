import { type FC } from 'react';
import { type IVenue } from '@/types/venue';
import DetailsModal from '../DetailsModal/DetailsModal';

interface VenueDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: IVenue | null;
}

const VenueDetailsModal: FC<VenueDetailsModalProps> = ({ isOpen, onClose, venue }) => {
  if (!isOpen || !venue) {
    return null;
  }

  return (
    <DetailsModal isOpen={isOpen} onClose={onClose} >
      <h2 className="text-2xl font-bold mb-4 text-coral">{venue.name}</h2>
      <div className="mb-6 aspect-video bg-black-20 flex items-center justify-center rounded-md overflow-hidden">
        <img
          src={venue.images?.[0] || '/placeholder-venue.jpg'}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3 text-muted text-lg leading-relaxed">
        <p><span>Адреса:</span> {venue.address || 'Не вказано'}</p>
        <p><span>Опис:</span> {venue.description || 'Немає опису'}</p>
        <p><span>Місткість:</span> {venue.capacity ? `${venue.capacity} осіб` : 'Не вказано'}</p>
        <p><span>Ціна за годину:</span> {venue.pricePerHour ? `${venue.pricePerHour} грн` : 'Не вказано'}</p>
        <p><span>Ціна за день:</span> {venue.pricePerDay ? `${venue.pricePerDay} грн` : 'Не вказано'}</p>
      </div>
    </DetailsModal>
  );
};

export default VenueDetailsModal; 