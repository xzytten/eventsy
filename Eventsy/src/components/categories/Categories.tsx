import { type FC, type ReactElement } from 'react';
import { type ServiceCategory } from '@/types/services';
import CategoryItem from './CategoryItem';

interface Category {
    readonly id: ServiceCategory;
    readonly icon: ReactElement | null;
    readonly label: string;
}

interface CategoriesProps {
    categories: readonly Category[];
    activeCategory: ServiceCategory;
    categoryCounts?: Record<ServiceCategory, number>;
    onCategoryChange: (category: ServiceCategory) => void;
}

const Categories: FC<CategoriesProps> = ({
    categories,
    activeCategory,
    categoryCounts,
    onCategoryChange,
}) => {
    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Категорії</h3>
            {categories.map(({ id, icon, label }, index) => (
                <CategoryItem
                    key={id}
                    id={id}
                    icon={icon}
                    label={label}
                    isActive={activeCategory === id}
                    // count={categoryCounts[id]}
                    index={index}
                    onClick={onCategoryChange}
                />
            ))}
        </div>
    );
};

export default Categories; 