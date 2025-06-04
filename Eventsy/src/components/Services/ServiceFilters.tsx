import { type FC } from 'react';
import { EVENT_TYPES, EVENT_TYPE_NAMES } from '@/constants/types';

interface ServiceFiltersProps {
  selectedEventTypes: string[];
  onEventTypeChange: (types: string[]) => void;
  priceRange: {
    min: number;
    max: number;
  };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  isHourly: boolean;
  onHourlyChange: (isHourly: boolean) => void;
  maxAvailablePrice: number;
}

const ServiceFilters: FC<ServiceFiltersProps> = ({
  selectedEventTypes,
  onEventTypeChange,
  priceRange,
  onPriceRangeChange,
  isHourly,
  onHourlyChange,
  maxAvailablePrice
}) => {
  const handleEventTypeToggle = (type: string) => {
    if (selectedEventTypes.includes(type)) {
      onEventTypeChange(selectedEventTypes.filter(t => t !== type));
    } else {
      onEventTypeChange([...selectedEventTypes, type]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Фільтр за типом події */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Тип події</h3>
        <div className="space-y-2">
          {EVENT_TYPES.map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedEventTypes.includes(type)}
                onChange={() => handleEventTypeToggle(type)}
                className="form-checkbox h-4 w-4 text-coral"
              />
              <span>{EVENT_TYPE_NAMES[type]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Фільтр за ціною */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Ціна</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isHourly}
              onChange={(e) => onHourlyChange(e.target.checked)}
              className="form-checkbox h-4 w-4 text-coral"
            />
            <span>Погодинна оплата</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Від {priceRange.min} грн</span>
              <span>До {priceRange.max} грн</span>
            </div>
            <input
              type="range"
              min="0"
              max={maxAvailablePrice}
              step="100"
              value={priceRange.max}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                onPriceRangeChange({ ...priceRange, max: newMax });
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilters; 