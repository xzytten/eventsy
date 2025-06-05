import { API_URL } from '@/config';
import { type EventType } from '@/constants/types';

interface IServiceItem {
    serviceId: string;
    clientDescription?: string;
    quantity?: number;
    hours?: number;
    paymentType?: 'full' | 'hourly';
}

interface IOrderData {
    eventType: EventType;
    eventDate: Date;
    generalDescription?: string;
    venues?: IServiceItem[];
    food?: IServiceItem[];
    animators?: IServiceItem[];
    vehicles?: IServiceItem[];
    music?: IServiceItem[];
    beverages?: IServiceItem[];
    photographers?: IServiceItem[];
    totalPrice: number;
}
 
export const cartService = {
    async createOrder(orderData: IOrderData): Promise<any> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create order');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
}; 