import { FoodType, EventType } from '../constants/types';

export interface IFood {
  _id?: string;
  name: string;
  type: FoodType;
  description: string;
  // Для окремих страв
  weight?: number;
  portion?: number;
  price?: number;
  // Для наборів
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice?: number;
  servesPeople?: string;
  eventTypes: EventType[];
  isVegetarian: boolean;
  isVegan: boolean;
  allergens: string[];
  images: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 