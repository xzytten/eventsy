import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVehicleStore } from '@/store/vehicleStore';
import { type IVehicle } from '@/types/vehicle';
import { type CartItem } from '@/types/cart';
import VehicleDetailsModal from '@/components/Vehicle/VehicleDetailsModal';
import VehicleTabItem from '@/components/Vehicle/VehicleTabItem';

interface DetailedVehicleCartItem extends CartItem {
    fullDetails?: IVehicle;
}

const VehiclesTab: FC = () => {
    const {
        vehicles,
        selectedVehicles,
        loadVehicles,
        toggleSelectedVehicle,
        updateVehicleDescription,
        updateVehicleHours,
        updateVehiclePaymentType
    } = useVehicleStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<IVehicle | null>(null);

    useEffect(() => {
        if (vehicles.length === 0) {
            loadVehicles();
        }
    }, [vehicles.length, loadVehicles]);

    const detailedVehicleItems: DetailedVehicleCartItem[] = selectedVehicles.map(vehicle => ({
        id: vehicle._id || '',
        title: vehicle.name,
        description: vehicle.description || '',
        price: vehicle.pricePerDay,
        hourlyPrice: vehicle.pricePerHour,
        duration: '1 день',
        location: `${vehicle.brand} ${vehicle.model}`,
        image: vehicle.images[0] || '',
        eventTypes: vehicle.eventTypes || [],
        category: 'vehicles',
        quantity: 1,
        paymentType: vehicle.paymentType || (vehicle.pricePerHour ? 'hourly' : 'full'),
        hours: vehicle.hours || (vehicle.pricePerHour ? 1 : undefined),
        fullDetails: vehicle,
        clientDescription: vehicle.clientDescription || ''
    }));

    const handleDetailsClick = (item: CartItem, fullDetails?: IVehicle) => {
        if (fullDetails) {
            setSelectedVehicleForDetails(fullDetails);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVehicleForDetails(null);
    };

    const handleRemove = (id: string) => {
        const vehicleToRemove = selectedVehicles.find(vehicle => vehicle._id === id);
        if (vehicleToRemove) {
            toggleSelectedVehicle(vehicleToRemove);
        }
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        console.log('Updating quantity:', { id, quantity });
        const vehicleToUpdate = selectedVehicles.find(vehicle => vehicle._id === id);
        if (vehicleToUpdate) {
            updateVehicleHours(id, quantity);
        }
    };

    const handleUpdatePaymentType = (id: string, paymentType: 'full' | 'hourly') => {
        console.log('Updating payment type:', { id, paymentType });
        const vehicleToUpdate = selectedVehicles.find(vehicle => vehicle._id === id);
        if (vehicleToUpdate) {
            updateVehiclePaymentType(id, paymentType);
        }
    };

    return (
        <motion.div
            key="vehicles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-2xl font-semibold mb-6">Ваші вибрані транспортні засоби</h1>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {detailedVehicleItems.map((item) => (
                        <VehicleTabItem
                            key={item.id}
                            item={item}
                            fullDetails={item.fullDetails}
                            onDetailsClick={handleDetailsClick}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={() => handleRemove(item.id)}
                            onUpdateClientDescription={(description) => updateVehicleDescription(item.id, description)}
                            onUpdatePaymentType={(paymentType) => handleUpdatePaymentType(item.id, paymentType)}
                        />
                    ))}
                </AnimatePresence>

                {detailedVehicleItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 p-8"
                    >
                        Немає вибраних транспортних засобів.
                    </motion.div>
                )}
            </div>

            <VehicleDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                vehicle={selectedVehicleForDetails}
            />
        </motion.div>
    );
};

export default VehiclesTab; 