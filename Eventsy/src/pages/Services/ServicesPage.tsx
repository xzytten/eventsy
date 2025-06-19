import { type FC, useState } from 'react';
import { Users, Camera, Car, MapPin, Utensils, CupSoda, Image, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatorList } from '@/components/Animator/AnimatorList';
import { VenueList } from '@/components/Venue/VenueList';
import { FoodList } from '@/components/Food/FoodList';
import { VehicleList } from '@/components/Vehicle/VehicleList';
import {BeverageList} from '@/components/Beverage/BeverageList';
import ServiceFilters from '@/components/Services/ServiceFilters';
import { PhotographerList } from '@/components/Photographers/PhotographersList';

const ServicesPage: FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [isHourly, setIsHourly] = useState(false);
    const [maxAvailablePrice, setMaxAvailablePrice] = useState(10000);
    const [openMenu, setOpenMenu] = useState(false);

    const handleMaxPriceChange = (newMax: number) => {
        if (newMax !== maxAvailablePrice) {
            setMaxAvailablePrice(newMax);
        }
    };

    const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
        setPriceRange({
            min: newRange.min,
            max: Math.min(newRange.max, maxAvailablePrice)
        });
    };

    const categories = [
        { id: 'animators', icon: <Users size={20} />, label: 'Аніматори' },
        { id: 'vehicles', icon: <Car size={20} />, label: 'Автомобілі' },
        { id: 'venues', icon: <MapPin size={20} />, label: 'Локації' },
        { id: 'food', icon: <Utensils size={20} />, label: 'Їжа' },
        { id: 'beverage', icon: <CupSoda size={20} />, label: 'Напої' },
        { id: 'photographers', icon: <Camera size={20} />, label: 'Фотографи' },
    ] as const;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
                {/* Desktop sidebar */}
                <div className="w-64 shrink-0 sticky top-4 h-fit flex-col gap-4 hidden md:flex">
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
                {/* Mobile hamburger */}
                <div className="md:hidden flex flex-col">
                    <button
                        className="mb-4 text-white self-start"
                        onClick={() => setOpenMenu(true)}
                        aria-label="Відкрити меню послуг"
                    >
                        <Menu size={32} />
                    </button>
                    {openMenu && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
                            <button
                                className="absolute top-6 right-6 text-white"
                                onClick={() => setOpenMenu(false)}
                                aria-label="Закрити меню послуг"
                            >
                                <X size={36} />
                            </button>
                            <div className="w-11/12 max-w-xs bg-black-30 rounded-xl p-6 space-y-4">
                                <div className="space-y-2 mb-4">
                                    {categories.map(({ id, icon, label }, index) => (
                                        <button
                                            key={id}
                                            onClick={() => {
                                                setCurrentStep(index);
                                                setOpenMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${currentStep === index
                                                ? 'bg-coral text-white'
                                                : 'text-muted hover:bg-white/5'
                                            }`}
                                        >
                                            {icon}
                                            <span>{label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-black-30 rounded-xl p-2">
                                    <ServiceFilters
                                        selectedEventTypes={selectedEventTypes}
                                        onEventTypeChange={setSelectedEventTypes}
                                        priceRange={priceRange}
                                        onPriceRangeChange={handlePriceRangeChange}
                                        isHourly={isHourly}
                                        onHourlyChange={setIsHourly}
                                        maxAvailablePrice={maxAvailablePrice}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
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
                        {currentStep === 2 && (
                            <VenueList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                isHourly={isHourly}
                                onMaxPriceChange={handleMaxPriceChange}
                                showSelectButton={true}
                            />
                        )}
                        {currentStep === 3 && (
                            <FoodList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                onMaxPriceChange={handleMaxPriceChange}
                            />
                        )}
                        {currentStep === 1 && (
                            <VehicleList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                isHourly={isHourly}
                                onMaxPriceChange={handleMaxPriceChange}
                            />
                        )}
                            {currentStep === 4 && (
                            <BeverageList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
                                onMaxPriceChange={handleMaxPriceChange}
                            />
                        )}
                         {currentStep === 5 && (
                            <PhotographerList
                                selectedEventTypes={selectedEventTypes}
                                priceRange={priceRange}
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