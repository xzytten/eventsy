import { create } from 'zustand';
import { type EventType } from '@/constants/types';
import { useAnimatorStore } from './animatorStore';

interface ServiceState {
    currentStep: number;
    eventType: EventType | null;
    setCurrentStep: (step: number) => void;
    setEventType: (type: EventType | null) => void;
    reset: () => void;
}

// Функція для збереження eventType в localStorage
const saveEventTypeToLocalStorage = (type: EventType | null) => {
    if (type) {
        localStorage.setItem('eventsy_event_type', type);
    } else {
        localStorage.removeItem('eventsy_event_type');
    }
};

// Функція для завантаження eventType з localStorage
const loadEventTypeFromLocalStorage = (): EventType | null => {
    if (typeof window === 'undefined') return null;
    const savedType = localStorage.getItem('eventsy_event_type');
    return savedType as EventType | null;
};

export const useServiceStore = create<ServiceState>((set, get) => {
    const initialEventType = loadEventTypeFromLocalStorage();

    return {
        currentStep: 0,
        eventType: initialEventType,

        setCurrentStep: (step: number) => {
            set({ currentStep: step });
        },

        setEventType: (type: EventType | null) => {
            const currentEventType = get().eventType;
            
            if (currentEventType !== type) {
                useAnimatorStore.getState().resetAnimatorState();
            }
            
            set({ eventType: type });
            saveEventTypeToLocalStorage(type);
        },

        reset: () => {
            set({
                currentStep: 0,
                eventType: null,
            });
            useAnimatorStore.getState().resetAnimatorState();
            saveEventTypeToLocalStorage(null);
        },
    };
}); 