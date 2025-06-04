import { type FC, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { type ServiceCategory } from '@/types/services';

interface CategoryItemProps {
    id: ServiceCategory;
    icon: ReactElement | null;
    label: string;
    isActive: boolean;
    count?: number;
    index: number;
    onClick: (id: ServiceCategory) => void;
}

const CategoryItem: FC<CategoryItemProps> = ({
    id,
    icon,
    label,
    isActive,
    count,
    index,
    onClick,
}) => {
    return (
        <motion.button
            key={id}
            onClick={() => onClick(id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive
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
            <div className="flex items-center gap-3">
                {icon && icon}
                <span>{label}</span>
            </div>
            <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full">
                {count}
            </span>
        </motion.button>
    );
};

export default CategoryItem; 