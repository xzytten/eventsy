import { type FC } from 'react';
import { motion } from 'framer-motion';
import { type IVehicle } from '@/types/vehicle';

interface VehicleCardProps {
  vehicle: IVehicle;
  isSelected?: boolean;
  onDetailsClick: (vehicle: IVehicle) => void;
  onSelect?: (vehicle: IVehicle) => void;
  showSelectButton?: boolean;
}

const VehicleCard: FC<VehicleCardProps> = ({ 
  vehicle, 
  isSelected = false,
  onDetailsClick,
  onSelect,
  showSelectButton = false 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(vehicle);
  };

  return (
    <motion.div
      className={`bg-black-30 rounded-xl p-4 cursor-pointer h-full flex flex-col transition-shadow duration-300 ${isSelected ? 'ring-2 ring-coral shadow-lg' : 'hover:shadow-lg'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDetailsClick(vehicle)}
    >
      <div className="aspect-video bg-black-30 flex items-center justify-center">
        <img
          src={vehicle.images?.[0] || '/placeholder-vehicle.jpg'}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{vehicle.name}</h3>
          <div className="space-y-1 text-muted ">
            <p><span className='text-xl text-text-milk'>Марка:</span> {vehicle.brand}</p>
            <p><span className='text-xl text-text-milk'>Модель: </span> {vehicle.model}</p>
            <p><span className='text-xl text-text-milk'>Місткість: </span> {vehicle.capacity} осіб</p>
            <p><span className='text-xl text-text-milk'>Ціна за годину: </span> {vehicle.pricePerHour} грн</p>
            <p><span className='text-xl text-text-milk'>Ціна за день: </span> {vehicle.pricePerDay} грн</p>
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

export default VehicleCard;
