import { type ServiceCategory, type EventType } from '@/types/services';

export type PaymentType = 'full' | 'hourly';

export interface CartItem {
    id: string;
    title: string;
    category: ServiceCategory;
    price?: number;
    hourlyPrice?: number;
    duration: string;
    location: string;
    image: string;
    quantity: number;
    paymentType: PaymentType;
    hours?: number;
    description?: string;
    eventTypes: EventType[];
} 