import axios from 'axios';
import type { IPhotographer } from '@/types/photographer';
import { API_URL } from '@/config';

export const photographerService = {
  getAll: async (): Promise<IPhotographer[]> => {
    const response = await axios.get(`${API_URL}/photographers`);
    return response.data;
  },
};
