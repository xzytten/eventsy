import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IPhotographer } from '@/types/photographer';
import { photographerService } from '@/services/photographerService';

interface PhotographerState {
  photographers: IPhotographer[];
  isLoading: boolean;
  error: string | null;
  selectedPhotographers: IPhotographer[];
  loadPhotographers: () => Promise<void>;
  toggleSelectedPhotographer: (photographer: IPhotographer) => void;
  clearSelectedPhotographers: () => void;
  resetPhotographerState: () => void;
  updatePhotographerDescription: (photographerId: string, description: string) => void;
  removePhotographer: (photographerId: string) => void;
  updatePhotographerPaymentType: (photographerId: string, paymentType: 'full' | 'hourly') => void;
  updatePhotographerHours: (photographerId: string, hours: number) => void;
}

const usePhotographerStore = create<PhotographerState>()(
  persist(
    (set, get) => ({
      photographers: [],
      isLoading: false,
      error: null,
      selectedPhotographers: [],

      loadPhotographers: async () => {
        const { photographers, isLoading } = get();
        if (isLoading || photographers.length > 0) return;

        set({ isLoading: true, error: null });
        try {
          const data = await photographerService.getAll();
          set({ photographers: data, isLoading: false });
        } catch (error) {
          set({ error: 'Помилка завантаження фотографів', isLoading: false });
          console.error('Помилка завантаження фотографів:', error);
        }
      },

      updatePhotographerDescription: (photographerId, description) => {
        set((state) => {
          const updated = state.selectedPhotographers.map(p =>
            p._id === photographerId ? { ...p, clientDescription: description } : p
          );
          return { selectedPhotographers: updated };
        });
      },

      removePhotographer: (photographerId) => {
        set((state) => {
          const updated = state.selectedPhotographers.filter(p => p._id !== photographerId);
          return { selectedPhotographers: updated };
        });
      },

      toggleSelectedPhotographer: (photographer) => {
        const { selectedPhotographers } = get();
        const id = photographer._id;
        if (!id) {
          console.error('Photographer is missing an _id:', photographer);
          return;
        }

        const isSelected = selectedPhotographers.some(p => p._id === id);
        const updated = isSelected
          ? selectedPhotographers.filter(p => p._id !== id)
          : [...selectedPhotographers, photographer];

        set({ selectedPhotographers: updated });
      },

      clearSelectedPhotographers: () => {
        set({ selectedPhotographers: [] });
      },

      resetPhotographerState: () => {
        set({ photographers: [], selectedPhotographers: [] });
        localStorage.removeItem('photographer-storage');
        console.log('Photographer store state and localStorage cleared.');
      },

      updatePhotographerPaymentType: (photographerId, paymentType) => {
        set((state) => {
          const updated = state.selectedPhotographers.map(photographer =>
            photographer._id === photographerId
              ? {
                  ...photographer,
                  paymentType,
                  hours: paymentType === 'hourly' ? photographer.pricePerHour || 1 : undefined
                }
              : photographer
          );
          return { selectedPhotographers: updated };
        });
      },

      updatePhotographerHours: (photographerId, hours) => {
        set((state) => {
          const updated = state.selectedPhotographers.map(photographer =>
            photographer._id === photographerId ? { ...photographer, hours } : photographer
          );
          return { selectedPhotographers: updated };
        });
      }
    }),
    {
      name: 'photographer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedPhotographers: state.selectedPhotographers
      })
    }
  )
);

export default usePhotographerStore;