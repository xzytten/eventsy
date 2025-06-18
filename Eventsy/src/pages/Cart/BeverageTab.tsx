import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BeverageTabItem from '@/components/Beverage/BeverageTabItem';
import useBeverageStore from '@/store/beverageStore';
import type { IBeverage } from '@/types/beverage';
import type { CartItem } from '@/types/cart';
import BeverageDetailsModal from '@/components/Beverage/BeverageDetailsModal';

interface DetailedBeverageCartItem extends CartItem {
    fullDetails?: IBeverage;
}

const BeveragesTab: FC = () => {
    const {
        beverages: availableBeverages,
        selectedBeverages,
        loadBeverages,
        toggleSelectedBeverage,
        removeBeverage,
        updateBeverageDescription,
        updateBeverageQuantity
    } = useBeverageStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBeverageForDetails, setSelectedBeverageForDetails] = useState<IBeverage | null>(null);

    useEffect(() => {
        if (availableBeverages.length === 0) {
            loadBeverages();
        }
    }, [availableBeverages.length, loadBeverages]);

    const detailedBeverageItems: DetailedBeverageCartItem[] = selectedBeverages.map((bev) => ({
        id: bev.name, // або інший унікальний ідентифікатор
        title: bev.name,
        category: 'beverages',
        price: bev.totalPrice,
        images: bev.images || ['/placeholder-beverage.jpg'],
        eventTypes: bev.eventTypes || [],
        quantity: 'quantity' in bev && typeof bev.quantity === 'number' ? bev.quantity : 1,
        duration: '1 день',
        location: 'Київ',
        paymentType: 'full',
        description: bev.description || '',
        clientDescription: '',
        fullDetails: bev
    }));

    console.log('BeveragesTab debug:', {
        selectedBeverages: selectedBeverages.length,
        detailedBeverageItems: detailedBeverageItems.length,
        selectedBeveragesData: selectedBeverages
    });

    const handleDetailsClick = (item: CartItem, fullDetails?: IBeverage) => {
        if (fullDetails) {
            setSelectedBeverageForDetails(fullDetails);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBeverageForDetails(null);
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        updateBeverageQuantity(id, quantity);
    };

    const handleRemove = (id: string) => {
        removeBeverage(id);
    };

    return (
        <motion.div
            key="beverages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-2xl font-semibold mb-6">Ваші вибрані напої</h1>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {detailedBeverageItems.map((item) => (
                        <BeverageTabItem
                            key={item.id}
                            item={item}
                            fullDetails={item.fullDetails}
                            onDetailsClick={handleDetailsClick}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={() => handleRemove(item.id)}
                            onUpdateClientDescription={(description) => updateBeverageDescription(item.id, description)}
                        />
                    ))}
                </AnimatePresence>

                {detailedBeverageItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 p-8"
                    >
                        Немає вибраних напоїв.
                    </motion.div>
                )}
            </div>

            <BeverageDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                beverage={selectedBeverageForDetails}
            />
           
        </motion.div>
    );
};

export default BeveragesTab; 