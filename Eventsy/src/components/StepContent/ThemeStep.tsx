import { type FC } from 'react';
import { motion } from 'framer-motion';
import { type EventType, EVENT_TYPES, EVENT_TYPE_NAMES } from '@/constants/types';

interface ThemeStepProps {
    eventType: EventType | null;
    onThemeChange: (type: EventType) => void;
}

const ThemeStep: FC<ThemeStepProps> = ({ eventType, onThemeChange }) => {
    console.log('ThemeStep rendered');
    console.log('Current eventType:', eventType);
    console.log('EVENT_TYPES:', EVENT_TYPES);
    console.log('EVENT_TYPE_NAMES:', EVENT_TYPE_NAMES);

    const handleThemeClick = (type: EventType) => {
        console.log('Theme clicked:', type);
        onThemeChange(type);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EVENT_TYPES.map((type) => (
                <motion.button
                    key={type}
                    onClick={() => handleThemeClick(type)}
                    className={`p-6 rounded-xl bg-black-30 hover:bg-black-40 transition-colors ${
                        eventType === type ? 'ring-2 ring-coral' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <h3 className="text-xl font-semibold mb-2">{EVENT_TYPE_NAMES[type]}</h3>
                    <p className="text-muted">Опишіть тип вашої події</p>
                </motion.button>
            ))}
        </div>
    );
};

export default ThemeStep; 