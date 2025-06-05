import { type EventType } from '../constants/types';

export interface IVenue {
  _id?: string;
  name: string;
  description: string;
  address: string;
  capacity?: number;
  pricePerHour?: number;
  pricePerDay?: number;
  eventTypes: EventType[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  rating: number;
  reviews: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  images?: string[];
  clientDescription?: string;
} 