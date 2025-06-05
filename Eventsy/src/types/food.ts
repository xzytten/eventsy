import type { EventType } from '../constants/types'; // Assuming EventType is defined here or similarly

export interface IFood {
  _id?: string; // MongoDB ObjectId
  name: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'BUFFET' | 'CANAPES' | 'DESSERTS' | 'INDIVIDUAL_DISHES' | 'FAST_FOOD';
  description: string;
  weight?: number; // вага в грамах
  portion?: number; // кількість порцій
  price?: number; // ціна за вагу/порцію (для окремих страв)
  items?: Array<{ // для наборів
    name?: string;
    quantity?: number;
    price?: number;
  }>;
  totalPrice?: number; // для наборів
  servesPeople?: string; // на скільки осіб
  eventTypes: EventType[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  allergens?: string[];
  images?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  clientDescription?: string;
  quantity?: number; // кількість для замовлення
} 