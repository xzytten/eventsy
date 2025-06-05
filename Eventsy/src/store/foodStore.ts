import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IFood } from '@/types/food';
import { foodService } from '@/services/foodService';

interface FoodState {
  food: IFood[];
  isLoading: boolean;
  error: string | null;
  selectedFood: IFood[];
  loadFood: () => Promise<void>;
  toggleSelectedFood: (foodItem: IFood) => void;
  clearSelectedFood: () => void;
  resetFoodState: () => void;
  updateFoodDescription: (foodId: string, description: string) => void;
}

const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      // Initial state
      food: [],
      isLoading: false,
      error: null,
      selectedFood: [],

      // Actions
      loadFood: async () => {
        const { food, isLoading } = get();
        // If already loading or data exists, do nothing
        if (isLoading || food.length > 0) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
          const foodData = await foodService.getAll();
          set({ food: foodData, isLoading: false });
        } catch (error) {
          set({ 
            error: 'Помилка завантаження їжі', 
            isLoading: false 
          });
          console.error('Помилка завантаження їжі:', error);
        }
      },

      updateFoodDescription: (foodId: string, description: string) => {
        console.log('Updating food description:', { foodId, description });
        
        set((state) => {
          // Оновлюємо опис в selectedFood
          const updatedSelectedFood = state.selectedFood.map(food => {
            if (food._id === foodId) {
              const updatedFood = { ...food, clientDescription: description };
              console.log(updatedFood)
              console.log('Updated food item:', updatedFood);
              return updatedFood;
            }
            return food;
          });

          // Отримуємо поточний стан з localStorage
          const storedData = localStorage.getItem('food-storage');
          let storedState = storedData ? JSON.parse(storedData) : { state: { selectedFood: [] } };

          // Оновлюємо clientDescription в збереженому стані
          storedState.state.selectedFood = updatedSelectedFood;

          // Зберігаємо оновлений стан назад в localStorage
          localStorage.setItem('food-storage', JSON.stringify(storedState));

          return { 
            selectedFood: updatedSelectedFood
          };
        });
      },

      toggleSelectedFood: (foodItem: IFood) => {
        const { selectedFood } = get();
        const foodId = foodItem._id;

        if (!foodId) {
            console.error('Food item is missing an _id:', foodItem);
            return;
        }

        const isSelected = selectedFood.some(item => item._id === foodId);
        let newSelectedFood;

        if (isSelected) {
          newSelectedFood = selectedFood.filter(item => item._id !== foodId);
        } else {
          // При додаванні нової їжі, зберігаємо її з поточним clientDescription
          const existingFood = selectedFood.find(item => item._id === foodId);
          newSelectedFood = [...selectedFood, {
            ...foodItem,
            clientDescription: existingFood?.clientDescription || ''
          }];
        }

        set({ selectedFood: newSelectedFood });
      },

      clearSelectedFood: () => {
        set({ selectedFood: [] });
      },

      resetFoodState: () => {
        set({ food: [], selectedFood: [] });
        // Explicitly remove the key from localStorage managed by this store
        localStorage.removeItem('food-storage');
        console.log('Food store state and localStorage cleared.');
      },
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedFood: state.selectedFood
      })
    }
  )
);

export default useFoodStore;
