import type { EventType } from '../constants/types';

export interface IVehicle {
  _id?: string;
  name: string;
  type: 'LUXURY_CAR' | 'LIMOUSINE' | 'BUS' | 'MINIVAN' | 'SPECIAL_EVENT_VEHICLE';
  brand: string;
  model: string;
  year: number;
  capacity: number;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  eventTypes: EventType[];
  images: string[];
  rating: number;
  reviews: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 