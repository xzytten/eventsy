import axios from 'axios';
import type { IBeverage } from '@/types/beverage'; // Assuming you will create this type
import { API_URL } from '@/config';

export const beverageService = {
  getAll: async (): Promise<IBeverage[]> => {
    const response = await axios.get(`${API_URL}/beverage`); 
    return response.data;
  },

  // You can add other service methods here if needed (e.g., getById, create, update, delete)
};

