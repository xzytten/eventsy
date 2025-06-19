import { FoodType, EventType } from '../constants/types';

export interface IFood {
  _id?: string;
  name: string;
  type: FoodType;
  description: string;
  weight?: number;
  portion?: number;
  price?: number;
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