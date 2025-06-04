import { create } from 'zustand';
import type { IVehicle } from '@/types/vehicle';
import { vehicleService } from '@/services/vehicleService';
import { useCartStore } from '@/store/cartStore';
import { type CartItem } from '@/types/cart';

interface VehicleState {
  vehicles: IVehicle[];
  isLoading: boolean;
  error: string | null;
  selectedVehicles: IVehicle[];
  loadVehicles: () => Promise<void>;
  selectVehicle: (vehicle: IVehicle) => void;
  removeVehicle: (vehicleId: string) => void;
  clearSelectedVehicles: () => void;
}

const localStorageKey = 'selectedVehicles';

// Helper to save selected vehicles to local storage
const saveSelectedVehicles = (vehicles: IVehicle[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(vehicles));
};

// Helper to load selected vehicles from local storage
const loadSelectedVehicles = (): IVehicle[] => {
  const savedVehicles = localStorage.getItem(localStorageKey);
  return savedVehicles ? JSON.parse(savedVehicles) : [];
};

// Helper to map IVehicle to CartItem
const mapVehicleToCartItem = (vehicle: IVehicle): CartItem => ({
  id: vehicle._id || '',
  title: vehicle.name,
  description: vehicle.description || '',
  price: vehicle.pricePerDay,
  hourlyPrice: vehicle.pricePerHour,
  duration: '1 день',
  location: `${vehicle.brand} ${vehicle.model}`,
  image: vehicle.images[0] || '',
  eventTypes: vehicle.eventTypes || [],
  category: 'vehicles',
  quantity: 1,
  paymentType: vehicle.pricePerHour ? 'hourly' : 'full',
  hours: vehicle.pricePerHour ? 1 : undefined
});

export const useVehicleStore = create<VehicleState>((set, get) => ({
  // Initial state
  vehicles: [],
  isLoading: false,
  error: null,
  selectedVehicles: loadSelectedVehicles(),

  // Actions
  loadVehicles: async () => {
    const { vehicles, isLoading } = get();
    // If already loading or data exists, do nothing
    if (isLoading || vehicles.length > 0) {
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const vehicleData = await vehicleService.getAll();
      set({ vehicles: vehicleData, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Помилка завантаження транспорту', 
        isLoading: false 
      });
      console.error('Помилка завантаження транспорту:', error);
    }
  },

  selectVehicle: (vehicle) => {
    const selectedVehicles = get().selectedVehicles;
    const isSelected = selectedVehicles.some(v => v._id === vehicle._id);

    if (isSelected) {
      // If already selected, remove it
      const newSelectedVehicles = selectedVehicles.filter(v => v._id !== vehicle._id);
      set({ selectedVehicles: newSelectedVehicles });
      saveSelectedVehicles(newSelectedVehicles);
      useCartStore.getState().toggleCartItem(mapVehicleToCartItem(vehicle));
    } else {
      // If not selected, add it
      const newSelectedVehicles = [...selectedVehicles, vehicle];
      set({ selectedVehicles: newSelectedVehicles });
      saveSelectedVehicles(newSelectedVehicles);
      useCartStore.getState().toggleCartItem(mapVehicleToCartItem(vehicle));
    }
  },

  removeVehicle: (vehicleId) => {
    const selectedVehicles = get().selectedVehicles;
    const newSelectedVehicles = selectedVehicles.filter(v => v._id !== vehicleId);
    set({ selectedVehicles: newSelectedVehicles });
    saveSelectedVehicles(newSelectedVehicles);
  },

  clearSelectedVehicles: () => {
    set({ selectedVehicles: [] });
    saveSelectedVehicles([]);
  },
}));
