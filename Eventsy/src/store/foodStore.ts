import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IFood } from '@/types/food';
import { foodService } from '@/services/foodService';
import { useCartStore } from '@/store/cartStore';
import { type CartItem } from '@/types/cart';

interface FoodState {
  food: IFood[];
  isLoading: boolean;
  error: string | null;
  selectedFoodIds: string[];
  foodDescriptions: Record<string, string>;
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
      selectedFoodIds: [],
      foodDescriptions: {},

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
          const newDescriptions = {
            ...state.foodDescriptions,
            [foodId]: description
          };
          
          // Оновлюємо опис в кошику
          const cartStore = useCartStore.getState();
          const cartItem = cartStore.items.find(item => item.id === foodId);
          if (cartItem) {
            cartStore.updateDescription(foodId, description);
          }
          
          return { foodDescriptions: newDescriptions };
        });
      },

      toggleSelectedFood: (foodItem: IFood) => {
        const selectedIds = get().selectedFoodIds;
        const foodId = foodItem._id;

        if (!foodId) {
            console.error('Food item is missing an _id:', foodItem);
            return; // Exit if no ID
        }

        const isSelected = selectedIds.includes(foodId);
        let newSelectedIds;

        if (isSelected) {
          newSelectedIds = selectedIds.filter(id => id !== foodId);
        } else {
          newSelectedIds = [...selectedIds, foodId];
        }

        set({ selectedFoodIds: newSelectedIds });

        // Create a CartItem representation and toggle it in cartStore
        const cartItem: CartItem = {
            id: foodId,
            title: foodItem.name || foodItem.type || 'Їжа',
            category: 'food',
            price: foodItem.price || foodItem.totalPrice,
            image: foodItem.images?.[0] || '/placeholder-food.jpg',
            eventTypes: foodItem.eventTypes || [],
            quantity: 1,
            duration: '1 день',
            location: 'Київ',
            paymentType: 'full',
            description: get().foodDescriptions[foodId] || ''
        };

        useCartStore.getState().toggleCartItem(cartItem);
      },

      clearSelectedFood: () => {
        set({ selectedFoodIds: [], foodDescriptions: {} });
        // Clear corresponding items from the cart in cartStore
        const currentCartItems = useCartStore.getState().items;
        const foodCartItems = currentCartItems.filter((item: CartItem) => item.category === 'food');
        foodCartItems.forEach((item: CartItem) => useCartStore.getState().removeFromCart(item.id));
      },

      resetFoodState: () => {
        set({ food: [], selectedFoodIds: [], foodDescriptions: {} });
        // Explicitly remove the key from localStorage managed by this store
        localStorage.removeItem('food-storage');
        console.log('Food store state and localStorage cleared.');
        // Also ensure corresponding items are removed from the cart in cartStore
        const currentCartItems = useCartStore.getState().items;
        const foodCartItems = currentCartItems.filter((item: CartItem) => item.category === 'food');
        foodCartItems.forEach((item: CartItem) => useCartStore.getState().removeFromCart(item.id));
      },
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedFoodIds: state.selectedFoodIds,
        foodDescriptions: state.foodDescriptions
      })
    }
  )
);

export default useFoodStore;
