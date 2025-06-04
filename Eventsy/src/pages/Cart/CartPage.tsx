import { type FC, useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useServiceStore } from '@/store/serviceStore';
import { type ServiceCategory } from '@/types/services';
import Categories from '@/components/categories/Categories';
import { categories as allCategories } from '@/constants/categories';
import { useAnimatorStore } from '@/store/animatorStore';
import AnimatorsTab from './AnimatorsTab';
import PhotographersTab from './PhotographersTab';
import FoodTab from './FoodTab';
import MusicTab from './MusicTab';
import VenuesTab from './VenuesTab';
import CheckoutTab from './CheckoutTab';
import VehiclesTab from './VehiclesTab';

type CartCategory = Exclude<ServiceCategory, 'all'> | 'checkout';

const CartPage: FC = () => {
    // State for category filtering
    const [activeCategory, setActiveCategory] = useState<CartCategory>('food');

    // Filter categories to exclude 'all' and add 'checkout'
    const categoriesForTabs = useMemo(() => {
        const serviceCategories = allCategories.filter(category => category.id !== 'all');
        return [
            ...serviceCategories,
            { id: 'checkout' as CartCategory, icon: <ArrowRight size={20} />, label: 'Оформити замовлення' } as any
        ];
    }, [allCategories]);

    // Render the appropriate tab component based on activeCategory
    const renderTabContent = () => {
        switch (activeCategory) {
            case 'animators':
                return <AnimatorsTab />;
            case 'photographers':
                return <PhotographersTab />;
            case 'vehicles':
                return <VehiclesTab />;
            case 'food':
                return <FoodTab />;
            case 'music':
                return <MusicTab />;
            case 'venues':
                return <VenuesTab />;
            case 'checkout':
                return <CheckoutTab />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex gap-8">
                {/* Бокове меню з категоріями та вкладкою оформлення */}
                <div className="w-64 shrink-0 sticky top-4 h-fit">
                    <motion.div 
                        className="bg-black-30 rounded-xl p-4 space-y-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.2
                        }}
                    >
                        {/* Категорії та вкладка оформлення */}
                        <Categories
                            categories={categoriesForTabs as any}
                            activeCategory={activeCategory as ServiceCategory}
                            onCategoryChange={setActiveCategory as (category: ServiceCategory) => void}
                        />
                    </motion.div>
                </div>

                {/* Основний контент */}
                <div className="flex-1">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default CartPage; 