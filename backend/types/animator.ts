import { EVENT_TYPES } from '../constants/types';

export interface IAnimator {
  name: string;
  description: string;
  experience: number;
  pricePerHour: number;
  pricePerDay?: number;
  capacity: number;
  rating: number;
  reviews: string[];
  equipment: Array<{
    name: string;
    description?: string;
    quantity: number;
  }>;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  images: string[];
  eventTypes: Array<keyof typeof EVENT_TYPES>;
  ageRange: {
    min: number;
    max: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 