import { type FC, useEffect, useState } from 'react';
import { Users, Camera, Car, MapPin, Utensils } from 'lucide-react';
import { useServiceStore } from '@/store/serviceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatorList } from '@/components/Animator/AnimatorList';
import { VenueList } from '@/components/Venue/VenueList';
import { FoodList } from '@/components/Food/FoodList';
import { VehicleList } from '@/components/Vehicle/VehicleList';
import ServiceFilters from '@/components/Services/ServiceFilters';

const ServicesPage: FC = () => {
    const { currentStep, setCurrentStep } = useServiceStore();
    const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [isHourly, setIsHourly] = useState(false);
    const [maxAvailablePrice, setMaxAvailablePrice] = useState(10000);

    // Встановлюємо початкову категорію при монтуванні компонента
    useEffect(() => {
        setCurrentStep(0);
    }, []);

    const handleMaxPriceChange = (newMax: number) => {
        if (newMax !== maxAvailablePrice) {
            setMaxAvailablePrice(newMax);
        }
    };

    const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
        // Обмежуємо максимальне значення
        setPriceRange({
            min: newRange.min,
            max: Math.min(newRange.max, maxAvailablePrice)
        });
    };

    const categories = [
        { id: 'animators', icon: <Users size={20} />, label: 'Аніматори' },
        { id: 'photographers', icon: <Camera size={20} />, label: 'Фотографи' },
        { id: 'vehicles', icon: <Car size={20} />, label: 'Автомобілі' },
        { id: 'venues', icon: <MapPin size={20} />, label: 'Локації' },
        { id: 'food', icon: <Utensils size={20} />, label: 'Їжа' }
    ] as const;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">

                {/* Бокове меню */}
                <div className="w-64 shrink-0 sticky top-4 h-fit flex flex-col gap-4">
                    <motion.div
                        className="bg-black-30 rounded-xl p-4 space-y-2"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.2
                        }}
                    >
                        {categories.map(({ id, icon, label }, index) => (
                            <motion.button
                                key={id}
                                onClick={() => setCurrentStep(index)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${currentStep === index
                                        ? 'bg-coral text-white'
                                        : 'text-muted hover:bg-white/5'
                                    }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20,
                                    delay: 0.3 + (index * 0.1)
                                }}
                            >
                                {icon}
                                <span>{label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                    <motion.div
                        className="bg-black-30 rounded-xl p-4 space-y-2"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.2
                        }}
                    >
                        <ServiceFilters
                            selectedEventTypes={selectedEventTypes}
                            onEventTypeChange={setSelectedEventTypes}
                            priceRange={priceRange}
                            onPriceRangeChange={handlePriceRangeChange}
                            isHourly={isHourly}
                            onHourlyChange={setIsHourly}
                            maxAvailablePrice={maxAvailablePrice}
                        />
                    </motion.div>
                </div>

                {/* Основний контент */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <AnimatorList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                isHourly={isHourly}
                                onMaxPriceChange={handleMaxPriceChange}
                            />
                        )}
                        {currentStep === 3 && (
                            <VenueList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                isHourly={isHourly}
                                onMaxPriceChange={handleMaxPriceChange}
                                showSelectButton={true}
                            />
                        )}
                        {currentStep === 4 && (
                            <FoodList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                onMaxPriceChange={handleMaxPriceChange}
                            />
                        )}
                        {currentStep === 2 && (
                            <VehicleList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                isHourly={isHourly}
                                onMaxPriceChange={handleMaxPriceChange}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage; 