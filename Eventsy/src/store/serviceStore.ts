import { create } from 'zustand';
import { type EventType } from '@/types/services';
import { useVenueStore } from './venueStore';
import { useVehicleStore } from './vehicleStore';
import { useAnimatorStore } from './animatorStore';
import useFoodStore from './foodStore';
import { type IFood } from '@/types/food';

interface ServiceState {
    eventType: EventType | null;
    venue: string | null;
    eventDate: Date | null;
    generalDescription: string;
    setEventType: (type: EventType | null) => void;
    setVenue: (venue: string | null) => void;
    setEventDate: (date: Date | null) => void;
    updateGeneralDescription: (description: string) => void;
    getTotalPrice: () => number;
    resetServiceState: () => void;
}

// Функція для завантаження eventType з localStorage при ініціалізації
const loadEventTypeFromLocalStorage = (): EventType | null => {
    if (typeof window === 'undefined') return null;
    const savedType = localStorage.getItem('eventsy_event_type');
    // console.log('loadEventTypeFromLocalStorage: raw localStorage value:', savedType);
    
    // Перевіряємо, чи збережене значення є одним з допустимих типів EventType
    const eventTypes: EventType[] = ['WEDDING', 'BIRTHDAY', 'CORPORATE', 'CONFERENCE', 'GRADUATION', 'BAPTISM', 'ANNIVERSARY', 'BANQUET', 'BUFFET', 'ANY_EVENT'];
    const isValidEventType = savedType && eventTypes.includes(savedType as EventType);
    
    // console.log('loadEventTypeFromLocalStorage: is value valid EventType?', isValidEventType);
    
    if (isValidEventType) {
        // console.log('loadEventTypeFromLocalStorage: Valid EventType loaded:', savedType);
        return savedType as EventType;
    }
    // console.log('loadEventTypeFromLocalStorage: No valid EventType found in localStorage or value is not in valid list. Returning null.');
    return null;
};

// Функція для завантаження generalDescription з localStorage
const loadGeneralDescriptionFromLocalStorage = (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('cart-description') || '';
};

const useServiceStore = create<ServiceState>((set, get) => ({
    // Ініціалізуємо eventType та generalDescription з localStorage
    eventType: loadEventTypeFromLocalStorage(),
    venue: null,
    eventDate: null,
    generalDescription: loadGeneralDescriptionFromLocalStorage(),

    setEventType: (type: EventType | null) => {
        // console.log('setEventType called with:', type);
        set({ eventType: type });
        // Зберігаємо eventType в localStorage вручну
        if (type) {
            localStorage.setItem('eventsy_event_type', type);
            // console.log('setEventType: Saved eventType to localStorage:', type);
        } else {
            localStorage.removeItem('eventsy_event_type');
            // console.log('setEventType: Removed eventsy_event_type from localStorage');
        }
        // Скидаємо стан аніматорів при зміні типу події (якщо це необхідно)
        try {
            useAnimatorStore.getState().resetAnimatorState();
        } catch (e) {
            console.error('Failed to reset animator state:', e);
        }
        // console.log('setEventType: Service store state after update:', get());
    },
    setVenue: (venueId: string | null) => set({ venue: venueId }),
    setEventDate: (date: Date | null) => set({ eventDate: date }),
    updateGeneralDescription: (description: string) => {
        set({ generalDescription: description });
        // Зберігаємо generalDescription в localStorage вручну
        localStorage.setItem('cart-description', description);
    },

    getTotalPrice: () => {
        const venueStore = useVenueStore.getState();
        const vehicleStore = useVehicleStore.getState();
        const animatorStore = useAnimatorStore.getState();
        const foodStore = useFoodStore.getState();

        let total = 0;

        // Add venue prices
        venueStore.selectedVenues.forEach(venue => {
            if (venue.paymentType === 'hourly' && venue.pricePerHour && venue.hours) {
                total += venue.pricePerHour * venue.hours;
            } else if (venue.pricePerDay) {
                total += venue.pricePerDay;
            }
        });

        // Add vehicle prices
        vehicleStore.selectedVehicles.forEach(vehicle => {
            if (vehicle.paymentType === 'hourly' && vehicle.pricePerHour && vehicle.hours) {
                total += vehicle.pricePerHour * vehicle.hours;
            } else if (vehicle.pricePerDay) {
                total += vehicle.pricePerDay;
            }
        });

        // Add animator prices
        animatorStore.selectedAnimators.forEach(animator => {
            if (animator.paymentType === 'hourly' && animator.pricePerHour && animator.hours) {
                total += animator.pricePerHour * animator.hours;
            } else if (animator.pricePerDay) {
                total += animator.pricePerDay;
            }
        });

        // Add food prices
        foodStore.selectedFood.forEach((food: IFood) => {
            if (food.price) {
                total += food.price * (food.quantity || 1);
            }
        });

        return total;
    },

    resetServiceState: () => set({
        eventType: loadEventTypeFromLocalStorage(), // Зберігаємо eventType при скиданні
        venue: null,
        eventDate: null,
        generalDescription: loadGeneralDescriptionFromLocalStorage(), // Зберігаємо generalDescription при скиданні
    }),
}));

export { useServiceStore }; 