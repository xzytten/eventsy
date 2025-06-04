import { create } from 'zustand';
import { type IVenue } from '@/types/venue';
import { venueService } from '@/services/venueService';

interface VenueState {
    venues: IVenue[];
    isLoading: boolean;
    error: string | null;
    selectedVenues: IVenue[];
    loadVenues: () => Promise<void>;
    selectVenue: (venue: IVenue) => void;
    removeVenue: (venueId: string) => void;
    clearSelectedVenues: () => void;
}

const localStorageKey = 'selectedVenues';

// Helper to save selected venues to local storage
const saveSelectedVenues = (venues: IVenue[]) => {
    localStorage.setItem(localStorageKey, JSON.stringify(venues));
};

// Helper to load selected venues from local storage
const loadSelectedVenues = (): IVenue[] => {
    const savedVenues = localStorage.getItem(localStorageKey);
    return savedVenues ? JSON.parse(savedVenues) : [];
};

export const useVenueStore = create<VenueState>((set, get) => ({
    venues: [],
    isLoading: false,
    error: null,
    selectedVenues: loadSelectedVenues(),

    loadVenues: async () => {
        const { venues, isLoading } = get();
        // If already loading or data exists, do nothing
        if (isLoading || venues.length > 0) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const venuesData = await venueService.getAll();
            set({ venues: venuesData, isLoading: false });
        } catch (error) {
            set({ 
                error: 'Помилка завантаження локацій', 
                isLoading: false 
            });
            console.error('Помилка завантаження локацій:', error);
        }
    },

    selectVenue: (venue) => {
        const selectedVenues = get().selectedVenues;
        // Allow only one venue to be selected
        if (selectedVenues.some(v => v._id === venue._id)) {
             // If already selected, do nothing (or could toggle off)
             return;
        }
        const newSelectedVenues = [venue]; // Select only the new one
        set({ selectedVenues: newSelectedVenues });
        saveSelectedVenues(newSelectedVenues);
    },

    removeVenue: (venueId) => {
        const selectedVenues = get().selectedVenues;
        const newSelectedVenues = selectedVenues.filter(v => v._id !== venueId);
        set({ selectedVenues: newSelectedVenues });
        saveSelectedVenues(newSelectedVenues);
    },

    clearSelectedVenues: () => {
        set({ selectedVenues: [] });
        saveSelectedVenues([]);
    },
})); 