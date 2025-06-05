import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IVenue } from '@/types/venue';
import { venueService } from '@/services/venueService';
import { type CartItem } from '@/types/cart';

interface VenueState {
    venues: IVenue[];
    isLoading: boolean;
    isLoaded: boolean;
    error: string | null;
    selectedVenues: IVenue[];
    loadVenues: () => Promise<void>;
    toggleSelectedVenue: (venue: IVenue) => void;
    updateVenueDescription: (id: string, description: string) => void;
    updateVenuePaymentType: (id: string, paymentType: 'full' | 'hourly') => void;
    updateVenueHours: (id: string, hours: number) => void;
    removeVenue: (id: string) => void;
    clearSelectedVenues: () => void;
    selectVenue: (venue: IVenue) => void;
}

const localStorageKey = 'venue-storage';

// Helper to save selected venues to local storage
const saveSelectedVenues = (venues: IVenue[]) => {
    localStorage.setItem(localStorageKey, JSON.stringify(venues));
};

// Helper to load selected venues from local storage
const loadSelectedVenues = (): IVenue[] => {
    const savedVenues = localStorage.getItem(localStorageKey);
    return savedVenues ? JSON.parse(savedVenues) : [];
};

const useVenueStore = create<VenueState>()(
    persist(
        (set, get) => ({
            venues: [],
            isLoading: false,
            isLoaded: false,
            error: null,
            selectedVenues: [],

            loadVenues: async () => {
                if (get().isLoading) return;

                set({ isLoading: true, error: null });
                try {
                    const response = await venueService.getAll();
                    set({
                        venues: response,
                        isLoading: false,
                        isLoaded: true
                    });
                } catch (error) {
                    set({
                        error: 'Помилка завантаження локацій',
                        isLoading: false,
                        isLoaded: false
                    });
                }
            },

            toggleSelectedVenue: (venue: IVenue) => {
                const { selectedVenues } = get();
                const isSelected = selectedVenues.some(v => v._id === venue._id);

                if (isSelected) {
                    const updatedVenues = selectedVenues.filter(v => v._id !== venue._id);
                    set({ selectedVenues: updatedVenues });
                } else {
                    const updatedVenues = [...selectedVenues, venue];
                    set({ selectedVenues: updatedVenues });
                }
            },

            updateVenueDescription: (id: string, description: string) => {
                const { selectedVenues } = get();
                const updatedVenues = selectedVenues.map(venue =>
                    venue._id === id
                        ? { ...venue, clientDescription: description }
                        : venue
                );
                set({ selectedVenues: updatedVenues });
            },

            updateVenuePaymentType: (id: string, paymentType: 'full' | 'hourly') => {
                const { selectedVenues } = get();
                const updatedVenues = selectedVenues.map(venue =>
                    venue._id === id
                        ? { ...venue, paymentType }
                        : venue
                );
                set({ selectedVenues: updatedVenues });
            },

            updateVenueHours: (id: string, hours: number) => {
                const { selectedVenues } = get();
                const updatedVenues = selectedVenues.map(venue =>
                    venue._id === id
                        ? { ...venue, hours }
                        : venue
                );
                set({ selectedVenues: updatedVenues });
            },

            removeVenue: (id: string) => {
                console.log('Store: Removing venue with ID:', id);
                const { selectedVenues } = get();
                console.log('Current selected venues:', selectedVenues);
                const updatedVenues = selectedVenues.filter(venue => venue._id !== id);
                console.log('Updated venues after removal:', updatedVenues);
                set({ selectedVenues: updatedVenues });
            },

            clearSelectedVenues: () => {
                set({ selectedVenues: [] });
            },

            selectVenue: (venue: IVenue) => {
                set({ selectedVenues: [venue] });
            }
        }),
        {
            name: 'venue-storage',
            partialize: (state) => ({
                selectedVenues: state.selectedVenues
            })
        }
    )
);

export { useVenueStore }; 