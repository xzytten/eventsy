import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '@/store/venueStore';
import { type IVenue } from '@/types/venue';
import { type CartItem } from '@/types/cart';
import VenueDetailsModal from '@/components/Venue/VenueDetailsModal';
import VenueTabItem from '@/components/Venue/VenueTabItem';

interface DetailedVenueCartItem extends CartItem {
    fullDetails?: IVenue;
}

const VenuesTab: FC = () => {
    const {
        venues: availableVenues,
        selectedVenues,
        loadVenues,
        toggleSelectedVenue,
        updateVenueDescription
    } = useVenueStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVenueForDetails, setSelectedVenueForDetails] = useState<IVenue | null>(null);

    useEffect(() => {
        if (availableVenues.length === 0) {
            loadVenues();
        }
    }, [availableVenues.length, loadVenues]);

    const detailedVenueItems: DetailedVenueCartItem[] = selectedVenues.map((venue) => ({
        id: venue._id || '',
        title: venue.name,
        category: 'venues',
        price: venue.pricePerDay || venue.pricePerHour || 0,
        hourlyPrice: venue.pricePerHour,
        image: venue.images?.[0] || '/placeholder-venue.jpg',
        description: venue.description || '',
        quantity: 1,
        duration: '1 день',
        location: venue.address || 'Локація',
        eventTypes: venue.eventTypes || [],
        paymentType: venue.pricePerHour ? 'hourly' : 'full',
        hours: venue.pricePerHour ? 1 : undefined,
        fullDetails: venue,
        clientDescription: venue.clientDescription || ''
    }));

    const handleDetailsClick = (item: CartItem, fullDetails?: IVenue) => {
        if (fullDetails) {
            setSelectedVenueForDetails(fullDetails);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVenueForDetails(null);
    };

    const handleRemove = (id: string) => {
        const venueToRemove = selectedVenues.find(venue => venue._id === id);
        if (venueToRemove) {
            toggleSelectedVenue(venueToRemove);
        }
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        // Для локацій не потрібно оновлювати кількість
    };

    return (
        <motion.div
            key="venues"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-2xl font-semibold mb-6">Ваші вибрані локації</h1>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {detailedVenueItems.map((item) => (
                        <VenueTabItem
                            key={item.id}
                            item={item}
                            fullDetails={item.fullDetails}
                            onDetailsClick={handleDetailsClick}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={() => handleRemove(item.id)}
                            onUpdateClientDescription={(description) => updateVenueDescription(item.id, description)}
                        />
                    ))}
                </AnimatePresence>

                {detailedVenueItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 p-8"
                    >
                        Немає вибраних локацій.
                    </motion.div>
                )}
            </div>

            <VenueDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                venue={selectedVenueForDetails}
            />
        </motion.div>
    );
};

export default VenuesTab;
