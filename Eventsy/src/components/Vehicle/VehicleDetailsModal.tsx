import { type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type IVehicle } from '@/types/vehicle';
import { EVENT_TYPE_NAMES, VEHICLE_TYPE_NAMES } from '@/constants/types';
import { X } from 'lucide-react';
import DetailsModal from '../DetailsModal/DetailsModal';

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: IVehicle | null;
}

const VehicleDetailsModal: FC<VehicleDetailsModalProps> = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) {
    return null;
  }

  return (
    <DetailsModal isOpen={isOpen} onClose={onClose} >
      <h2 className="text-2xl font-bold mb-4 text-coral">{vehicle.name}</h2>
      <div className="mb-6 aspect-video bg-black-20 flex items-center justify-center rounded-md overflow-hidden">
        <img
          src={vehicle.images?.[0] || '/placeholder-vehicle.jpg'}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3 text-muted text-lg leading-relaxed">
        <p><strong>Опис:</strong> {vehicle.description || 'Немає опису'}</p>
        <p><strong>Тип:</strong> {VEHICLE_TYPE_NAMES[vehicle.type] || vehicle.type}</p>
        <p><strong>Марка:</strong> {vehicle.brand || 'Не вказано'}</p>
        <p><strong>Модель:</strong> {vehicle.model || 'Не вказано'}</p>
        <p><strong>Рік випуску:</strong> {vehicle.year || 'Не вказано'}</p>
        <p><strong>Місткість:</strong> {vehicle.capacity ? `${vehicle.capacity} осіб` : 'Не вказано'}</p>
        <p><strong>Ціна за годину:</strong> {vehicle.pricePerHour ? `${vehicle.pricePerHour} грн` : 'Не вказано'}</p>
        <p><strong>Ціна за день:</strong> {vehicle.pricePerDay ? `${vehicle.pricePerDay} грн` : 'Не вказано'}</p>
        <p><strong>Типи подій:</strong> {(vehicle.eventTypes && vehicle.eventTypes.length > 0) ? vehicle.eventTypes.map(type => EVENT_TYPE_NAMES[type] || type).join(', ') : 'Не вказано'}</p>
        {vehicle.rating > 0 && <p><strong>Рейтинг:</strong> {vehicle.rating}/5</p>}
      </div>
    </DetailsModal>


  );
};

export default VehicleDetailsModal; 