import axios from 'axios';
import type { IFood } from '@/types/food'; // Assuming you will create this type
import { API_URL } from '@/config';

export const foodService = {
  getAll: async (): Promise<IFood[]> => {
    const response = await axios.get(`${API_URL}/food`); // Assuming the backend endpoint is /api/food
    return response.data;
  },

  // You can add other service methods here if needed (e.g., getById, create, update, delete)
};
