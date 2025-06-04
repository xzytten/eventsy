import axios from 'axios';
import type { IVehicle } from '@/types/vehicle';
import { API_URL } from '@/config';

export const vehicleService = {
  getAll: async (): Promise<IVehicle[]> => {
    const response = await axios.get(`${API_URL}/vehicle`);
    return response.data;
  },
};
