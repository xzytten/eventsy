import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IBeverage } from '@/types/beverage';
import { beverageService } from '@/services/beverageService';

interface BeverageState {
  beverages: IBeverage[];
  isLoading: boolean;
  error: string | null;
  selectedBeverages: IBeverage[];
  loadBeverages: () => Promise<void>;
  toggleSelectedBeverage: (beverage: IBeverage) => void;
  clearSelectedBeverages: () => void;
  resetBeverageState: () => void;
  updateBeverageDescription: (id: string, description: string) => void;
  updateBeverageQuantity: (id: string, quantity: number) => void;
  removeBeverage: (id: string) => void;
}

const useBeverageStore = create<BeverageState>()(
  persist(
    (set, get) => ({
      beverages: [],
      isLoading: false,
      error: null,
      selectedBeverages: [],

      loadBeverages: async () => {
        const { beverages, isLoading } = get();
        if (isLoading || beverages.length > 0) return;

        set({ isLoading: true, error: null });
        try {
          const data = await beverageService.getAll();
          set({ beverages: data, isLoading: false });
        } catch (error) {
          set({ error: 'Помилка завантаження напоїв', isLoading: false });
          console.error('Помилка завантаження напоїв:', error);
        }
      },

      updateBeverageDescription: (id, description) => {
        set((state) => {
          const updated = state.selectedBeverages.map(item =>
            item.name === id ? { ...item, description } : item
          );
          localStorage.setItem('beverage-storage', JSON.stringify({ state: { selectedBeverages: updated } }));
          return { selectedBeverages: updated };
        });
      },

      updateBeverageQuantity: (id, quantity) => {
        set((state) => {
          const updated = state.selectedBeverages.map(item =>
            item.name === id ? { ...item, quantity } : item
          );
          localStorage.setItem('beverage-storage', JSON.stringify({ state: { selectedBeverages: updated } }));
          return { selectedBeverages: updated };
        });
      },

      removeBeverage: (id) => {
        set((state) => {
          const updated = state.selectedBeverages.filter(item => item.name !== id);
          localStorage.setItem('beverage-storage', JSON.stringify({ state: { selectedBeverages: updated } }));
          return { selectedBeverages: updated };
        });
      },

      toggleSelectedBeverage: (beverage) => {
        const { selectedBeverages } = get();
        const isSelected = selectedBeverages.some(item => item.name === beverage.name);
        const updated = isSelected
          ? selectedBeverages.filter(item => item.name !== beverage.name)
          : [...selectedBeverages, { ...beverage, quantity: 1 }];

        set({ selectedBeverages: updated });
      },

      clearSelectedBeverages: () => set({ selectedBeverages: [] }),

      resetBeverageState: () => {
        set({ beverages: [], selectedBeverages: [] });
        localStorage.removeItem('beverage-storage');
        console.log('Стан напоїв очищено.');
      },
    }),
    {
      name: 'beverage-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedBeverages: state.selectedBeverages
      })
    }
  )
);

export default useBeverageStore;
