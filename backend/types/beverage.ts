import { EVENT_TYPES } from '../constants/types';

export type BeverageType = 'ALCOHOLIC' | 'NON_ALCOHOLIC' | 'HOT_DRINKS' | 'COCKTAILS' | 'PACKAGES' | 'BAR';

export interface IBeverage {
  name: string;
  type: BeverageType;
  description: string;
  isPackage: boolean;
  items?: Array<{
    name: string;
    type: Exclude<BeverageType, 'PACKAGES' | 'BAR'>;
    volume: number;
    quantity: number;
    price: number;
  }>;
  volume?: number;
  totalPrice: number;
  isAlcoholic: boolean;
  alcoholContent?: number;
  ingredients: string[];
  eventTypes: Array<keyof typeof EVENT_TYPES>;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 