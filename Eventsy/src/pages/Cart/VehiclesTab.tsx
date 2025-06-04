import { type FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartItemComponent from './CartItemComponent';
import { useVehicleStore } from '@/store/vehicleStore';
import { type IVehicle } from '@/types/vehicle';
import { type CartItem } from '@/types/cart';
import VehicleDetailsModal from '@/components/Vehicle/VehicleDetailsModal';
import { type FullServiceDetails } from './CartItemComponent';

interface DetailedVehicleCartItem extends CartItem {
    fullDetails?: IVehicle;
}
const VehiclesTab: FC = () => {
    const {
        loadVehicles,
        selectedVehicles
    } = useVehicleStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<IVehicle | null>(null);

    useEffect(() => {
        loadVehicles();
    }, [loadVehicles]);

    // Мапимо selectedVehicles у CartItemComponent-формат (псевдо-карти)
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
        paymentType: vehicle.pricePerHour ? 'hourly' : 'full',
        hours: vehicle.pricePerHour ? 1 : undefined,
        fullDetails: vehicle,
    }));

    const handleDetailsClick = (item: CartItem, fullDetails?: FullServiceDetails) => {
        if (fullDetails && 'brand' in fullDetails) {
            setSelectedVehicleForDetails(fullDetails as IVehicle);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVehicleForDetails(null);
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
                        <CartItemComponent 
                            key={item.id} 
                            item={item} 
                            fullDetails={item.fullDetails}
                            onDetailsClick={handleDetailsClick}
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