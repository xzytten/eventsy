import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IVehicle } from '@/types/vehicle';
import { vehicleService } from '@/services/vehicleService';
import { type CartItem } from '@/types/cart';

interface VehicleState {
  vehicles: IVehicle[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  selectedVehicles: IVehicle[];
  loadVehicles: () => Promise<void>;
  toggleSelectedVehicle: (vehicle: IVehicle) => void;
  updateVehicleDescription: (id: string, description: string) => void;
  clearSelectedVehicles: () => void;
}

const localStorageKey = 'vehicle-storage';

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

const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      isLoading: false,
      isLoaded: false,
      error: null,
      selectedVehicles: loadSelectedVehicles(),

      loadVehicles: async () => {
        if (get().isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const response = await vehicleService.getAll();
          set({
            vehicles: response,
            isLoading: false,
            isLoaded: true
          });
        } catch (error) {
          set({
            error: 'Помилка завантаження транспортних засобів',
            isLoading: false,
            isLoaded: false
          });
        }
      },

      toggleSelectedVehicle: (vehicle: IVehicle) => {
        const { selectedVehicles } = get();
        const isSelected = selectedVehicles.some(v => v._id === vehicle._id);

        if (isSelected) {
          set({
            selectedVehicles: selectedVehicles.filter(v => v._id !== vehicle._id)
          });
        } else {
          set({
            selectedVehicles: [...selectedVehicles, vehicle]
          });
        }
      },

      updateVehicleDescription: (id: string, description: string) => {
        const { selectedVehicles } = get();
        set({
          selectedVehicles: selectedVehicles.map(vehicle =>
            vehicle._id === id
              ? { ...vehicle, clientDescription: description }
              : vehicle
          )
        });
      },

      clearSelectedVehicles: () => {
        set({ selectedVehicles: [] });
        saveSelectedVehicles([]);
      }
    }),
    {
      name: 'vehicle-storage',
      partialize: (state) => ({
        selectedVehicles: state.selectedVehicles
      })
    }
  )
);

export { useVehicleStore };
