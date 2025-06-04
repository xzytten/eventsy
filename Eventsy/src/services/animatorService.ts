import axios from 'axios';
import type { IAnimator} from '../types/animator';

const API_URL = 'http://localhost:8087/api';

export const animatorService = {
  getAll: async (): Promise<IAnimator[]> => {
    const response = await axios.get(`${API_URL}/animator`);
    return response.data;
  },

  getById: async (id: string): Promise<IAnimator> => {
    const response = await axios.get(`${API_URL}/animators/${id}`);
    return response.data;
  },
}; 