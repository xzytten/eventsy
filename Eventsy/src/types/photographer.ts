import type { EventType } from '../constants/types'; // Assuming EventType is defined here or similarly

export interface IPhotographer {
    _id: string;
    name: string;
    experience: number;
    specialization: string[];
    description?: string;
    pricePerHour?: number;
    hours?: number;
    pricePerDay: number;
    images: string[],
    eventTypes: EventType[];
    createdAt?: Date;
    updatedAt?: Date;
    clientDescription?: string;
    paymentType?: 'full' | 'hourly';
} 