import { create } from 'zustand';
import { type EventType } from '@/types/services';
import { useVenueStore } from './venueStore';
import { useVehicleStore } from './vehicleStore';
import { useAnimatorStore } from './animatorStore';
import useFoodStore from './foodStore';
import { type IFood } from '@/types/food';
import usePhotographerStore from './photographerStore';
import useBeverageStore from './beverageStore';

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

const loadEventTypeFromLocalStorage = (): EventType | null => {
    if (typeof window === 'undefined') return null;
    const savedType = localStorage.getItem('eventsy_event_type');

    const eventTypes: EventType[] = ['WEDDING', 'BIRTHDAY', 'CORPORATE', 'CONFERENCE', 'GRADUATION', 'BAPTISM', 'ANNIVERSARY', 'BANQUET', 'BUFFET', 'ANY_EVENT'];
    const isValidEventType = savedType && eventTypes.includes(savedType as EventType);
    
    
    if (isValidEventType) {
        return savedType as EventType;
    }

    return null;
};

const loadGeneralDescriptionFromLocalStorage = (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('cart-description') || '';
};


const loadEventDateFromLocalStorage = (): Date | null => {
    if (typeof window === 'undefined') return null;
    const savedDateString = localStorage.getItem('event-date');
    if (savedDateString) {

        const date = new Date(savedDateString);

        if (!isNaN(date.getTime())) {

            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        }
    }
    return null;
};

const useServiceStore = create<ServiceState>((set, get) => ({

    eventType: loadEventTypeFromLocalStorage(),
    venue: null,
    eventDate: loadEventDateFromLocalStorage(),
    generalDescription: loadGeneralDescriptionFromLocalStorage(),

    setEventType: (type: EventType | null) => {
        // console.log('setEventType called with:', type);
        set({ eventType: type });
    
        if (type) {
            localStorage.setItem('eventsy_event_type', type);
            // console.log('setEventType: Saved eventType to localStorage:', type);
        } else {
            localStorage.removeItem('eventsy_event_type');
            // console.log('setEventType: Removed eventsy_event_type from localStorage');
        }
     
        try {
            useAnimatorStore.getState().resetAnimatorState();
        } catch (e) {
            console.error('Failed to reset animator state:', e);
        }
        // console.log('setEventType: Service store state after update:', get());
    },
    setVenue: (venueId: string | null) => set({ venue: venueId }),
    setEventDate: (date: Date | null) => {
        set({ eventDate: date });
  
        if (date) {
             const year = date.getFullYear();
             const month = String(date.getMonth() + 1).padStart(2, '0'); 
             const day = String(date.getDate()).padStart(2, '0');
             const dateString = `${year}-${month}-${day}`;
            localStorage.setItem('event-date', dateString);
        } else {
            localStorage.removeItem('event-date');
        }
    },
    updateGeneralDescription: (description: string) => {
        set({ generalDescription: description });
       
        localStorage.setItem('cart-description', description);
    },

    getTotalPrice: () => {
        const venueStore = useVenueStore.getState();
        const vehicleStore = useVehicleStore.getState();
        const animatorStore = useAnimatorStore.getState();
        const foodStore = useFoodStore.getState();
        const photographerStore = usePhotographerStore.getState();
        const beverageStore = useBeverageStore.getState();

        let total = 0;

        // Add venue prices
        venueStore.selectedVenues.forEach(venue => {
            // Діагностика
            console.log('Venue in total:', venue);

            if (venue.paymentType === 'hourly' && venue.pricePerHour && venue.hours) {
                total += venue.pricePerHour * venue.hours;
            } else if (venue.paymentType === 'full' && venue.pricePerDay) {
                total += venue.pricePerDay;
            } else if (venue.pricePerHour && venue.hours) {
                total += venue.pricePerHour * venue.hours;
            } else if (venue.pricePerDay) {
                total += venue.pricePerDay;
            } else if (venue.pricePerHour) {
                total += venue.pricePerHour;
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

        // Add photographer prices
        photographerStore.selectedPhotographers.forEach(photographer => {
            if (photographer.paymentType === 'hourly' && photographer.pricePerHour && photographer.hours) {
                total += photographer.pricePerHour * photographer.hours;
            } else if (photographer.paymentType === 'full' && photographer.pricePerDay) {
                total += photographer.pricePerDay;
            } else if (photographer.pricePerHour && photographer.hours) {
                total += photographer.pricePerHour * photographer.hours;
            } else if (photographer.pricePerDay) {
                total += photographer.pricePerDay;
            } else if (photographer.pricePerHour) {
                total += photographer.pricePerHour;
            }
        });

        // Add food prices
        foodStore.selectedFood.forEach((food) => {
            if (food.price) {
                total += food.price * (food.quantity || 1);
            }
        });

        // Add beverage prices
        beverageStore.selectedBeverages.forEach((beverage) => {
            if (beverage.totalPrice) {
                if ('quantity' in beverage && typeof beverage.quantity === 'number') {
                    total += beverage.totalPrice * beverage.quantity;
                } else {
                    total += beverage.totalPrice;
                }
            }
        });

        return total;
    },

    resetServiceState: () => set({
        eventType: loadEventTypeFromLocalStorage(),
        venue: null,
        eventDate: loadEventDateFromLocalStorage(), 
        generalDescription: loadGeneralDescriptionFromLocalStorage(),
    }),
}));

export { useServiceStore }; 