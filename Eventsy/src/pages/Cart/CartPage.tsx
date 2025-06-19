import { type FC, useState, useMemo, } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { type ServiceCategory } from '@/types/services';
import Categories from '@/components/categories/Categories';
import { categories as allCategories } from '@/constants/categories';
import AnimatorsTab from './AnimatorsTab';
import FoodTab from './FoodTab';
import MusicTab from './MusicTab';
import VenuesTab from './VenuesTab';
import CheckoutTab from './CheckoutTab';
import VehiclesTab from './VehiclesTab';
import PhotographerTab from './PhotographerTab';
import BeveragesTab from './BeverageTab';

type CartCategory = Exclude<ServiceCategory, 'all'> | 'checkout';

const CartPage: FC = () => {

    const [activeCategory, setActiveCategory] = useState<CartCategory>('food');
    const [openMenu, setOpenMenu] = useState(false);

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
                return <PhotographerTab />;
            case 'vehicles':
                return <VehiclesTab />;
            case 'food':
                return <FoodTab />;
            case 'music':
                return <MusicTab />;
            case 'venues':
                return <VenuesTab />;
            case 'beverages':
                return <BeveragesTab />;
            case 'checkout':
                return <CheckoutTab />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex gap-8">
                {/* Desktop menu */}
                <div className="w-64 shrink-0 sticky top-4 h-fit hidden md:block">
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
                        <Categories
                            categories={categoriesForTabs as any}
                            activeCategory={activeCategory as ServiceCategory}
                            onCategoryChange={setActiveCategory as (category: ServiceCategory) => void}
                        />
                    </motion.div>
                </div>
                {/* Mobile hamburger */}
                <div className="md:hidden flex flex-col">
                    <button
                        className="mb-4 text-white self-start"
                        onClick={() => setOpenMenu(true)}
                        aria-label="Відкрити меню категорій"
                    >
                        <Menu size={32} />
                    </button>
                    {openMenu && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
                            <button
                                className="absolute top-6 right-6 text-white"
                                onClick={() => setOpenMenu(false)}
                                aria-label="Закрити меню категорій"
                            >
                                <X size={36} />
                            </button>
                            <div className="w-11/12 max-w-xs bg-black-30 rounded-xl p-6 space-y-4">
                                <Categories
                                    categories={categoriesForTabs as any}
                                    activeCategory={activeCategory as ServiceCategory}
                                    onCategoryChange={(cat) => {
                                        setActiveCategory(cat as CartCategory);
                                        setOpenMenu(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}
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