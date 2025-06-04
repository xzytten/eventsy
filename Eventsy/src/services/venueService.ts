import axios from 'axios';
import { type IVenue } from '@/types/venue';
import { API_URL } from '@/config';
// const API_URL = '/api/venues'; // Переконайтеся, що цей URL відповідає маршруту бекенду

export const venueService = {
    // Отримати всі локації
    getAll: async (): Promise<IVenue[]> => {
        const response = await axios.get(`${API_URL}/venues`);
        return response.data;
    },

    // Отримати локацію за ID
    getById: async (id: string): Promise<IVenue> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    // TODO: Додати інші методи CRUD, якщо вони потрібні на фронтенді
    // create: async (venueData: Partial<IVenue>): Promise<IVenue> => {
    //     const response = await axios.post(API_URL, venueData);
    //     return response.data;
    // },
    // update: async (id: string, updateData: Partial<IVenue>): Promise<IVenue> => {
    //     const response = await axios.put(`${API_URL}/${id}`, updateData);
    //     return response.data;
    // },
    // remove: async (id: string): Promise<void> => {
    //     await axios.delete(`${API_URL}/${id}`);
    // },
}; 